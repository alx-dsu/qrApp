import {
  FlatList,
  ActivityIndicator,
  Text,
  View,
  Image,
  Alert,
  Platform,
  UIManager,
  LayoutAnimation,
  TouchableOpacity,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState, Button, useCallback  } from "react";
import { getUserDetails } from "../lib/users";

import { InvCard, AnimateInvCard } from "../components/InvCard";
import "../global.css";
import Screen from "../components/Screen";
import Ionicons from "@expo/vector-icons/Ionicons";
import EventBus from "../utils/EventBus"; 

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function Detail() {
  const { id  } = useLocalSearchParams();
  const [userInfo, setUserInfo] = useState(null);
  const [inventarios, setInventarios] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getUserDetails(id);
        setUserInfo(data);
        setInventarios(data.inventarios || []);
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "No se pudo cargar la información");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  // ✅ Escuchar cuando se escanee un inventario
  // useEffect(() => {
  //   const listener = (nuevoInventario) => {
  //     const consecutivo = nuevoInventario.slice(-6);
  //     const inventarioId = parseInt(consecutivo, 10);

  //     const yaExiste = inventarios.some(inv => inv.inventario === nuevoInventario);
  //     if (yaExiste) {
  //       Alert.alert(
  //         "Inventario ya asignado",
  //         `Este inventario ${nuevoInventario} ya está asignado al usuario.`,
  //         [{ text: "OK" }]
  //       );
  //       return;
  //     }

  //     // fetch(`http://172.16.1.154:8000/api/sci/inventario/reasignar`, {
  //     fetch(`http://192.168.68.105:8000/api/sci/inventario/reasignar`, {
  //       method: "PUT",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         inventario: nuevoInventario,
  //         id_usuario: id,
  //       }),
  //     })
  //       .then(res => res.json())
  //       .then(data => {
  //         if (data.error) {
  //           Alert.alert("Error", data.message || "Ocurrió un error al asignar el inventario.");
  //           return;
  //         }

  //         const inv = data.inventario;
  //         if (inv && inv.Id) {
  //           const yaExiste = inventarios.some((i) => i.Id === inv.Id);
  //           if (!yaExiste) {
  //             LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  //             setInventarios((prev) => [inv, ...prev]);
  //             Alert.alert(
  //               "Inventario asignado",
  //               `Descripción: ${inv.descripcion || 'Sin descripción'}\nInventario: ${inv?.inventario || 'N/A'}\nse ha asignado correctamente.`,
  //               [{ text: "OK" }]
  //             );
  //           } else {
  //             Alert.alert(
  //               "Inventario ya asignado",
  //               `Este inventario ${inv.inventario} ya está asignado al usuario.`,
  //               [{ text: "OK" }]
  //             );
  //             return;
  //           }
  //         } else {
  //           Alert.alert("Error", data.message || "No se pudo agregar.");
  //         }
  //       })
  //       .catch(err => {
  //         console.error(err);
  //         Alert.alert("Error", "Hubo un problema al agregar el inventario.");
  //       });
  //   };

  //   EventBus.on("qrScanned", listener);
  //   return () => EventBus.off("qrScanned", listener);
  // }, [id, inventarios]);
  useEffect(() => {
    const extraerConsecutivo = (codigoQR) => {
      // Eliminar espacios y normalizar
      const codigoLimpio = codigoQR.replace(/\s+/g, '');
      
      // Dividir por guiones o espacios y tomar el último segmento
      const partes = codigoLimpio.split(/[-_ ]+/);
      const consecutivo = partes[partes.length - 1];
      
      // Asegurar que tenga 6 dígitos (rellenar con ceros a la izquierda)
      return consecutivo.padStart(6, '0');
    };
  
    const listener = async (codigoQR) => {
      try {
        const consecutivo = extraerConsecutivo(codigoQR);
        console.log('Código escaneado:', codigoQR, 'Consecutivo extraído:', consecutivo);
  
        // Verificar si ya existe (comparando solo por consecutivo)
        const yaExiste = inventarios.some(inv => 
          inv.consecutivo === consecutivo
        );
  
        if (yaExiste) {
          const inventarioExistente = inventarios.find(inv => inv.consecutivo === consecutivo);
          Alert.alert(
            "Inventario ya asignado",
            `${inventarioExistente.descripcion} (${consecutivo}) ya está asignado.`,
            [{ text: "OK" }]
          );
          return;
        }
  
        // Enviar solo el consecutivo a la API
        const response = await fetch(`http://192.168.68.105:8000/api/sci/inventario/reasignar`, {
          method: "PUT",
          headers: { 
            Accept: "application/json",
            "Content-Type": "application/json" 
          },
          body: JSON.stringify({
            consecutivo: consecutivo,
            id_usuario: id,
          }),
        });
  
        const data = await response.json();
  
        if (!response.ok || data.error) {
          throw new Error(data.message || "Error al reasignar el inventario");
        }
  
        if (!data.inventario?.Id) {
          throw new Error("El servidor no devolvió un inventario válido");
        }
  
        // Actualizar estado
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setInventarios(prev => [data.inventario, ...prev]);
        
        Alert.alert(
          "Éxito",
          `${data.inventario.descripcion} (${data.inventario.consecutivo}) asignado.`,
          [{ text: "OK" }]
        );
  
      } catch (error) {
        console.error("Error en escaneo:", {
          codigoQR,
          error: error.message
        });
        
        Alert.alert(
          "Error",
          error.message.includes("no encontrado") 
            ? `El consecutivo no existe en la base de datos`
            : error.message
        );
      }
    };
  
    EventBus.on("qrScanned", listener);
    return () => EventBus.off("qrScanned", listener);
  }, [id, inventarios]);

  const handleDeleteInventario = useCallback(async (id) => {
    try {
      // const response = await fetch(`http://172.16.1.154:8000/api/sci/inventario/${id}`, {
      const response = await fetch(`http://192.168.68.105:8000/api/sci/inventario/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (response.ok) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setInventarios((prev) => prev.filter((inv) => inv.Id !== id));
      } else {
        Alert.alert("Error", data.message || "No se pudo eliminar.");
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
      Alert.alert("Error", "No se pudo eliminar el inventario.");
    }
  }, []);

  if (isLoading || !userInfo) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <ActivityIndicator color="#44a4af" size="large" />
        <Text className="text-white text-base mt-4">Cargando información...</Text>
      </View>
    );
  }

  return (
    <Screen>
      <Stack.Screen
        options={{
          headerTitle: `${userInfo?.user?.nombre || "Desconocido"}`, 
        }}
      />

      <View className="flex-1 bg-black">
        <FlatList
          data={inventarios}
          className="px-5"
          keyExtractor={(inv) => inv.Id.toString()}
          // keyExtractor={(item) => item.Id.toString()}
          // keyExtractor={(item) => `${item.Id}-${item.inventario}`}
          renderItem={({ item, index }) => (
            <AnimateInvCard item={item} index={index} onDelete={handleDeleteInventario} />
          )}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center mt-20">
              <Text className="text-white text-lg font-bold">
                No hay inventarios asignados
              </Text>
            </View>
          }
        />
      </View>

      <TouchableOpacity
        onPress={() => router.push({ pathname: "/scan", params: { userId: id } })}
        className="absolute bottom-8 right-4 bg-teal-500 w-16 h-16 rounded-full justify-center items-center shadow-lg shadow-black"
      >
        <Ionicons name="add" size={28} color="#25292e" />
      </TouchableOpacity>

    </Screen>
  );
}
