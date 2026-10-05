import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = '@habits_app_users';
const CURRENT_USER_KEY = '@habits_app_current_user';
const HABITS_KEY = '@habits_app_items';

export const getUsers = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(USERS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error al obtener usuarios:', e);
    return [];
  }
};

export const registerUser = async (username, password) => {
  try {
    const users = await getUsers();
    const existing = users.find(u => u.username.toLowerCase() === username.trim().toLowerCase());
    if (existing) {
      return { success: false, error: 'El nombre de usuario ya está registrado.' };
    }

    const newUser = {
      id: Date.now().toString(),
      username: username.trim(),
      password: password,
    };

    const updatedUsers = [...users, newUser];
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
    return { success: true, user: newUser };
  } catch (e) {
    console.error('Error al registrar usuario:', e);
    return { success: false, error: 'Error al guardar el usuario en el almacenamiento local.' };
  }
};

export const authenticateUser = async (username, password) => {
  try {
    const users = await getUsers();
    const user = users.find(
      u => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password
    );

    if (!user) {
      return { success: false, error: 'Usuario o contraseña incorrectos.' };
    }

    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return { success: true, user };
  } catch (e) {
    console.error('Error al autenticar usuario:', e);
    return { success: false, error: 'Error al intentar iniciar sesión.' };
  }
};

export const getActiveSession = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(CURRENT_USER_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Error al obtener sesión activa:', e);
    return null;
  }
};

export const logoutUser = async () => {
  try {
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
    return true;
  } catch (e) {
    console.error('Error al cerrar sesión:', e);
    return false;
  }
};

export const getHabits = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(HABITS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error al obtener hábitos:', e);
    return [];
  }
};

export const saveHabit = async (habitData) => {
  try {
    const habits = await getHabits();
    const newHabit = {
      id: Date.now().toString(),
      title: habitData.title.trim(),
      frequency: habitData.frequency || 'diario',
      completed: false,
      createdAt: new Date().toLocaleDateString('es-AR'),
      reminderMinutes: habitData.reminderMinutes || null,
    };

    const updated = [newHabit, ...habits];
    await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(updated));
    return { success: true, habit: newHabit };
  } catch (e) {
    console.error('Error al guardar hábito:', e);
    return { success: false, error: 'No se pudo guardar el hábito.' };
  }
};

export const toggleHabitStatus = async (id) => {
  try {
    const habits = await getHabits();
    const updated = habits.map(h => {
      if (h.id === id) {
        return { ...h, completed: !h.completed };
      }
      return h;
    });
    await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(updated));
    return { success: true, habits: updated };
  } catch (e) {
    console.error('Error al actualizar hábito:', e);
    return { success: false, error: 'No se pudo actualizar el estado.' };
  }
};

export const deleteHabit = async (id) => {
  try {
    const habits = await getHabits();
    const updated = habits.filter(h => h.id !== id);
    await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(updated));
    return { success: true, habits: updated };
  } catch (e) {
    console.error('Error al eliminar hábito:', e);
    return { success: false, error: 'No se pudo eliminar el hábito.' };
  }
};
