import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { takePhotoWithCamera, pickImageFromGallery } from '../services/deviceService';

export const HabitCard = ({
  habit,
  onToggle,
  onDelete,
  onAttachEvidence,
  testID,
}) => {
  const isCompleted = habit.completed;

  const handleSelectEvidenceSource = () => {
    Alert.alert(
      'Foto de evidencia',
      'Seleccione de dónde desea obtener la imagen',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cámara',
          onPress: async () => {
            const uri = await takePhotoWithCamera();
            if (uri && onAttachEvidence) {
              onAttachEvidence(habit.id, uri);
            }
          },
        },
        {
          text: 'Galería',
          onPress: async () => {
            const uri = await pickImageFromGallery();
            if (uri && onAttachEvidence) {
              onAttachEvidence(habit.id, uri);
            }
          },
        },
      ]
    );
  };

  return (
    <View testID={testID || `habit-card-${habit.id}`} style={[styles.card, isCompleted && styles.completedCard]}>
      <View style={styles.mainRow}>
        <TouchableOpacity
          testID={`toggle-habit-${habit.id}`}
          style={[styles.checkbox, isCompleted && styles.checkboxCompleted]}
          onPress={() => onToggle && onToggle(habit.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.checkText}>{isCompleted ? '✓' : ''}</Text>
        </TouchableOpacity>

        <View style={styles.infoContainer}>
          <Text style={[styles.title, isCompleted && styles.completedTitle]}>
            {habit.title}
          </Text>

          <View style={styles.badgeRow}>
            <View style={[styles.badge, habit.frequency === 'diario' ? styles.dailyBadge : styles.weeklyBadge]}>
              <Text style={styles.badgeText}>
                {habit.frequency === 'diario' ? 'Diario' : 'Semanal'}
              </Text>
            </View>
            {habit.calendarEventScheduled ? (
              <View style={[styles.badge, styles.calendarBadge]}>
                <Text style={styles.calendarBadgeText}>Calendario</Text>
              </View>
            ) : null}
            {habit.createdAt ? (
              <Text style={styles.dateText}>Agregado: {habit.createdAt}</Text>
            ) : null}
          </View>
        </View>

        <TouchableOpacity
          testID={`delete-habit-${habit.id}`}
          style={styles.deleteButton}
          onPress={() => onDelete && onDelete(habit.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.deleteText}>Eliminar</Text>
        </TouchableOpacity>
      </View>

      {habit.location ? (
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Lugar:</Text>
          <Text style={styles.detailValue} numberOfLines={1}>
            {habit.location.address || `${habit.location.latitude.toFixed(4)}, ${habit.location.longitude.toFixed(4)}`}
          </Text>
        </View>
      ) : null}

      {habit.contact ? (
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Compañero:</Text>
          <Text style={styles.detailValue}>
            {habit.contact.name} {habit.contact.phone ? `(${habit.contact.phone})` : ''}
          </Text>
        </View>
      ) : null}

      {habit.imageUri ? (
        <View style={styles.imageSection}>
          <Image
            source={{ uri: habit.imageUri }}
            style={styles.evidenceImage}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={styles.changeImageButton}
            onPress={handleSelectEvidenceSource}
          >
            <Text style={styles.changeImageText}>Cambiar foto</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.addEvidenceButton}
          onPress={handleSelectEvidenceSource}
          activeOpacity={0.7}
        >
          <Text style={styles.addEvidenceText}>+ Adjuntar foto de evidencia</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 14,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  completedCard: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: '#FFFFFF',
  },
  checkboxCompleted: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
  },
  checkText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  badge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  dailyBadge: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  weeklyBadge: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
  },
  calendarBadge: {
    backgroundColor: '#F3E8FF',
    borderColor: '#D8B4FE',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#334155',
  },
  calendarBadgeText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#7E22CE',
  },
  dateText: {
    fontSize: 11,
    color: '#64748B',
  },
  deleteButton: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 4,
    backgroundColor: '#FEE2E2',
    marginLeft: 8,
  },
  deleteText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '600',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    width: 80,
  },
  detailValue: {
    fontSize: 12,
    color: '#1E293B',
    flex: 1,
  },
  imageSection: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  evidenceImage: {
    width: 80,
    height: 60,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#F1F5F9',
  },
  changeImageButton: {
    marginLeft: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
  },
  changeImageText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  addEvidenceButton: {
    marginTop: 8,
    paddingVertical: 6,
    alignItems: 'flex-start',
  },
  addEvidenceText: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '500',
  },
});

export default HabitCard;
