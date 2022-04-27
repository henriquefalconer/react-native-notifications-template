# Template de 🌎 Push Notifications p/ 📱 React Native

Utilizando Firebase Cloud Messaging

## Como utilizar 👈🏻

Rode o seguinte comando no seu terminal (se tiver utilizando Windows, utilize o [WSL](https://docs.microsoft.com/pt-br/windows/wsl/install)):

```sh
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/henriquefalconer/notificationstemplate/main/install.sh)"
```

Em seguida, baixe os arquivos de [configuração do Firebase](https://rnfirebase.io/#2-android-setup) e altere o conteúdo de `google-services.json` (**android/app**) e de `GoogleService-Info.plist` (**ios/[nome do projeto]**).

Dentro dos arquivos [`src/hooks/useAuth.tsx`](https://github.com/henriquefalconer/react-native-notifications-template/blob/main/src/hooks/useAuth.tsx) e [`hooks/useNotifications.tsx`](https://github.com/henriquefalconer/react-native-notifications-template/blob/main/src/hooks/useNotifications.tsx), você encontrará a porção do código responsável pela configuração e recebimento das notificações.

Para a implementação do envio de notificações pelo backend, siga os passos de documentação da lib [firebase-admin](https://github.com/firebase/firebase-admin-node) para Node.js.

## Links utilizados 🔗
- [Documentação de Cloud Messaging do Firebase](https://rnfirebase.io/messaging/usage)
- [Guia de implementação TerraLAB](http://www2.decom.ufop.br/terralab/saiba-como-implementar-o-servico-de-notificacoes-no-seu-app-react-native-utilizando-a-firebase/)
