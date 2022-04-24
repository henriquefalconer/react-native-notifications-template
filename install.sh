#!/bin/bash

# Formatação da saída padrão
LIGHTBLUE='\e[94m'
GREEN='\e[32m'
NOCOLOR='\e[0m'
TTYDIMMED='\e[2m'
TTYBOLD='\033[1;39m'
TTYRESET='\033[1;0m'
PREVLINE='\033[1A'

SEDCONFIG='-i'

OS=$(uname)
if [ $OS = "Darwin" ]; then
  SEDCONFIG="-i ''"
fi

# Permite utilizar regex no Git Bash do Windows (ele não aceita o =~).
regexmatch() {
  if ! printf "$1" | grep -E "$2" >>/dev/null; then
    return 1
  fi
}

readinput() {
  printf "$1 $TTYBOLD"
  read INPUT
  printf "$TTYRESET"
  if [ -z $INPUT ]; then INPUT=$2; printf "$PREVLINE$1 $TTYDIMMED$2$TTYRESET\n"; fi
  eval "$3=$INPUT"
}

yesorno() {
  readinput "$1 (Y/n)" 'Y' USERRESPONSE
  if regexmatch "$USERRESPONSE" '^[^yY]$'; then
    return 1
  fi
}

checkoverwrite() {
  for file in $@; do
    if [ -f "$file" ] || [ -d "$file" ]; then
      printf '\n'
      if ! yesorno "O $([ -d "$file" ] && printf "diretório" || printf "arquivo") ${LIGHTBLUE}$file${NOCOLOR} já existe. Você gostaria de $([ -d "$file" ] && printf "sobrescrever os arquivos dentro dele" || printf "sobrescrevê-lo")?"; then
        printf '\n'
        return 1
      fi
      printf '\n'
      return 0
    fi
  done
}

trap ctrl_c INT

ctrl_c() {
  if ! [ -z $pid ]; then
    kill $pid
    printf '\nEncerrando execução...\n'
    sleep .5
  fi
  exit
}

spin() {
  while true; do
    for c in '⠙' '⠸' '⠴' '⠦' '⠇' '⠋'; do
      printf "\r${LIGHTBLUE}$c${NOCOLOR} $1"
      sleep .1
    done
  done
}

initspin() {
  spin "$1" &
  pid=$!
}

endspin() {
  kill $pid
  wait $pid 2>/dev/null
  printf "\r${GREEN}✔${NOCOLOR} $1\n"
}

downloadtemplate() {
  initspin "$1"
  git clone 'https://www.github.com/henriquefalconer/notificationstemplate' $PROJECTNAME -q
  endspin "$1"
}

changeallinfileoccurances() {
  eval "LC_ALL=C find . -type f -exec sed $SEDCONFIG \"s/$1/$2/g\" {} \;"
}

changeallfilenameoccurances() {
  for fileType in d f; do
    find . -type $fileType -name "$1*" | while read file; do
      mv $file $( sed -r "s/$1/$2/" <<< $file )
    done
  done
}

processtemplate() {
  initspin "$1"
  cd $PROJECTNAME
  rm -rf .git
  rm install.sh >/dev/null 2>&1
  if [ $PROJECTNAME != 'notificationstemplate' ]; then
    changeallinfileoccurances "notificationstemplate" $PROJECTNAME
    changeallfilenameoccurances "notificationstemplate" $PROJECTNAME
  fi
  changeallinfileoccurances "com.polijunior.notifications" $PROJECTID
  endspin "$1"
}

firstcommit() {
  initspin "$1"
  git init >/dev/null 2>&1
  git add . >/dev/null 2>&1
  git commit -m "Initial commit" >/dev/null 2>&1
  endspin "$1"
}

runyarn() {
  initspin "$1"
  yarn >/dev/null 2>&1
  endspin "$1"
}

printf '\n'

readinput 'Digite o nome do projeto (em minúsculas e sem espaço):' 'notificationstemplate' PROJECTNAME

if checkoverwrite $PROJECTNAME; then rm -rf $PROJECTNAME; else exit; fi

readinput "Digite o ID do projeto (com.polijunior.${PROJECTNAME}):" "com.polijunior.${PROJECTNAME}" PROJECTID

printf '\n'

downloadtemplate 'Baixando template'

processtemplate 'Processando template'

firstcommit 'Realizando commit'

runyarn 'Instalando dependências'

sleep 2

printf "\n${TTYBOLD}Criado novo projeto $PROJECTNAME!$TTYRESET\nPara começar a trabalhar, rode 'cd $PROJECTNAME'\n\n"
