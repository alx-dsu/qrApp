import { useEffect, useRef, useState  } from "react";
import { View, Text, Animated, Alert, Pressable } from "react-native";
import "../global.css";

export default function InvCard({ item, onPrepareDelete   }) {

  // const [isDeleting, setIsDeleting] = useState(false);

  // const handleDelete = async (Id) => {

  //   if (isDeleting) return; // Evita segunda ejecución

  //   setIsDeleting(true);
  //   console.log("Eliminando inventario con ID:", Id);

  //   try {

  //     console.log(`Eliminando inventario con ID: ${item.Id}`);

  //     const response = await fetch(`http://172.16.1.154:8000/api/sci/inventario/${item.Id}`, {
  //       method: "DELETE",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     const responseData = await response.json();
  //     console.log("Respuesta de la API:", responseData);

  //     if (response.ok) {
  //       console.log("Eliminado correctamente, llamando a onDelete");
  //       // onDelete(item.Id);
  //       onDelete();
  //     } else {
  //       console.error("Error al eliminar:", data);
  //       // Alert.alert("Error", "No se pudo eliminar el inventario");
  //     }
  //   } catch (error) {
  //     console.error("Error en la solicitud:", error);
  //     // Alert.alert("Error", "Hubo un problema de conexión");
  //   } finally {
  //     setIsDeleting(false);
  //   }
  // };

  if (!item) {
    return null;
  }

  const handleDelete = () => {
    Alert.alert(
      "¿Eliminar inventario?",
      "Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: onPrepareDelete,
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View className="active:opacity-70 border border-black active:border-white/50 mb-2 bg-gray-200/10 rounded-xl p-4">
      <Text className="text-white font-bold">
        {item.descripcion || "Descripción no disponible"}
      </Text>
      <Text className="text-gray-400">
        Inventario: {item.inventario || "N/A"}
      </Text>
      <Pressable onPress={handleDelete} className="mt-2 bg-red-500 p-2 rounded-xl">
        <Text className="text-white text-center">Eliminar</Text>
      </Pressable>
    </View>
  );
} 

export function AnimateInvCard({ item, index, onDelete }) {

  const opacity = useRef(new Animated.Value(0)).current;
  const height = useRef(new Animated.Value(0)).current;
  const viewRef = useRef(null);
  const [measuredHeight, setMeasuredHeight] = useState(null);

  // useEffect(() => {
  //   if (measuredHeight !== null) {
  //     height.setValue(measuredHeight);
  //     Animated.timing(opacity, {
  //       toValue: 1,
  //       duration: 300,
  //       delay: index * 50,
  //       useNativeDriver: true,
  //     }).start();
  //   }
  // }, [measuredHeight]);

  const handlePrepareDelete = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(height, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false, // ✅ importante
      }),
    ]).start(() => {
      onDelete(item.Id);
    });
  };

  const onLayout = (e) => {
    if (measuredHeight === null) {
      const h = e.nativeEvent.layout.height;
      setMeasuredHeight(h);
      height.setValue(h); // importante para colapso

      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        delay: index * 50,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <>
      {/* invisible layout to measure */}
      {measuredHeight === null && (
        <View onLayout={onLayout} style={{ position: "absolute", opacity: 0, zIndex: -1 }}>
          <InvCard item={item} onPrepareDelete={handlePrepareDelete} />
        </View>
      )}

      {/* animated version */}
      {measuredHeight !== null && (
        <Animated.View style={{ height, overflow: "hidden", marginBottom: 8 }}>
          <Animated.View style={{ opacity }}>
            <InvCard item={item} onPrepareDelete={handlePrepareDelete} />
          </Animated.View>
        </Animated.View>
      )}
    </>
    // <Animated.View style={{ height, overflow: "hidden", marginBottom: 8 }}>
    //   <Animated.View style={{ opacity }}>
    //     <View onLayout={onLayout} style={{ position: 'absolute', opacity: 0, zIndex: -1 }}>
    //       <InvCard item={item} onPrepareDelete={handlePrepareDelete} />
    //     </View>
    //   </Animated.View>
    // </Animated.View>
  );
}