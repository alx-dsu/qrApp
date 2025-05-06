import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform, Text } from "react-native";

import ScanScreen from '@/app/scan';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/react-query';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       staleTime: 5 * 60 * 1000, // 5 minutos de cache
//       retry: 2, // Reintentar 2 veces en caso de error
//       refetchOnWindowFocus: false, // No recargar al cambiar de ventana
//     },
//   },
// });

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
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
          <Stack.Screen name="scan" options={{title: "Escanear QR"}} component={ScanScreen}/>
        </Stack>
        <StatusBar style="light" />
      </>
    </QueryClientProvider>
  );
}
