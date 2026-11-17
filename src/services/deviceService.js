import { Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Contacts from 'expo-contacts';
import * as Calendar from 'expo-calendar';

export const takePhotoWithCamera = async () => {
  try {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permiso denegado',
        'No se concedió acceso a la cámara. Debe habilitar el permiso en la configuración del dispositivo para tomar fotos.'
      );
      return null;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      return result.assets[0].uri;
    }
    return null;
  } catch (error) {
    Alert.alert('Error', 'No se pudo abrir la cámara.');
    return null;
  }
};

export const pickImageFromGallery = async () => {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permiso denegado',
        'No se concedió acceso a la galería de fotos. Debe habilitar el permiso para seleccionar imágenes.'
      );
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      return result.assets[0].uri;
    }
    return null;
  } catch (error) {
    Alert.alert('Error', 'No se pudo acceder a la galería.');
    return null;
  }
};

export const getCurrentDeviceLocation = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permiso denegado',
        'No se concedió acceso a la ubicación. Debe habilitar el permiso para registrar el lugar del hábito.'
      );
      return null;
    }

    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const { latitude, longitude } = position.coords;
    let address = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

    try {
      const reverse = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (reverse && reverse.length > 0) {
        const item = reverse[0];
        const parts = [item.street, item.name, item.city || item.region].filter(Boolean);
        if (parts.length > 0) {
          address = parts.join(' ');
        }
      }
    } catch (e) {}

    return {
      latitude,
      longitude,
      address,
    };
  } catch (error) {
    Alert.alert('Error', 'No se pudo obtener la ubicación actual.');
    return null;
  }
};

export const pickDeviceContact = async () => {
  try {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permiso denegado',
        'No se concedió acceso a la agenda de contactos. Debe habilitar el permiso para vincular un compañero o entrenador.'
      );
      return null;
    }

    if (Contacts.presentContactPickerAsync) {
      const selected = await Contacts.presentContactPickerAsync();
      if (selected) {
        const phone = selected.phoneNumbers && selected.phoneNumbers.length > 0
          ? selected.phoneNumbers[0].number
          : '';
        return {
          name: selected.name || 'Sin nombre',
          phone,
        };
      }
    }

    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.PhoneNumbers],
      pageSize: 1,
    });

    if (data && data.length > 0) {
      const contact = data[0];
      const phone = contact.phoneNumbers && contact.phoneNumbers.length > 0
        ? contact.phoneNumbers[0].number
        : '';
      return {
        name: contact.name || 'Sin nombre',
        phone,
      };
    }

    Alert.alert('Aviso', 'No se encontraron contactos en el dispositivo.');
    return null;
  } catch (error) {
    Alert.alert('Error', 'No se pudo seleccionar el contacto.');
    return null;
  }
};

export const scheduleCalendarEvent = async (habitTitle, locationText) => {
  try {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permiso denegado',
        'No se concedió acceso al calendario. Debe habilitar el permiso para crear recordatorios en la agenda.'
      );
      return false;
    }

    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    const modifiableCalendar = calendars.find(
      (c) => c.allowsModifications && (c.isPrimary || c.source?.isLocalAccount || Platform.OS === 'android')
    ) || calendars.find((c) => c.allowsModifications) || calendars[0];

    if (!modifiableCalendar) {
      Alert.alert('Error', 'No se encontró un calendario disponible para escribir en el dispositivo.');
      return false;
    }

    const startDate = new Date();
    startDate.setHours(startDate.getHours() + 1);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

    await Calendar.createEventAsync(modifiableCalendar.id, {
      title: `Hábito: ${habitTitle}`,
      startDate,
      endDate,
      timeZone: 'GMT-3',
      location: locationText || undefined,
      notes: 'Recordatorio programado desde Seguimiento de Hábitos.',
    });

    return true;
  } catch (error) {
    Alert.alert('Error', 'No se pudo agendar el evento en el calendario.');
    return false;
  }
};
