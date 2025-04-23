// import { FlatList, ActivityIndicator, Text, View, Image, Alert, Platform, UIManager, LayoutAnimation  } from "react-native";
// import { Stack, useLocalSearchParams, useRouter, useNavigation } from "expo-router";
// import { useEffect, useState } from "react";
// import { getUserDetails } from "../lib/users";

// import {InvCard, AnimateInvCard} from "../components/InvCard";
// import "../global.css";
// import Screen from "../components/Screen";

// import { TouchableOpacity } from "react-native";
// import Ionicons from "@expo/vector-icons/Ionicons";

// if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
//   UIManager.setLayoutAnimationEnabledExperimental(true);
// }

// export default function Detail() {
//   // const { id } = useLocalSearchParams();
//   const { id, nuevoInventario } = useLocalSearchParams();
//   const [userInfo, setUserInfo] = useState(null);
//   const [inventarios, setInventarios] = useState([]);

//   const router = useRouter();

//   useEffect(() => {
//     if (nuevoInventario) {
//       const consecutivo = nuevoInventario.slice(-6);
//       const inventarioId = parseInt(consecutivo, 10);

//       // Puedes hacer el POST aquí
//       // fetch(`http://172.16.1.154:8000/api/sci/inventario/${inventarioId}/asignar`, {
//       fetch(`http://172.16.1.154:8000/api/sci/inventario/reasignar`, {
//         method: "PUT",
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           inventario: nuevoInventario,
//           id_usuario: id,
//         }),
//       })
//         .then(res => res.json())
//         .then(data => {
//           console.log("Respuesta de agregar inventario:", data);
//           if (data && data.Id) {
//             setInventarios((prev) => [data, ...prev]);
//           } else {
//             Alert.alert("Error", data.message || "No se pudo agregar.");
//           }
//         })
//         .catch(err => {
//           console.error(err);
//           Alert.alert("Error", "Hubo un problema al agregar el inventario.");
//         })
//       }
//     if (id) {
//       // getUserDetails(id).then(setUserInfo);
//       // getUserDetails(id).then(data => {
//       // console.log('Datos recibidos:', data); // <-- Aquí inspeccionamos
//       // setUserInfo(data);
//       // });
//       getUserDetails(id).then((data) => {
//         setUserInfo(data);
//         setInventarios(data.inventarios || []);
//       });
//     }
//   }, [id]);

//   const handleDeleteInventario = async (id) => {
//     try {
//       console.log("Eliminando inventario con ID:", id);
//       const response = await fetch(`http://172.16.1.154:8000/api/sci/inventario/${id}`, {
//         method: "DELETE",
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//         },
//       });
  
//       const data = await response.json();
//       console.log("Respuesta de la API:", data);
  
//       if (response.ok) {

//         LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

//         // Elimina localmente el inventario para refrescar la lista
//         setInventarios((prev) => prev.filter((inv) => inv.Id !== id));
//       } else {
//         Alert.alert("Error", data.message || "No se pudo eliminar.");
//       }
//     } catch (error) {
//       console.error("Error al eliminar:", error);
//       Alert.alert("Error", "No se pudo eliminar el inventario.");
//     }
//   };

//   if (!userInfo) {
//     return <ActivityIndicator color={"#fff"} size={"large"} />;
//   }

//   return (
//     <Screen>
//       <Stack.Screen
//         options={{
//           headerStyle: { backgroundColor: "#E5E7EB" },
//           headerTintColor: "black",
//           headerTitle: `${userInfo?.user?.nombre ?? 'Desconocido'}`,
//         }}
//       />

//       <FlatList
//         data={inventarios}
//         keyExtractor={(inv) => inv.Id.toString()}
//         renderItem={({ item, index }) => 
//           <AnimateInvCard item={item} index={index} onDelete={handleDeleteInventario}
//         />}
//       />

