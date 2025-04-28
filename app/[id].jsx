// import {
//   FlatList,
//   ActivityIndicator,
//   Text,
//   View,
//   Image,
//   Alert,
//   Platform,
//   UIManager,
//   LayoutAnimation,
//   TouchableOpacity,
// } from "react-native";
// import { Stack, useLocalSearchParams, useRouter } from "expo-router";
// import { useEffect, useState, Button, useCallback  } from "react";
// import { getUserDetails, reasignarInventario, deleteInventario  } from "@/lib/users";

// import { InvCard, AnimateInvCard } from "@/components/InvCard";
// import "../global.css";
// import Screen from "../components/Screen";
// import Ionicons from "@expo/vector-icons/Ionicons";
// import EventBus from "@/utils/EventBus"; 

// if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
//   UIManager.setLayoutAnimationEnabledExperimental(true);
// }

// export default function Detail() {
//   const { id  } = useLocalSearchParams();
//   const [userInfo, setUserInfo] = useState(null);
//   const [inventarios, setInventarios] = useState([]);

//   const [isLoading, setIsLoading] = useState(true);

//   const router = useRouter();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setIsLoading(true);
//         const data = await getUserDetails(id);
//         setUserInfo(data);
//         setInventarios(data.inventarios || []);
//       } catch (error) {
//         console.error(error);
//         Alert.alert("Error", "No se pudo cargar la información");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (id) fetchData();
//   }, [id]);

//   // ✅ Escuchar cuando se escanee un inventario
//   useEffect(() => {
//     const listener = async (nuevoInventario) => {
//       try {
//         const match = nuevoInventario.match(/(\d+)$/);
//         const consecutivo = match ? match[0] : null;
        
//         console.log(`Procesando:`, { 
//           codigoQR: nuevoInventario, 
//           consecutivo 
//         });
  
//         // Verificación local primero
//         const existeLocal = inventarios.some(inv => 
//           inv.inventario?.endsWith(consecutivo)
//         );
        
//         if (existeLocal) {
//           const itemExistente = inventarios.find(inv => 
//             inv.inventario?.endsWith(consecutivo)
//           );
//           Alert.alert(
//             "Inventario ya asignado",
//             `${itemExistente.descripcion}\n(${nuevoInventario})\nya está asignado al usuario.`,
//             [{ text: "OK" }]
//           );
//           return;
//         }
  
//         const response = await fetch(`http://172.16.1.154:8000/api/sci/inventario/reasignar`, {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             "Accept": "application/json"
//           },
//           body: JSON.stringify({
//             inventario: nuevoInventario.trim(),
//             id_usuario: id
//           }),
//         });
  
//         const data = await response.json();
  
//         if (!response.ok || data.error) {
//           throw new Error(data.message || "Error al asignar inventario");
//         }
  
//         if (!data.inventario?.Id) {
//           throw new Error("Respuesta inválida del servidor");
//         }
  
//         // Actualización con animación
//         LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
//         setInventarios(prev => [data.inventario, ...prev]);
        
//         Alert.alert(
//           "Asignado correctamente",
//           `Descripción: ${data.inventario.descripcion || 'Sin descripción'}\nInventario: ${nuevoInventario || 'N/A'}\nse ha asignado correctamente.`,
//           // `${data.inventario.descripcion} (${nuevoInventario})`,
//           [{ text: "OK" }]
//         );
  
//       } catch (error) {
//         // console.error("Error en escaneo:", {
//         //   error: error.message,
//         //   timestamp: new Date().toISOString()
//         // });
        
//         Alert.alert(
//           "Error", 
//           error.message.includes("no encontrado") 
//             ? `El inventario no existe en el sistema`
//             : error.message || "Error al procesar el QR"
//         );
//       }
//     };
  
//     EventBus.on("qrScanned", listener);
//     return () => EventBus.off("qrScanned", listener);
//   }, [id, inventarios]);

//   const handleDeleteInventario = useCallback(async (id) => {
//     try {
//       const response = await fetch(`http://172.16.1.154:8000/api/sci/inventario/${id}`, {
//       // const response = await fetch(`http://192.168.68.105:8000/api/sci/inventario/${id}`, {
//         method: "DELETE",
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//         },
//       });

//       const data = await response.json();
//       if (response.ok) {
//         LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
//         setInventarios((prev) => prev.filter((inv) => inv.Id !== id));
//       } else {
//         Alert.alert("Error", data.message || "No se pudo eliminar.");
//       }
//     } catch (error) {
//       console.error("Error al eliminar:", error);
//       Alert.alert("Error", "No se pudo eliminar el inventario.");
//     }
//   }, []);

