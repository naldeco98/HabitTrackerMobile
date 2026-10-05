# Parcial 1 - Aplicaciones Móviles - Nicolas Aldeco

- **Materia:** Aplicaciones Móviles
- **Institución:** ISTEA
- **Docente:** Martín Cornejo
- **Modalidad:** Individual
- **Tecnología:** React Native (Expo)

---

## 1. Opción Elegida
**Seguimiento de hábitos o rutinas:** Aplicación móvil para registrar hábitos diarios y semanales, marcarlos como realizados, eliminarlos y recibir recordatorios mediante notificaciones locales.

---

## 2. Cómo ejecutar la aplicación

### Prerrequisitos
- Node.js instalado (v18 o superior).
- Aplicación Expo Go en celular o emulador configurado.

### Instalación y ejecución

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Iniciar el servidor de desarrollo:**
   ```bash
   npx expo start
   ```
   - Escanear el código QR desde la app **Expo Go** en Android/iOS.
   - O presionar `w` para abrir en el navegador web.

3. **Ejecutar tests automatizados con Jest:**
   ```bash
   npm test
   ```

---

## 3. Funcionalidades implementadas

### Componentes y Styling
- Uso de componentes nativos de React Native: `View`, `Text`, `TextInput`, `Button` y `TouchableOpacity`.
- Estilos modulares definidos mediante `StyleSheet`.
- Componentes reutilizables:
  - `HabitCard`: Tarjeta para cada hábito con checkbox de completado, etiqueta de frecuencia (diario/semanal) y botón de eliminar.
  - `CustomButton`: Botón modular reutilizable con variantes para acciones primarias, secundarias y de cancelación.
- Diseño limpio, legible y sin sobrecarga visual.

### Navegación
- Implementación de React Navigation con Stack Navigator (`@react-navigation/native-stack`).
- 4 pantallas obligatorias:
  1. `LoginScreen`: Ingreso con usuario y contraseña.
  2. `RegisterScreen`: Alta de nuevo usuario.
  3. `HomeScreen`: Listado de hábitos, barra de progreso porcentual, filtros por frecuencia y cierre de sesión.
  4. `CreateHabitScreen`: Formulario para registrar un nuevo hábito y programar recordatorio local.

### Autenticación local
- Autenticación manejada con `AsyncStorage` y React Context (`AuthContext`).
- Validación de datos ingresados contra usuarios registrados localmente.
- Protección de rutas: no se permite acceder a la aplicación sin haber iniciado sesión.

### Almacenamiento y persistencia (AsyncStorage)
- Persistencia de usuarios registrados y sesión activa.
- Persistencia de la lista de hábitos:
  - Creación de nuevo hábito con título y frecuencia.
  - Marcado de hábito completado / pendiente.
  - Eliminación de hábito.
  - Los datos se conservan al cerrar y reabrir la app.

### Notificaciones locales
- Configurado con `expo-notifications`.
- Solicita permisos de notificación en el dispositivo.
- Programación de alerta local en 5 segundos al crear un hábito o mediante el botón de prueba directa.

### Testing con Jest
- Configurado Jest junto a React Native Testing Library.
- 3 suites de tests implementadas:
  1. `HabitCard.test.js`: Renderizado y respuesta a eventos del componente reutilizable.
  2. `validators.test.js`: Lógica de validación de formularios y cálculo porcentual de progreso.
  3. `CustomButton.test.js`: Renderizado y comportamiento de pulsación del botón reutilizable.
- Ejecución con un único comando: `npm test`.

---

## 4. Video DEMO (YouTube)

[Enlace al video de demostración](https://youtube.com/shorts/-dItrxmMr1Y?feature=share)

