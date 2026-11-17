import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
  Image,
} from 'react-native';
import { useHabitStore } from '../store/useHabitStore';
import {
  takePhotoWithCamera,
  pickImageFromGallery,
  getCurrentDeviceLocation,
  pickDeviceContact,
  scheduleCalendarEvent,
} from '../services/deviceService';
import { scheduleHabitNotification } from '../services/notificationService';
import { validateHabitForm } from '../utils/validators';
import CustomButton from '../components/CustomButton';

export const CreateHabitScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [frequency, setFrequency] = useState('diario');
  const [imageUri, setImageUri] = useState(null);
  const [location, setLocation] = useState(null);
  const [contact, setContact] = useState(null);
  const [syncCalendar, setSyncCalendar] = useState(false);
  const [enableNotification, setEnableNotification] = useState(true);
  const [loading, setLoading] = useState(false);

  const addHabit = useHabitStore((state) => state.addHabit);

  const handleTakePhoto = async () => {
    const uri = await takePhotoWithCamera();
    if (uri) setImageUri(uri);
  };

  const handlePickGallery = async () => {
    const uri = await pickImageFromGallery();
    if (uri) setImageUri(uri);
  };

  const handleGetLocation = async () => {
    const loc = await getCurrentDeviceLocation();
    if (loc) {
      setLocation(loc);
      Alert.alert('Ubicación obtenida', `Lugar registrado: ${loc.address}`);
    }
  };

  const handlePickContact = async () => {
    const selected = await pickDeviceContact();
    if (selected) {
      setContact(selected);
      Alert.alert('Contacto seleccionado', `${selected.name} fue asignado como compañero.`);
    }
  };

  const handleSave = async () => {
    const validation = validateHabitForm(title, frequency);
    if (!validation.isValid) {
      Alert.alert('Atención', validation.error);
      return;
    }

    setLoading(true);

    let calendarScheduled = false;
    if (syncCalendar) {
      calendarScheduled = await scheduleCalendarEvent(title, location ? location.address : null);
    }

    if (enableNotification) {
      await scheduleHabitNotification(title, 5);
    }

    addHabit({
      title,
      frequency,
      imageUri,
      location,
      contact,
      calendarEventScheduled: calendarScheduled,
    });

    setLoading(false);

    Alert.alert(
      'Hábito guardado',
      `Se registró "${title}" correctamente en tu lista de rutinas.`,
      [{ text: 'Aceptar', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.headerTitle}>Alta de Hábito</Text>
          <Text style={styles.headerSubtitle}>
            Complete los campos y configure los recursos del dispositivo.
          </Text>

          <Text style={styles.label}>Nombre del hábito</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Entrenar fuerza"
            placeholderTextColor="#94A3B8"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Frecuencia</Text>
          <View style={styles.frequencyRow}>
            <TouchableOpacity
              style={[
                styles.frequencyOption,
                frequency === 'diario' && styles.frequencyOptionActive,
              ]}
              onPress={() => setFrequency('diario')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.frequencyOptionText,
                  frequency === 'diario' && styles.frequencyOptionTextActive,
                ]}
              >
                Diario
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.frequencyOption,
                frequency === 'semanal' && styles.frequencyOptionActive,
              ]}
              onPress={() => setFrequency('semanal')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.frequencyOptionText,
                  frequency === 'semanal' && styles.frequencyOptionTextActive,
                ]}
              >
                Semanal
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sectionDivider} />
          <Text style={styles.sectionTitle}>Recursos del dispositivo</Text>

          <Text style={styles.label}>Foto de evidencia</Text>
          <View style={styles.resourceRow}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleTakePhoto}
              activeOpacity={0.7}
            >
              <Text style={styles.secondaryButtonText}>Tomar foto</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handlePickGallery}
              activeOpacity={0.7}
            >
              <Text style={styles.secondaryButtonText}>Elegir de galería</Text>
            </TouchableOpacity>
          </View>

          {imageUri ? (
            <View style={styles.previewContainer}>
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => setImageUri(null)}
              >
                <Text style={styles.removeButtonText}>Quitar foto</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          <Text style={styles.label}>Ubicación del hábito</Text>
          <View style={styles.resourceRow}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleGetLocation}
              activeOpacity={0.7}
            >
              <Text style={styles.secondaryButtonText}>Obtener ubicación actual</Text>
            </TouchableOpacity>
          </View>
          {location ? (
            <View style={styles.dataPreviewBox}>
              <Text style={styles.dataPreviewText} numberOfLines={2}>
                Lugar: {location.address}
              </Text>
              <TouchableOpacity onPress={() => setLocation(null)}>
                <Text style={styles.removeDataText}>Quitar</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          <Text style={styles.label}>Contacto relacionado (Compañero/Entrenador)</Text>
          <View style={styles.resourceRow}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handlePickContact}
              activeOpacity={0.7}
            >
              <Text style={styles.secondaryButtonText}>Seleccionar de agenda</Text>
            </TouchableOpacity>
          </View>
          {contact ? (
            <View style={styles.dataPreviewBox}>
              <Text style={styles.dataPreviewText}>
                Contacto: {contact.name} {contact.phone ? `(${contact.phone})` : ''}
              </Text>
              <TouchableOpacity onPress={() => setContact(null)}>
                <Text style={styles.removeDataText}>Quitar</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleTitle}>Agendar en Calendario</Text>
              <Text style={styles.toggleDesc}>Crea un evento en la agenda del dispositivo</Text>
            </View>
            <Switch
              value={syncCalendar}
              onValueChange={setSyncCalendar}
              trackColor={{ false: '#CBD5E1', true: '#93C5FD' }}
              thumbColor={syncCalendar ? '#2563EB' : '#F1F5F9'}
            />
          </View>

          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleTitle}>Notificación local</Text>
              <Text style={styles.toggleDesc}>Disparar alerta recordatoria en 5 segundos</Text>
            </View>
            <Switch
              value={enableNotification}
              onValueChange={setEnableNotification}
              trackColor={{ false: '#CBD5E1', true: '#93C5FD' }}
              thumbColor={enableNotification ? '#2563EB' : '#F1F5F9'}
            />
          </View>

          <CustomButton
            title={loading ? 'Guardando...' : 'Guardar Hábito'}
            onPress={handleSave}
            disabled={loading}
            variant="primary"
            style={styles.saveBtn}
          />

          <CustomButton
            title="Cancelar"
            onPress={() => navigation.goBack()}
            variant="outline"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#1E293B',
  },
  frequencyRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  frequencyOption: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 6,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  frequencyOptionActive: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  frequencyOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#475569',
  },
  frequencyOptionTextActive: {
    color: '#2563EB',
    fontWeight: '600',
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 18,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  resourceRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 2,
    marginBottom: 6,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '500',
  },
  previewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 8,
  },
  imagePreview: {
    width: 90,
    height: 70,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  removeButton: {
    marginLeft: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: '#FEE2E2',
  },
  removeButtonText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '500',
  },
  dataPreviewBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
    marginVertical: 4,
  },
  dataPreviewText: {
    fontSize: 12,
    color: '#1E293B',
    flex: 1,
    marginRight: 8,
  },
  removeDataText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '500',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingVertical: 6,
  },
  toggleInfo: {
    flex: 1,
    paddingRight: 10,
  },
  toggleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  toggleDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  saveBtn: {
    marginTop: 22,
  },
});

export default CreateHabitScreen;