//   if (isLoading || !userInfo) {
//     return (
//       <View className="flex-1 bg-black justify-center items-center">
//         <ActivityIndicator color="#44a4af" size="large" />
//         <Text className="text-white text-base mt-4">Cargando información...</Text>
//       </View>
//     );
//   }

//   return (
//     <Screen>
//       <Stack.Screen
//         options={{
//           headerTitle: `${userInfo?.user?.nombre || "Desconocido"}`, 
//         }}
//       />

//       <View className="flex-1 bg-black">
//         <FlatList
//           data={inventarios}
//           className="px-5"
//           keyExtractor={(inv) => inv.Id.toString()}
//           renderItem={({ item, index }) => (
//             <AnimateInvCard item={item} index={index} onDelete={handleDeleteInventario} />
//           )}
//           ListEmptyComponent={
//             <View className="flex-1 justify-center items-center mt-20">
//               <Text className="text-white text-lg font-bold">
//                 No hay inventarios asignados
//               </Text>
//             </View>
//           }
//         />
//       </View>

//       <TouchableOpacity
//         onPress={() => router.push({ pathname: "/scan", params: { userId: id } })}
//         className="absolute bottom-8 right-4 bg-teal-500 w-16 h-16 rounded-full justify-center items-center shadow-lg shadow-black"
//       >
//         <Ionicons name="add" size={28} color="#25292e" />
//       </TouchableOpacity>

//     </Screen>
//   );
// }

import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { 
  ActivityIndicator, 
  Alert, 
  FlatList, 
  Text, 
  View, 
  TextInput,
  LayoutAnimation,
  Platform,
  UIManager,
  Button
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserDetails, reasignarInventario, deleteInventario } from '@/lib/users';
import { InvCard, AnimateInvCard } from '@/components/InvCard';
import EventBus from '@/utils/EventBus';
import Screen from '@/components/Screen';
import FloatingActionButton from '@/components/FloatingActionButton';
import MutationStatus from '@/components/MutationStatus';

