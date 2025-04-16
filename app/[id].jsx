import { FlatList, ActivityIndicator, Text, View, Image, Alert, Platform, UIManager, LayoutAnimation  } from "react-native";
import { Stack, useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { getUserDetails } from "../lib/users";

import {InvCard, AnimateInvCard} from "../components/InvCard";
import "../global.css";
import Screen from "../components/Screen";

import { TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function Detail() {
  // const { id } = useLocalSearchParams();
  const { id, nuevoInventario } = useLocalSearchParams();
  const [userInfo, setUserInfo] = useState(null);
  const [inventarios, setInventarios] = useState([]);

  const router = useRouter();

  useEffect(() => {
    if (nuevoInventario) {
      const consecutivo = nuevoInventario.slice(-6);
      const inventarioId = parseInt(consecutivo, 10);

      // Puedes hacer el POST aquí
      fetch(`http://172.16.1.154:8000/api/sci/inventario/${inventarioId}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inventario: nuevoInventario,
          id_usuario: id,
        }),
      })
        .then(res => res.json())
        .then(data => {
          console.log("Respuesta de agregar inventario:", data);
          if (data && data.Id) {
            setInventarios((prev) => [data, ...prev]);
          } else {
            Alert.alert("Error", data.message || "No se pudo agregar.");
          }
        })
        .catch(err => {
          console.error(err);
          Alert.alert("Error", "Hubo un problema al agregar el inventario.");
        })
      }
    if (id) {
      // getUserDetails(id).then(setUserInfo);
      // getUserDetails(id).then(data => {
      // console.log('Datos recibidos:', data); // <-- Aquí inspeccionamos
      // setUserInfo(data);
      // });
      getUserDetails(id).then((data) => {
        setUserInfo(data);
        setInventarios(data.inventarios || []);
      });
    }
  }, [id]);

  const handleDeleteInventario = async (id) => {
    try {
      console.log("Eliminando inventario con ID:", id);
      const response = await fetch(`http://172.16.1.154:8000/api/sci/inventario/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
  
      const data = await response.json();
      console.log("Respuesta de la API:", data);
  
      if (response.ok) {

        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

        // Elimina localmente el inventario para refrescar la lista
        setInventarios((prev) => prev.filter((inv) => inv.Id !== id));
      } else {
        Alert.alert("Error", data.message || "No se pudo eliminar.");
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
      Alert.alert("Error", "No se pudo eliminar el inventario.");
    }
  };

  if (!userInfo) {
    return <ActivityIndicator color={"#fff"} size={"large"} />;
  }

  return (
    <Screen>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: "#E5E7EB" },
          headerTintColor: "black",
          headerTitle: `${userInfo?.user?.nombre ?? 'Desconocido'}`,
        }}
      />

      <FlatList
        data={inventarios}
        keyExtractor={(inv) => inv.Id.toString()}
        renderItem={({ item, index }) => 
          <AnimateInvCard item={item} index={index} onDelete={handleDeleteInventario}
        />}
      />

      <TouchableOpacity
        onPress={() => router.push({ pathname: "/scan", params: { userId: id } })}
        style={{
          position: "absolute",
          bottom: 30,
          right: 20,
          backgroundColor: "#44a4af",
          borderRadius: 100,
          width: 60,
          height: 60,
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 5,
          elevation: 5,
        }}
      >
        <Ionicons name={"add"} color={"#25292e"} size={38}/>
      </TouchableOpacity>

    </Screen>
  );
}
