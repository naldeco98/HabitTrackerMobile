import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      users: [],
      register: (username, password) => {
        const { users } = get();
        const cleanUser = username.trim();
        const existing = users.find(
          (u) => u.username.toLowerCase() === cleanUser.toLowerCase()
        );
        if (existing) {
          return { success: false, error: 'El nombre de usuario ya está registrado.' };
        }
        const newUser = {
          id: Date.now().toString(),
          username: cleanUser,
          password,
        };
        set({ users: [...users, newUser] });
        return { success: true, user: newUser };
      },
      login: (username, password) => {
        const { users } = get();
        const cleanUser = username.trim();
        const userFound = users.find(
          (u) =>
            u.username.toLowerCase() === cleanUser.toLowerCase() &&
            u.password === password
        );
        if (!userFound) {
          return { success: false, error: 'Usuario o contraseña incorrectos.' };
        }
        set({ user: userFound });
        return { success: true, user: userFound };
      },
      logout: () => {
        set({ user: null });
      },
    }),
    {
      name: '@auth_store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
