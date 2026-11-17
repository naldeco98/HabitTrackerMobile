import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useHabitStore = create(
  persist(
    (set, get) => ({
      habits: [],
      addHabit: (habitData) => {
        const newHabit = {
          id: Date.now().toString(),
          title: habitData.title.trim(),
          frequency: habitData.frequency || 'diario',
          completed: false,
          createdAt: new Date().toLocaleDateString('es-AR'),
          imageUri: habitData.imageUri || null,
          location: habitData.location || null,
          contact: habitData.contact || null,
          calendarEventScheduled: habitData.calendarEventScheduled || false,
        };
        set((state) => ({
          habits: [newHabit, ...state.habits],
        }));
        return newHabit;
      },
      toggleHabit: (id) => {
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === id ? { ...h, completed: !h.completed } : h
          ),
        }));
      },
      deleteHabit: (id) => {
        set((state) => ({
          habits: state.habits.filter((h) => h.id !== id),
        }));
      },
      updateHabit: (id, fields) => {
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === id ? { ...h, ...fields } : h
          ),
        }));
      },
      attachEvidenceImage: (id, imageUri) => {
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === id ? { ...h, imageUri } : h
          ),
        }));
      },
      setHabits: (habits) => set({ habits }),
    }),
    {
      name: '@habits_store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
