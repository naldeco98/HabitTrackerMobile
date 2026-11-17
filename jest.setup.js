jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  scheduleNotificationAsync: jest.fn(() => Promise.resolve('notification-id-123')),
}));

jest.mock('expo-image-picker', () => ({
  requestCameraPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  requestMediaLibraryPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  launchCameraAsync: jest.fn(() => Promise.resolve({ canceled: false, assets: [{ uri: 'file://test-image.jpg' }] })),
  launchImageLibraryAsync: jest.fn(() => Promise.resolve({ canceled: false, assets: [{ uri: 'file://test-gallery.jpg' }] })),
  MediaTypeOptions: { Images: 'Images' },
}));

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  getCurrentPositionAsync: jest.fn(() => Promise.resolve({
    coords: { latitude: -34.6037, longitude: -58.3816 }
  })),
  reverseGeocodeAsync: jest.fn(() => Promise.resolve([
    { street: 'Av. Corrientes', name: '1234', city: 'Buenos Aires' }
  ])),
  Accuracy: { Balanced: 3 },
}));

jest.mock('expo-contacts', () => ({
  requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  presentContactPickerAsync: jest.fn(() => Promise.resolve({
    name: 'Juan Perez',
    phoneNumbers: [{ number: '+5491123456789' }]
  })),
  getContactsAsync: jest.fn(() => Promise.resolve({
    data: [{ id: '1', name: 'Juan Perez', phoneNumbers: [{ number: '+5491123456789' }] }]
  })),
  Fields: { PhoneNumbers: 'phoneNumbers' },
}));

jest.mock('expo-calendar', () => ({
  requestCalendarPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  getCalendarsAsync: jest.fn(() => Promise.resolve([
    { id: '1', allowsModifications: true, isPrimary: true }
  ])),
  createEventAsync: jest.fn(() => Promise.resolve('event-id-123')),
  EntityTypes: { EVENT: 'event' },
}));
