import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CustomButton from '../components/CustomButton';

describe('Test de Componente Reutilizable: CustomButton', () => {
  test('debe renderizar el título proporcionado', () => {
    const { getByText } = render(
      <CustomButton title="Guardar Hábito" onPress={jest.fn()} />
    );

    expect(getByText('Guardar Hábito')).toBeTruthy();
  });

  test('debe ejecutar la función onPress al ser presionado', () => {
    const handlePress = jest.fn();
    const { getByText } = render(
      <CustomButton title="Iniciar Sesión" onPress={handlePress} />
    );

    fireEvent.press(getByText('Iniciar Sesión'));
    expect(handlePress).toHaveBeenCalledTimes(1);
  });

  test('no debe ejecutar onPress si el botón está deshabilitado', () => {
    const handlePress = jest.fn();
    const { getByTestId } = render(
      <CustomButton
        title="Procesando..."
        onPress={handlePress}
        disabled={true}
        testID="btn-disabled"
      />
    );

    fireEvent.press(getByTestId('btn-disabled'));
    expect(handlePress).not.toHaveBeenCalled();
  });
});
