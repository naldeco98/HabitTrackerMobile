export const validateLoginForm = (username, password) => {
  if (!username || username.trim() === '') {
    return { isValid: false, error: 'El nombre de usuario es requerido.' };
  }
  if (!password || password.trim() === '') {
    return { isValid: false, error: 'La contraseña es requerida.' };
  }
  return { isValid: true, error: null };
};

export const validateRegisterForm = (username, password, confirmPassword) => {
  if (!username || username.trim().length < 3) {
    return { isValid: false, error: 'El usuario debe tener al menos 3 caracteres.' };
  }
  if (!password || password.length < 4) {
    return { isValid: false, error: 'La contraseña debe tener al menos 4 caracteres.' };
  }
  if (confirmPassword !== undefined && password !== confirmPassword) {
    return { isValid: false, error: 'Las contraseñas no coinciden.' };
  }
  return { isValid: true, error: null };
};

export const validateHabitForm = (title, frequency) => {
  if (!title || title.trim() === '') {
    return { isValid: false, error: 'El nombre del hábito no puede estar vacío.' };
  }
  if (title.trim().length < 3) {
    return { isValid: false, error: 'El nombre del hábito debe tener al menos 3 caracteres.' };
  }
  const validFrequencies = ['diario', 'semanal'];
  if (!validFrequencies.includes(frequency)) {
    return { isValid: false, error: 'La frecuencia debe ser diaria o semanal.' };
  }
  return { isValid: true, error: null };
};

export const calculateHabitProgress = (habits = []) => {
  if (!Array.isArray(habits) || habits.length === 0) {
    return { total: 0, completed: 0, percentage: 0 };
  }
  const total = habits.length;
  const completed = habits.filter(habit => habit.completed === true).length;
  const percentage = Math.round((completed / total) * 100);
  return { total, completed, percentage };
};

export const filterHabitsByFrequency = (habits = [], filter = 'todos') => {
  if (!Array.isArray(habits)) return [];
  if (filter === 'todos') return habits;
  return habits.filter(habit => habit.frequency === filter);
};
