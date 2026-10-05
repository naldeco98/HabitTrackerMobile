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
} from 'react-native';
import { saveHabit } from '../services/storageService';
import { scheduleHabitNotification } from '../services/notificationService';
import { validateHabitForm } from '../utils/validators';
import CustomButton from '../components/CustomButton';

export const CreateHabitScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [frequency, setFrequency] = useState('diario');
  const [enableNotification, setEnableNotification] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    const validation = validateHabitForm(title, frequency);
    if (!validation.isValid) {
      Alert.alert('Atención', validation.error);
      return;
    }

    setLoading(true);

    const res = await saveHabit({ title, frequency });

    if (!res.success) {
      setLoading(false);
      Alert.alert('Error', res.error);
      return;
    }

    if (enableNotification) {
      await scheduleHabitNotification(title, 5);
      Alert.alert(
        'Hábito guardado',
        `Se agregó "${title}" y se programó una notificación en 5 segundos.`,
        [{ text: 'Aceptar', onPress: () => navigation.goBack() }]
      );
    } else {
      Alert.alert('Hábito guardado', `Se agregó "${title}" correctamente.`, [
        { text: 'Aceptar', onPress: () => navigation.goBack() },
      ]);
    }

    setLoading(false);
  };

  const handleTestNotificationOnly = async () => {
    const habitNameToNotify = title.trim() ? title : 'Hábito de prueba';
    const notifId = await scheduleHabitNotification(habitNameToNotify, 5);
    if (notifId) {
      Alert.alert(
        'Notificación programada',
        `Se disparará una notificación en 5 segundos para "${habitNameToNotify}".`
      );
    } else {
      Alert.alert('Permiso denegado', 'Por favor habilite los permisos de notificación.');
    }
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
            Complete los siguientes campos para registrar un nuevo hábito.
          </Text>

          <Text style={styles.label}>Nombre del hábito</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Leer 15 minutos"
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

          <View style={styles.notificationBox}>
            <View style={styles.notificationHeader}>
              <View style={styles.notificationInfo}>
                <Text style={styles.notificationTitle}>Recordatorio local</Text>
                <Text style={styles.notificationDesc}>
                  Programar alerta a los 5 segundos
                </Text>
              </View>
              <Switch
                value={enableNotification}
                onValueChange={setEnableNotification}
                trackColor={{ false: '#CBD5E1', true: '#93C5FD' }}
                thumbColor={enableNotification ? '#2563EB' : '#F1F5F9'}
              />
            </View>

            <TouchableOpacity
              style={styles.testNotifBtn}
              onPress={handleTestNotificationOnly}
              activeOpacity={0.7}
            >
              <Text style={styles.testNotifText}>Probar notificación de prueba (5s)</Text>
            </TouchableOpacity>
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
    marginBottom: 18,
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
  notificationBox: {
    marginTop: 20,
    padding: 14,
    borderRadius: 6,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationInfo: {
    flex: 1,
    paddingRight: 10,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  notificationDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  testNotifBtn: {
    marginTop: 10,
    backgroundColor: '#E2E8F0',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  testNotifText: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '500',
  },
  saveBtn: {
    marginTop: 20,
  },
});

export default CreateHabitScreen;
