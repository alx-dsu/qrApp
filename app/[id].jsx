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

  const reasignarMutation = useMutation({
    mutationFn: reasignarInventario,
    onSuccess: (response) => {
      if (response.status === 'success') {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        
        // Actualización optimista + invalidación de caché
        queryClient.setQueryData(['user', id], (old) => {
          if (!old) return old;
          
          // Para reactivación, actualiza el item existente
          if (response.action === 'reactivated') {
            return {
              ...old,
              inventarios: old.inventarios.map(inv => 
                inv.Id === response.inventario.Id ? { 
                  ...response.inventario, 
                  deleted_at: null 
                } : inv
              )
            };
          }
          
          // Para reasignación, agrega el nuevo item
          return {
            ...old,
            inventarios: [response.inventario, ...old.inventarios]
          };
        });
  
        // Forzar recarga de datos del usuario
        queryClient.invalidateQueries(['user', id]);
        
        Alert.alert('Éxito', response.message);
      }
    },
    onError: (error) => {
      if (!error.message.includes('ya está asignado')) {
        Alert.alert('Error', error.message);
      }
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteInventario,
    onMutate: (inventarioId) => {
      // No hacemos cambios optimistas aquí, la animación ya los maneja
    },
    onSuccess: () => {
      // Invalidar la caché para obtener datos frescos
      queryClient.invalidateQueries(['user', id]);
    },
    onError: (error) => {
      Alert.alert('Error', 'No se pudo eliminar el inventario');
      // Opcional: Podrías agregar una animación para "revertir"
    }
  });

  // Función de eliminación simplificada
  const handleDelete = (inventarioId) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de eliminar este inventario?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          onPress: () => deleteMutation.mutate(inventarioId) 
        }
      ]
    );
  };

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
  const renderItem = useCallback(({ item, index }) => (
    <AnimateInvCard 
      item={item}
      index={index}
      onDelete={deleteMutation.mutate} // Pasar directamente la mutación
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
        keyExtractor={(item) => `inv-${item.Id}-${item.consecutivo}`}
        renderItem={renderItem}
        extraData={reasignarMutation.isSuccess} // Forzar actualización cuando hay cambios
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center mt-20">
            <Text className="text-white text-lg">
              {search ? 'No se encontraron resultados' : 'No hay inventarios asignados'}
            </Text>
          </View>
        }
      />

      {/* Botón de acción flotante */}
      <FloatingActionButton 
        onPress={() => router.push(`/scan?userId=${id}`)}
        icon="qr-code-scanner"
      />
    </Screen>
  );
}