// Habilitar animaciones para Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function UserDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  // Consulta para obtener detalles del usuario
  const { 
    data: userData, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['user', id],
    queryFn: () => getUserDetails(id),
    staleTime: 5 * 60 * 1000, // 5 minutos de cache
  });

  // Mutación para reasignar inventario
  const reasignarMutation = useMutation({
    mutationFn: reasignarInventario,
    onMutate: async ({ qr, userId }) => {
      // Cancelar queries actuales
      await queryClient.cancelQueries(['user', userId]);
      
      // Snapshot del valor anterior
      const previousData = queryClient.getQueryData(['user', userId]);
      
      // Optimistic update
      queryClient.setQueryData(['user', userId], (old) => ({
        ...old,
        inventarios: old.inventarios || []
      }));
      
      return { previousData };
    },
    onError: (error, variables, context) => {
      // Revertir al estado anterior en caso de error
      queryClient.setQueryData(['user', id], context.previousData);
      Alert.alert('Error', error.message);
    },
    onSuccess: (newItem) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      queryClient.setQueryData(['user', id], (old) => ({
        ...old,
        inventarios: [newItem, ...(old.inventarios || [])],
      }));
    },
    onSettled: () => {
      // Forzar recarga para asegurar sincronización
      queryClient.invalidateQueries(['user', id]);
    }
  });

  // Mutación para eliminar inventario
  // const deleteMutation = useMutation({
    // mutationFn: deleteInventario,
    // onMutate: async (inventarioId) => {
    //   await queryClient.cancelQueries(['user', id]);
    //   const previousData = queryClient.getQueryData(['user', id]);
      
    //   queryClient.setQueryData(['user', id], (old) => ({
    //     ...old,
    //     inventarios: old.inventarios.filter(inv => inv.Id !== inventarioId),
    //   }));
      
    //   return { previousData };
    // },
    // onError: (error, variables, context) => {
    //   queryClient.setQueryData(['user', id], context.previousData);
    //   Alert.alert('Error', 'No se pudo eliminar el inventario');
    // },
  // });
  const deleteMutation = useMutation({
    mutationFn: deleteInventario,
    onSuccess: (deletedId) => {
      queryClient.setQueryData(['user', id], (old) => ({
        ...old,
        inventarios: old.inventarios.filter(inv => inv.Id !== deletedId),
      }));
    },
    onError: (error) => {
      Alert.alert('Error', 'No se pudo eliminar el inventario');
      // Aquí podrías agregar lógica para revertir visualmente si es necesario
    }
  });

  // Función de eliminación simplificada
  const handleDelete = useCallback((inventarioId) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de eliminar este inventario?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', onPress: () => deleteMutation.mutate(inventarioId) }
      ]
    );
  }, []);

  // Manejo del escaneo QR
  useEffect(() => {
    const handleQRScanned = (qrData) => {
      if (!qrData) return;
      
      // Verificar si ya existe localmente
      const match = qrData.match(/(\d+)$/);
      const consecutivo = match ? match[0] : null;
      
      if (userData?.inventarios?.some(inv => 
        inv.inventario?.endsWith(consecutivo)
      )) {
        Alert.alert(
          'Inventario ya asignado',
          'Este artículo ya está asignado al usuario'
        );
        return;
      }

      reasignarMutation.mutate({ 
        qr: qrData, 
        userId: id 
      });
    };

    EventBus.on('qrScanned', handleQRScanned);
    return () => EventBus.off('qrScanned', handleQRScanned);
  }, [id, userData]);

  // Filtrar inventarios basado en búsqueda
  const filteredInventarios = useMemo(() => {
    if (!userData?.inventarios) return [];
    return userData.inventarios.filter(inv => 
      inv.descripcion?.toLowerCase().includes(search.toLowerCase()) ||
      inv.inventario?.toLowerCase().includes(search.toLowerCase())
    );
  }, [userData, search]);

  // Renderizar item de la lista (memoizado)
  // const renderItem = useCallback(({ item, index }) => (
    // <AnimateInvCard 
    //   item={item} 
    //   index={index}
    //   onDelete={() => {
    //     Alert.alert(
    //       'Confirmar eliminación',
    //       '¿Estás seguro de eliminar este inventario?',
    //       [
    //         { text: 'Cancelar', style: 'cancel' },
    //         { text: 'Eliminar', onPress: () => deleteMutation.mutate(item.Id) }
    //       ]
    //     );
    //   }}
    // />
  // ), []);
  const renderItem = useCallback(({ item, index }) => (
    <AnimateInvCard 
      item={item} 
      index={index}
      onDelete={deleteMutation.mutate}
    />
  ), []);

  // Estados de carga y error
  if (isLoading) {
    return (
      <Screen>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#44a4af" />
          <Text className="text-white mt-4">Cargando información...</Text>
        </View>
      </Screen>
    );
  }

  if (error || !userData) {
    return (
      <Screen>
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-red-500 text-lg mb-2">Error:</Text>
          <Text className="text-white text-center mb-4">{error?.message || 'Usuario no encontrado'}</Text>
          <Button 
            title="Reintentar" 
            onPress={() => refetch()} 
            color="#44a4af"
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <Stack.Screen 
        options={{ 
          title: userData.user?.nombre || 'Detalles',
          headerBackTitle: 'Atrás'
        }} 
      />

      {/* Barra de búsqueda */}
      {/* <View className="px-4 py-2 bg-gray-900">
        <TextInput
          placeholder="Buscar inventario..."
          placeholderTextColor="#9CA3AF"
          value={search}
          onChangeText={setSearch}
          className="border border-gray-700 rounded-lg p-3 text-white bg-gray-800"
          selectionColor="#44a4af"
        />
      </View> */}

      {/* Componentes de estado de mutaciones */}
      <MutationStatus 
        mutation={reasignarMutation} 
        // successMessage="Inventario asignado correctamente"
        successMessage={`Inventario asignado correctamente`}
      />
      
      <MutationStatus
        mutation={deleteMutation}
        successMessage="Inventario eliminado correctamente"
      />

      {/* Lista de inventarios */}
      <FlatList
        data={filteredInventarios}
        keyExtractor={(item) => item.Id.toString()}
        renderItem={renderItem}
        refreshing={isLoading}
        onRefresh={refetch}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center mt-20">
            <Text className="text-white text-lg">
              {search ? 'No se encontraron resultados' : 'No hay inventarios asignados'}
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 90 }}
        initialNumToRender={10}
        maxToRenderPerBatch={5}
        windowSize={10}
      />

      {/* Botón de acción flotante */}
      <FloatingActionButton 
        onPress={() => router.push(`/scan?userId=${id}`)}
        icon="qr-code-scanner"
      />
    </Screen>
  );
}