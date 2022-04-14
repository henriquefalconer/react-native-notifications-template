import { useEffect, useState } from 'react';
import messaging from '@react-native-firebase/messaging';
import NotificationSetting from 'react-native-open-notification';
import { useNotification } from 'react-native-internal-notification';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';

export const setBackgroundMessageHandler = () => {
  // Register background handler.
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    // This handler is not supposed to be used to update any UI. You can however perform network requests, update local storage etc.
    console.log(remoteMessage);
  });
};

const useNotifications = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const { navigate } = useNavigation();

  const notification = useNotification();

  const saveTokenToDatabase = async (token: string) => {
    // Send token to your API, so that backend can send push notifications to user.
    console.log('FCM token:', token);
  };

  useEffect(() => {
    const requestUserPermission = async () => {
      // Triggers a native permission dialog requesting the user's permission.
      const authStatus = await messaging().requestPermission();

      if (authStatus === messaging.AuthorizationStatus.AUTHORIZED) {
        setNotificationsEnabled(true);
      } else {
        Alert.alert(
          'Algumas funções do aplicativo podem nāo funcionar corretamente',
          'Ative a permissāo das notificações nas configurações de seu aparelho',
          [
            { text: 'OK', style: 'cancel' },
            { text: 'Abrir configurações', onPress: NotificationSetting.open },
          ],
        );
      }
    };

    requestUserPermission();
  }, []);

  useEffect(() => {
    const tokenRequest = async () => {
      // Gets device token.
      const token = await messaging().getToken();

      saveTokenToDatabase(token);
    };

    if (!notificationsEnabled) return;

    tokenRequest();

    // Listens to changes in token.
    return messaging().onTokenRefresh(saveTokenToDatabase);
  }, [notificationsEnabled]);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      // Notification received while app in open state.

      // Code executed via this handler has access to React context and is able to interact with your application (e.g. updating the state or UI).

      notification.showNotification({
        title: 'New notification',
        message: JSON.stringify(remoteMessage.data),
        // icon: <FontAwesome name="check-circle" size={45} />,
        onPress: () => {
          // Assumes that the notification of type "message" contains a property "type" on its payload that indicates the screen to be opened.
          const screenToNavigate = remoteMessage.data?.type;
          if (!screenToNavigate) return;
          navigate(screenToNavigate as any);
        },
      });
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Assumes that the notification of type "message" contains a property "type" on its payload that indicates the screen to be opened.

    const initialNotificationHandler = async () => {
      // Checking if an initial notification is available.
      const remoteMessage = await messaging().getInitialNotification();

      if (!remoteMessage) return;

      // Notification caused app to open from foreground state.

      const screenToNavigate = remoteMessage.data?.type;

      if (!screenToNavigate) return;

      navigate(screenToNavigate as any);
    };

    initialNotificationHandler();

    messaging().onNotificationOpenedApp(remoteMessage => {
      const screenToNavigate = remoteMessage.data?.type;

      // Notification caused app to open from background state.

      if (!screenToNavigate) return;

      navigate(screenToNavigate as any);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useNotifications;
