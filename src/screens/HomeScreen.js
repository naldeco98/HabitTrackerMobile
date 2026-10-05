import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { getHabits, toggleHabitStatus, deleteHabit } from '../services/storageService';
import { calculateHabitProgress, filterHabitsByFrequency } from '../utils/validators';
import HabitCard from '../components/HabitCard';
import CustomButton from '../components/CustomButton';

export const HomeScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const [habits, setHabits] = useState([]);
  const [activeFilter, setActiveFilter] = useState('todos');
  const [refreshing, setRefreshing] = useState(false);

  const loadHabits = useCallback(async () => {
    const data = await getHabits();
    setHabits(data);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadHabits();
    });
    loadHabits();
    return unsubscribe;
  }, [navigation, loadHabits]);

  const handleToggle = async (id) => {
    const res = await toggleHabitStatus(id);
    if (res.success) {
      setHabits(res.habits);
    } else {
      Alert.alert('Error', res.error);
    }
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Eliminar Hábito',
      '¿Desea eliminar este hábito?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const res = await deleteHabit(id);
            if (res.success) {
              setHabits(res.habits);
            } else {
              Alert.alert('Error', res.error);
            }
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert('Cerrar Sesión', '¿Desea cerrar la sesión actual?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: logout },
    ]);
  };

  const progress = calculateHabitProgress(habits);
  const filteredHabits = filterHabitsByFrequency(habits, activeFilter);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.topBar}>
        <View>
          <Text style={styles.greeting}>Hola, {user ? user.username : 'Usuario'}</Text>
          <Text style={styles.subtitle}>Panel de control de rutinas</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.7}>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Progreso de hábitos</Text>
          <Text style={styles.progressPercent}>{progress.percentage}%</Text>
        </View>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${progress.percentage}%` }]} />
        </View>
        <Text style={styles.progressDetails}>
          {progress.completed} de {progress.total} completados
        </Text>
      </View>

      <View style={styles.filterRow}>
        {[
          { key: 'todos', label: 'Todos' },
          { key: 'diario', label: 'Diarios' },
          { key: 'semanal', label: 'Semanales' },
        ].map((item) => (
          <TouchableOpacity
            key={item.key}
            style={[styles.filterChip, activeFilter === item.key && styles.activeFilterChip]}
            onPress={() => setActiveFilter(item.key)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.filterChipText,
                activeFilter === item.key && styles.activeFilterChipText,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredHabits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <HabitCard habit={item} onToggle={handleToggle} onDelete={handleDelete} />
        )}
        contentContainerStyle={styles.listContainer}
        refreshing={refreshing}
        onRefresh={async () => {
          setRefreshing(true);
          await loadHabits();
          setRefreshing(false);
        }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No hay hábitos en esta sección</Text>
            <Text style={styles.emptySubtitle}>
              Utilice el botón de abajo para registrar un nuevo hábito.
            </Text>
          </View>
        }
      />

      <View style={styles.bottomBar}>
        <CustomButton
          title="Agregar Hábito"
          onPress={() => navigation.navigate('CreateHabit')}
          variant="primary"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  greeting: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  logoutBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
  },
  logoutText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '600',
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  progressPercent: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2563EB',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#16A34A',
    borderRadius: 4,
  },
  progressDetails: {
    fontSize: 12,
    color: '#64748B',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
    backgroundColor: '#E2E8F0',
    marginRight: 8,
  },
  activeFilterChip: {
    backgroundColor: '#2563EB',
  },
  filterChipText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },
  activeFilterChipText: {
    color: '#FFFFFF',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 85,
    flexGrow: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
});

export default HomeScreen;
