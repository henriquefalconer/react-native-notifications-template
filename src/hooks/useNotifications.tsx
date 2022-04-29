import React, { useEffect, useState } from 'react';
import messaging from '@react-native-firebase/messaging';
import { useNotification } from 'react-native-internal-notification';
import { useNavigation } from '@react-navigation/native';
import { Image, Platform } from 'react-native';

import useAuth from './useAuth';

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

  const { setFcmToken } = useAuth();

  const notificationHandler = useNotification();

  const saveTokenToDatabase = async (token: string) => {
    // Send token to your API, so that backend can send push notifications to user.
    console.log('FCM token:', token);

    setFcmToken(token);
  };

  useEffect(() => {
    const requestUserPermission = async () => {
      // Triggers a native permission dialog requesting the user's permission.
      const authStatus = await messaging().requestPermission();

      if (authStatus === messaging.AuthorizationStatus.AUTHORIZED) {
        setNotificationsEnabled(true);
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notificationsEnabled]);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      // Notification received while app in open state.

      // Code executed via this handler has access to React context and is able to interact with your application (e.g. updating the state or UI).

      const { notification } = remoteMessage;

      if (!notification) return;

      const imageUrl =
        Platform.OS === 'ios'
          ? (remoteMessage.data?.fcm_options as any)?.image
          : notification.android?.imageUrl;

      notificationHandler.showNotification({
        title: notification.title as string,
        message: notification.body,
        showingTime: 6000,
        icon: imageUrl ? (
          <Image
            // eslint-disable-next-line react-native/no-inline-styles
            style={{ width: '100%', height: '100%' }}
            source={{ uri: imageUrl }}
          />
        ) : undefined,
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
