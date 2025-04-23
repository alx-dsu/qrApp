import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform, Text } from "react-native";

export default function RootLayout() {
  return (
    <>
      <Stack
        // screenOptions={{
        //   // Configuración global para todas las pantallas
        //   headerStyle: {
        //     backgroundColor: "#25292e", // Fondo oscuro del header
        //   },
        //   headerTitleStyle: {
        //     color: "#ffffff", // Color blanco para el título
        //     fontSize: 20,
        //     fontWeight: '600',
        //   },
        //   headerTintColor: "#44a4af", // Color de los botones (back, etc.)
        //   headerShadowVisible: false, // Elimina la sombra/borde
        //   contentStyle: {
        //     backgroundColor: "#1a1a1a", // Fondo para pantallas modales
        //   },
        //   // Configuración específica para Android
        //   ...Platform.select({
        //     android: {
        //       headerTitleAlign: 'center', // Centra el título en Android
        //     },
        //   }),
        //   headerTitle: ({ children }) => (
        //     <Text style={{ 
        //       color: '#ffffff',
        //       fontSize: 16,
        //       fontWeight: '600'
        //     }}>
        //       {children === '[id]' ? 'Cargando...' : children}
        //     </Text>
        //   ),
        // }}

        // ********
        // screenOptions={({ route }) => ({
        //   // Configuración global para todas las pantallas
        //   headerStyle: {
        //     backgroundColor: "#25292e", // Fondo oscuro del header
        //   },
        //   headerTitleStyle: {
        //     color: "#ffffff", // Color blanco para el título (esto es importante)
        //   },
        //   headerTintColor: "#44a4af", // Color de los botones (back, etc.)
        //   headerShadowVisible: false, // Elimina la sombra/borde
        //   contentStyle: {
        //     backgroundColor: "#1a1a1a", // Fondo para pantallas modales
        //   },
        //   // Configuración específica para Android
        //   ...Platform.select({
        //     android: {
        //       headerTitleAlign: 'center',
        //     },
        //   }),
        //   // Personalización condicional del título
        //   headerTitle: ({ children }) => {
        //     if (route.name === "[id]" && children === "[id]") {
        //       return (
        //         <Text style={{
        //           color: '#ffffff', // Blanco
        //           fontSize: 20,
        //           fontWeight: '600',
        //           maxWidth: 250,
        //         }}>
        //           Cargando usuario...
        //         </Text>
        //       );
        //     }
        //     // Devolver undefined para usar el comportamiento por defecto
        //     return undefined;
        //   },
        // })}
        // ******

        // screenOptions={{
        //   headerShown: true, // Asegura que el header esté visible por defecto
        //   headerStyle: { backgroundColor: "#25292e" },
        //   headerTitleStyle: { color: "#ffffff" },
        //   headerTintColor: "#44a4af",
        //   headerShadowVisible: false,
        // }}
        screenOptions={({ route }) => ({
          headerShown: true,
          headerStyle: { backgroundColor: "#25292e" },
          headerTitleStyle: { color: "#ffffff" },
          headerTintColor: "#44a4af",
          headerShadowVisible: false,
          headerTitle: ({ children }) => (
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: '600' }}>
              {children === '[id]' ? 'Cargando...' : children}
            </Text>
          )
        })}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{title: "Pagina no encontrada"}} />
        <Stack.Screen name="scan" options={{title: "Escanear QR"}}/>
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
