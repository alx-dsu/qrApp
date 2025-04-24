import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform, Text } from "react-native";

export default function RootLayout() {
  return (
    <>
      <Stack
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
