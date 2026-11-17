import { useHabitStore } from '../store/useHabitStore';

describe('Test de Estado Global con Zustand: useHabitStore', () => {
  beforeEach(() => {
    useHabitStore.setState({ habits: [] });
  });

  test('debe agregar un hábito correctamente al store', () => {
    const newHabit = useHabitStore.getState().addHabit({
      title: 'Leer 30 minutos',
      frequency: 'diario',
      location: { address: 'Biblioteca' },
    });

    const habits = useHabitStore.getState().habits;
    expect(habits.length).toBe(1);
    expect(habits[0].title).toBe('Leer 30 minutos');
    expect(habits[0].completed).toBe(false);
    expect(habits[0].location.address).toBe('Biblioteca');
    expect(newHabit.id).toBeDefined();
  });

  test('debe alternar el estado completado del hábito', () => {
    useHabitStore.getState().addHabit({
      title: 'Meditar',
      frequency: 'diario',
    });

    const habitId = useHabitStore.getState().habits[0].id;
    useHabitStore.getState().toggleHabit(habitId);

    expect(useHabitStore.getState().habits[0].completed).toBe(true);

    useHabitStore.getState().toggleHabit(habitId);
    expect(useHabitStore.getState().habits[0].completed).toBe(false);
  });

  test('debe eliminar un hábito del store', () => {
    useHabitStore.getState().addHabit({
      title: 'Correr 5km',
      frequency: 'semanal',
    });

    const habitId = useHabitStore.getState().habits[0].id;
    expect(useHabitStore.getState().habits.length).toBe(1);

    useHabitStore.getState().deleteHabit(habitId);
    expect(useHabitStore.getState().habits.length).toBe(0);
  });
});