//       <TouchableOpacity
//         onPress={() => router.push({ pathname: "/scan", params: { userId: id } })}
//         // onPress={() => router.replace({ pathname: "/scan", params: { userId: id } })}
//         style={{
//           position: "absolute",
//           bottom: 30,
//           right: 20,
//           backgroundColor: "#44a4af",
//           borderRadius: 100,
//           width: 60,
//           height: 60,
//           justifyContent: "center",
//           alignItems: "center",
//           shadowColor: "#000",
//           shadowOffset: { width: 0, height: 2 },
//           shadowOpacity: 0.3,
//           shadowRadius: 5,
//           elevation: 5,
//         }}
//       >
//         <Ionicons name={"add"} color={"#25292e"} size={38}/>
//       </TouchableOpacity>

//     </Screen>
//   );
// }

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
import { useEffect, useState, Button } from "react";
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

  const router = useRouter();

  // ✅ Escuchar cuando se escanee un inventario
  useEffect(() => {
    const listener = (nuevoInventario) => {
      const consecutivo = nuevoInventario.slice(-6);
      const inventarioId = parseInt(consecutivo, 10);

      const yaExiste = inventarios.some(inv => inv.inventario === nuevoInventario);
      if (yaExiste) {
        Alert.alert(
          "Inventario ya asignado",
          "Este inventario ya está asignado al usuario.",
          [{ text: "OK" }]
        );
        return;
      }

      fetch(`http://192.168.68.114:8000/api/sci/inventario/reasignar`, {
      // fetch(`http://172.16.1.154:8000/api/sci/inventario/reasignar`, {
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
          if (data.error) {
            Alert.alert("Error", data.message || "Ocurrió un error al asignar el inventario.");
            return;
          }

          const inv = data.inventario;
          
          if (inv && inv.Id) {
            const yaExiste = inventarios.some((i) => i.Id === inv.Id);
            if (!yaExiste) {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              setInventarios((prev) => [inv, ...prev]);
              Alert.alert(
                "Inventario asignado",
                "El inventario se ha asignado correctamente.",
                [{ text: "OK" }]
              );
            }
          } else {
            Alert.alert("Error", data.message || "No se pudo agregar.");
          }
        })
        .catch(err => {
          console.error(err);
          Alert.alert("Error", "Hubo un problema al agregar el inventario.");
        });
    };

    EventBus.on("qrScanned", listener);
    return () => EventBus.off("qrScanned", listener);
  }, [id, inventarios]);
  // useEffect(() => {
  //   if (nuevoInventario && idUsuario) {
  //     const consecutivo = nuevoInventario.split("-").pop().replace(/^0+/, "");
  //     const idInventario = parseInt(consecutivo);
  
  //     const asignarInventario = async () => {
  //       try {
  //         const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/sci/inventario/${idInventario}`, {
  //           method: "PUT",
  //           headers: {
  //             Accept: "application/json",
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify({
  //             inventario: nuevoInventario,
  //             id_usuario: idUsuario,
  //           }),
  //         });
  
  //         const data = await response.json();
  //         console.log("Respuesta de agregar inventario:", data);
  
  //         if (data?.inventario) {
  //           // Verificar si ya existe en el estado
  //           const yaExiste = inventarios.some(inv => inv.Id === data.inventario.Id);
  //           if (!yaExiste) {
  //             LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  //             setInventarios((prev) => [data.inventario, ...prev]);
  //           }
  //         }
  //       } catch (error) {
  //         console.error("Error al asignar inventario:", error);
  //       }
  //     };
  
  //     asignarInventario();
  //   }
  // }, [nuevoInventario, id]);

  useEffect(() => {
    if (id) {
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
      // const response = await fetch(`http://192.168.68.114:8000/api/sci/inventario/${id}`, {
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
          headerTitle: `${userInfo?.user?.nombre ?? "Desconocido"}`,
        }}
      />

      <FlatList
        data={inventarios}
        keyExtractor={(inv) => inv.Id.toString()}
        renderItem={({ item, index }) => (
          <AnimateInvCard item={item} index={index} onDelete={handleDeleteInventario} />
        )}
      />

      <TouchableOpacity
        // onPress={() => router.push({ pathname: "/scan", params: { userId: id } })}
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
        <Ionicons name={"add"} color={"#25292e"} size={38} />
      </TouchableOpacity>
    </Screen>
  );
}
