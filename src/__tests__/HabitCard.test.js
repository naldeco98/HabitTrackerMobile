import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HabitCard from '../components/HabitCard';

describe('Test de Componente Reutilizable: HabitCard', () => {
  const mockHabit = {
    id: 'h1',
    title: 'Hacer ejercicio',
    frequency: 'diario',
    completed: false,
    createdAt: '30/09/2026',
  };

  test('debe renderizar el título del hábito y su frecuencia', () => {
    const { getByText } = render(
      <HabitCard habit={mockHabit} onToggle={jest.fn()} onDelete={jest.fn()} />
    );

    expect(getByText('Hacer ejercicio')).toBeTruthy();
    expect(getByText('Diario')).toBeTruthy();
  });

  test('debe llamar a onToggle cuando se presiona el checkbox', () => {
    const mockOnToggle = jest.fn();
    const { getByTestId } = render(
      <HabitCard habit={mockHabit} onToggle={mockOnToggle} onDelete={jest.fn()} />
    );

    const toggleButton = getByTestId('toggle-habit-h1');
    fireEvent.press(toggleButton);

    expect(mockOnToggle).toHaveBeenCalledTimes(1);
    expect(mockOnToggle).toHaveBeenCalledWith('h1');
  });

  test('debe llamar a onDelete cuando se presiona el botón de eliminar', () => {
    const mockOnDelete = jest.fn();
    const { getByTestId } = render(
      <HabitCard habit={mockHabit} onToggle={jest.fn()} onDelete={mockOnDelete} />
    );

    const deleteButton = getByTestId('delete-habit-h1');
    fireEvent.press(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith('h1');
  });
});
