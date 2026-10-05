import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const requestNotificationPermissions = async () => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return false;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#2563EB',
      });
    }

    return true;
  } catch (error) {
    console.error('Error al solicitar permisos de notificación:', error);
    return false;
  }
};

export const scheduleHabitNotification = async (habitTitle, seconds = 5) => {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      console.warn('Permisos de notificación no otorgados.');
      return null;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Recordatorio de Hábito',
        body: `Recordatorio: ${habitTitle}`,
        sound: true,
        data: { habitTitle },
      },
      trigger: {
        seconds: seconds > 0 ? seconds : 5,
      },
    });

    return notificationId;
  } catch (error) {
    console.error('Error al programar la notificación:', error);
    return null;
  }
};
