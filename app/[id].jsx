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

  //     // const texto = "PC- 124-13-003252";
  //     // const match = texto.match(/(\d+)$/);
  //     // const resultado = match ? match[0] : null;

  //     // console.log(resultado); // "003252"

  //     // const consecutivo = nuevoInventario.slice(-6);
  //     // const inventarioId = parseInt(consecutivo, 10);
  //     const match = nuevoInventario.match(/(\d+)$/);
  //     const consecutivo = match ? match[0] : null;
  //     const inventarioId = parseInt(consecutivo, 10);

  //     console.log(`El número consecutivo es: ${consecutivo}`);

  //     // const Existe = inventarios.some(inv => inv.inventario === nuevoInventario);
  //     // if (Existe) {
  //     //   Alert.alert(
  //     //     "Inventario ya asignado",
  //     //     `Este inventario ${nuevoInventario} ya está asignado al usuario.`,
  //     //     [{ text: "OK" }]
  //     //   );
  //     //   return;
  //     // }

  //     fetch(`http://172.16.1.154:8000/api/sci/inventario/reasignar`, {
  //     // fetch(`http://192.168.68.105:8000/api/sci/inventario/reasignar`, {
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
  //           const Existe = inventarios.some((i) => i.Id === inv.Id);
  //           if (!Existe) {
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
    const listener = async (nuevoInventario) => {
      try {
        const match = nuevoInventario.match(/(\d+)$/);
        const consecutivo = match ? match[0] : null;
        
        console.log(`Procesando:`, { 
          codigoQR: nuevoInventario, 
          consecutivo 
        });
  
        // Verificación local primero
        const existeLocal = inventarios.some(inv => 
          inv.inventario?.endsWith(consecutivo)
        );
        
        if (existeLocal) {
          const itemExistente = inventarios.find(inv => 
            inv.inventario?.endsWith(consecutivo)
          );
          Alert.alert(
            "Inventario ya asignado",
            `${itemExistente.descripcion}\n(${nuevoInventario})\nya está asignado al usuario.`,
            [{ text: "OK" }]
          );
          return;
        }
  
        const response = await fetch(`http://172.16.1.154:8000/api/sci/inventario/reasignar`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            inventario: nuevoInventario.trim(),
            id_usuario: id
          }),
        });
  
        const data = await response.json();
  
        if (!response.ok || data.error) {
          throw new Error(data.message || "Error al asignar inventario");
        }
  
        if (!data.inventario?.Id) {
          throw new Error("Respuesta inválida del servidor");
        }
  
        // Actualización con animación
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setInventarios(prev => [data.inventario, ...prev]);
        
        Alert.alert(
          "Asignado correctamente",
          `Descripción: ${data.inventario.descripcion || 'Sin descripción'}\nInventario: ${nuevoInventario || 'N/A'}\nse ha asignado correctamente.`,
          // `${data.inventario.descripcion} (${nuevoInventario})`,
          [{ text: "OK" }]
        );
  
      } catch (error) {
        // console.error("Error en escaneo:", {
        //   error: error.message,
        //   timestamp: new Date().toISOString()
        // });
        
        Alert.alert(
          "Error", 
          error.message.includes("no encontrado") 
            ? `El inventario no existe en el sistema`
            : error.message || "Error al procesar el QR"
        );
      }
    };
  
    EventBus.on("qrScanned", listener);
    return () => EventBus.off("qrScanned", listener);
  }, [id, inventarios]);

  const handleDeleteInventario = useCallback(async (id) => {
    try {
      const response = await fetch(`http://172.16.1.154:8000/api/sci/inventario/${id}`, {
      // const response = await fetch(`http://192.168.68.105:8000/api/sci/inventario/${id}`, {
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
