import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export const HabitCard = ({ habit, onToggle, onDelete, testID }) => {
  const isCompleted = habit.completed;

  return (
    <View testID={testID || `habit-card-${habit.id}`} style={[styles.card, isCompleted && styles.completedCard]}>
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
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 14,
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  completedCard: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
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
  },
  badge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
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
  badgeText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#334155',
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
});

export default HabitCard;
