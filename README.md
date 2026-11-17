# Parcial 2 - Aplicaciones Móviles

- **Materia:** Aplicaciones Móviles
- **Institución:** ISTEA
- **Docente:** Martín Cornejo (martin.cornejo@istea.com.ar)
- **Modalidad:** Individual
- **Tecnología:** React Native (Expo)
- **Repositorio:** https://github.com/naldeco98/HabitTrackerMobile
- **Fecha de Entrega:** 17/11/2026

---

## 1. Opción Elegida y Alcance
**Seguimiento de hábitos o rutinas:** Aplicación móvil ampliada para la gestión integral de hábitos y rutinas personales. En esta segunda etapa se incorpora acceso a los recursos de hardware del dispositivo (cámara, galería, ubicación GPS, agenda de contactos y calendario), manejo de permisos con control de estados, migración de la arquitectura a un estado global con **Zustand** y suites de tests unitarios con **Jest**.

---

## 2. Nuevas Funcionalidades Implementadas (Parcial 2)

### A. Permisos y Acceso a Recursos del Dispositivo
- Verificación y solicitud previa de permisos en tiempo de ejecución antes de acceder a cada recurso nativo.
- Gestión de estados de permisos: concedido (*granted*), denegado (*denied*) y no determinado.
- Mensajes informativos y claros mediante alertas nativas si el usuario deniega o revoca un permiso.

### B. Cámara y Galería (`expo-image-picker`)
- Opción para tomar una fotografía en vivo con la cámara o seleccionar una imagen desde la galería del dispositivo.
- Asociación de la fotografía como evidencia del cumplimiento del hábito.
- Visualización de la miniatura de la imagen en la tarjeta del hábito dentro del listado principal y opción de actualizarla.

### C. Ubicación GPS (`expo-location`)
- Obtención de coordenadas geográficas en tiempo real (latitud y longitud).
- Geocodificación inversa (*reverse geocoding*) para convertir las coordenadas en una dirección legible (calle, número y ciudad).
- Asociación de la ubicación al hábito (lugar de entrenamiento o práctica) y visualización en la tarjeta.

### D. Agenda de Contactos (`expo-contacts`)
- Acceso a la agenda telefónica del dispositivo para seleccionar un contacto.
- Vinculación del contacto al hábito en calidad de compañero o entrenador, guardando nombre y teléfono de referencia.

### E. Integración con Calendario (`expo-calendar`)
- Creación automática de un evento o recordatorio en el calendario predeterminado del dispositivo móvil vinculado al hábito creado, con fecha, hora y ubicación registrada.

### F. Estado Global con Zustand
- Migración completa de la gestión del estado a **Zustand**, reemplazando el paso de props y estados locales dispersos.
- Stores implementados con persistencia en `AsyncStorage`:
  - `useHabitStore`: Control centralizado de la lista de hábitos, alta, alternancia de estado completado (*toggle*), eliminación y adjuntado de evidencia fotográfica.
  - `useAuthStore`: Gestión global de la sesión del usuario, registro, validación y cierre de sesión.
- Suscripción y renderizado optimizado mediante hooks y selectores.

### G. Notificaciones Locales (`expo-notifications`)
- Mantenimiento y compatibilidad con las notificaciones locales del Parcial 1 para alertas programadas a los 5 segundos de registrar un hábito.

---

## 3. Cómo ejecutar la aplicación

### Prerrequisitos
- Node.js instalado (v18 o superior).
- Aplicación Expo Go en el teléfono o emulador de Android/iOS configurado.

### Pasos de instalación y ejecución

1. **Instalar dependencias necesarias:**
   ```bash
   npm install
   ```

2. **Iniciar el servidor de desarrollo Expo:**
   ```bash
   npx expo start -c
   ```
   - Escanear el código QR con la app **Expo Go** en Android o iOS.
   - O presionar `a` para abrir en emulador Android.
   - O presionar `w` para abrir en navegador web.

3. **Ejecutar los tests automatizados:**
   ```bash
   npm test
   ```

---

## 4. Testing Automatizado con Jest

Se implementaron y actualizaron las suites de tests con **Jest** y **React Native Testing Library**, con mocks correspondientes para los módulos de hardware:

1. `src/__tests__/HabitCard.test.js`: Verifica el renderizado de la tarjeta reutilizable con título, frecuencia, lugar geográfico, contacto asignado, etiqueta de calendario y la correcta respuesta a los eventos de alternancia (*toggle*) y borrado.
2. `src/__tests__/useHabitStore.test.js`: Verifica las mutaciones y acciones del store global de Zustand (agregar hábito, alternar estado y eliminar hábito).
3. `src/__tests__/validators.test.js`: Pruebas de funciones puras de lógica de negocio (validación de formularios de login, registro, alta de hábitos, cálculo porcentual de progreso y filtrado por frecuencia).
4. `src/__tests__/CustomButton.test.js`: Pruebas del componente de botón reutilizable, interacción de click y estado deshabilitado.

---

## 5. Punto Extra: IA Aplicada al Desarrollo

### Herramientas utilizadas
- **Antigravity (Google DeepMind) / Asistente LLM**: Utilizado para la refactorización arquitectónica del estado local hacia Zustand, la integración de los SDKs de Expo para hardware y la generación de mocks para Jest.

### Prompts aplicados
- *Prompt 1 (Migración de estado):* "Refactorizar la persistencia de hábitos de React Context a un store global de Zustand utilizando el middleware persist con AsyncStorage, exportando acciones para agregar, eliminar y alternar el estado completado."
- *Prompt 2 (Acceso a hardware y permisos):* "Implementar un servicio en React Native Expo para solicitar permisos y capturar cámara/galería (expo-image-picker), ubicación con geocodificación inversa (expo-location), selector de contactos (expo-contacts) y creación de evento en el calendario (expo-calendar), controlando los estados de permiso y mostrando alertas claras ante rechazo."

### Comparación entre código generado y solución final integrada
- **Código generado inicialmente:** Los snippets generados por LLMs solían incluir dependencias con versiones incompatibles con Expo 51, o asumían que el calendario del sistema siempre tiene una cuenta primaria por defecto, lo cual falla en emuladores que no tienen cuenta de Google configurada.
- **Ajustes y solución final:** Se adaptó el servicio de calendario para recorrer los calendarios modificables disponibles (`allowsModifications`) como fallback seguro. Asimismo, se simplificó la interfaz gráfica eliminando elementos decorativos excesivos para mantener un estilo visual plano, nativo y sobrio.

---

## 6. Video DEMO (YouTube)

Enlace al video de demostración (máximo 1 minuto) mostrando las nuevas funcionalidades:  
`[PEGAR AQUÍ EL ENLACE DE YOUTUBE]`
