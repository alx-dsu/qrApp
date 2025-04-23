import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";

export default function RootLayout() {
  return (
    <>
      <Stack
        // screenOptions={{
        //   headerStyle: {
        //     backgroundColor: "#25292e",
        //   },
        //   headerTitleStyle: {
        //     color: "#ffffff",
        //   },
        //   headerTintColor: "#44a4af",
        //   contentStyle: {
        //     backgroundColor: "#1a1a1a",
        //   },
        // }}
        screenOptions={{
          // Configuración global para todas las pantallas
          headerStyle: {
            backgroundColor: "#25292e", // Fondo oscuro del header
          },
          headerTitleStyle: {
            color: "#ffffff", // Color blanco para el título
            fontSize: 20,
            fontWeight: '600',
          },
          headerTintColor: "#44a4af", // Color de los botones (back, etc.)
          headerShadowVisible: false, // Elimina la sombra/borde
          contentStyle: {
            backgroundColor: "#1a1a1a", // Fondo para pantallas modales
          },
          // Configuración específica para Android
          ...Platform.select({
            android: {
              headerTitleAlign: 'center', // Centra el título en Android
            },
          }),
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{title: "Pagina no encontrada"}} />
        {/* <Stack.Screen
          name="qr-scanner" // Asegúrate que coincida con tu ruta
          options={{
            title: "Escanear QR",
            presentation: 'modal', // Opcional si quieres que aparezca como modal
            headerBackTitleVisible: false, // Oculta el texto del botón back en iOS
          }}
        /> */}
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
