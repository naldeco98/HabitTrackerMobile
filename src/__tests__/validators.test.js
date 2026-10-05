import {
  validateLoginForm,
  validateRegisterForm,
  validateHabitForm,
  calculateHabitProgress,
  filterHabitsByFrequency,
} from '../utils/validators';

describe('Tests de Lógica de Negocio y Validadores', () => {
  describe('validateLoginForm', () => {
    test('debe fallar si el usuario está vacío', () => {
      const result = validateLoginForm('', '123456');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('El nombre de usuario es requerido.');
    });

    test('debe fallar si la contraseña está vacía', () => {
      const result = validateLoginForm('nicolas', '');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('La contraseña es requerida.');
    });

    test('debe ser válido con usuario y contraseña completos', () => {
      const result = validateLoginForm('nicolas', '123456');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });
  });

  describe('validateRegisterForm', () => {
    test('debe exigir al menos 3 caracteres en el usuario', () => {
      const result = validateRegisterForm('ab', '123456', '123456');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('al menos 3 caracteres');
    });

    test('debe exigir al menos 4 caracteres en la contraseña', () => {
      const result = validateRegisterForm('nicolas', '12', '12');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('al menos 4 caracteres');
    });

    test('debe fallar si las contraseñas no coinciden', () => {
      const result = validateRegisterForm('nicolas', '123456', '654321');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Las contraseñas no coinciden.');
    });

    test('debe ser válido con datos correctos y contraseñas coincidentes', () => {
      const result = validateRegisterForm('nicolas', '123456', '123456');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });
  });

  describe('validateHabitForm', () => {
    test('debe fallar si el título está vacío', () => {
      const result = validateHabitForm('', 'diario');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('El nombre del hábito no puede estar vacío.');
    });

    test('debe fallar si la frecuencia no es diario ni semanal', () => {
      const result = validateHabitForm('Entrenar', 'mensual');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('La frecuencia debe ser diaria o semanal.');
    });

    test('debe ser válido con título y frecuencia correctos', () => {
      const result = validateHabitForm('Leer 20 páginas', 'diario');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });
  });

  describe('calculateHabitProgress', () => {
    test('debe devolver 0% si la lista de hábitos está vacía', () => {
      const progress = calculateHabitProgress([]);
      expect(progress).toEqual({ total: 0, completed: 0, percentage: 0 });
    });

    test('debe calcular correctamente el porcentaje de completitud (50%)', () => {
      const mockHabits = [
        { id: '1', title: 'Hábito 1', completed: true },
        { id: '2', title: 'Hábito 2', completed: false },
      ];
      const progress = calculateHabitProgress(mockHabits);
      expect(progress.total).toBe(2);
      expect(progress.completed).toBe(1);
      expect(progress.percentage).toBe(50);
    });

    test('debe calcular 100% cuando todos están completados', () => {
      const mockHabits = [
        { id: '1', title: 'Hábito 1', completed: true },
        { id: '2', title: 'Hábito 2', completed: true },
      ];
      const progress = calculateHabitProgress(mockHabits);
      expect(progress.percentage).toBe(100);
    });
  });

  describe('filterHabitsByFrequency', () => {
    const mockHabits = [
      { id: '1', title: 'Diario 1', frequency: 'diario' },
      { id: '2', title: 'Semanal 1', frequency: 'semanal' },
      { id: '3', title: 'Diario 2', frequency: 'diario' },
    ];

    test('debe devolver todos si el filtro es "todos"', () => {
      const res = filterHabitsByFrequency(mockHabits, 'todos');
      expect(res.length).toBe(3);
    });

    test('debe filtrar correctamente por frecuencia diaria', () => {
      const res = filterHabitsByFrequency(mockHabits, 'diario');
      expect(res.length).toBe(2);
      expect(res.every(h => h.frequency === 'diario')).toBe(true);
    });

    test('debe filtrar correctamente por frecuencia semanal', () => {
      const res = filterHabitsByFrequency(mockHabits, 'semanal');
      expect(res.length).toBe(1);
      expect(res[0].frequency).toBe('semanal');
    });
  });
});
