import { useEffect, useRef, useState, useCallback   } from "react";
import { View, Text, Animated, Alert, Pressable } from "react-native";
import "../global.css";

// export default function InvCard({ item, onPrepareDelete   }) {
export default function InvCard({ item, onDelete }) {

  if (!item) {
    return null;
  }

  // const handleDelete = () => {
  //   Alert.alert(
  //     "¿Eliminar inventario?",
  //     "Esta acción no se puede deshacer.",
  //     [
  //       { text: "Cancelar", style: "cancel" },
  //       {
  //         text: "Eliminar",
  //         style: "destructive",
  //         onPress: onPrepareDelete,
  //       },
  //     ],
  //     { cancelable: true }
  //   );
  // };

  return (
    <View 
      className="active:opacity-70 border border-black 
    active:border-white/50 mb-2 bg-gray-200/10 rounded-xl p-4"
    >
      <Text className="text-white font-bold">
        {item.descripcion || "Descripción no disponible"}
      </Text>
      <Text className="text-gray-400">
        Inventario: {item.inventario || "N/A"}
      </Text>
      {/* <Pressable onPress={handleDelete} className="mt-2 bg-red-500 p-2 rounded-xl"> */}
      {/* <Pressable onPress={() => onDelete(item.Id)}  className="mt-2 bg-red-500 p-2 rounded-xl"> */}
      <Pressable 
        onPress={onDelete} // Solo pasa la función, no ejecuta
        className="mt-2 bg-red-500 p-2 rounded-xl"
      >
        <Text className="text-white text-center">Eliminar</Text>
      </Pressable>
    </View>
  );
} 

export function AnimateInvCard({ item, index, onDelete }) {

  const opacity = useRef(new Animated.Value(0)).current;
  const height = useRef(new Animated.Value(0)).current;
  // const viewRef = useRef(null);
  const [measuredHeight, setMeasuredHeight] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    // Animación de salida
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de eliminar este inventario?',
      [
        { 
          text: 'Cancelar', 
          style: 'cancel',
          onPress: () => {
            // Opcional: Animación para "cancelar" si es necesario
            Animated.timing(opacity, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }).start();
          }
        },
        { 
          text: 'Eliminar',
          onPress: () => {
            // Animación de salida
            Animated.parallel([
              Animated.timing(opacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
              }),
              Animated.timing(height, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
              }),
            ]).start(() => {
              // Llamar a la eliminación REAL después de la animación
              onDelete(item.Id);
            });
          }
        }
      ]
    );
  };

  const onLayout = (e) => {
    if (!measuredHeight) {
      const h = e.nativeEvent.layout.height;
      setMeasuredHeight(h);
      height.setValue(h);
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
      {!measuredHeight && (
        <View onLayout={onLayout} style={{ position: "absolute", opacity: 0, zIndex: -1 }}>
          {/* <InvCard item={item} onPrepareDelete={handlePrepareDelete} /> */}
          <InvCard item={item} onDelete={handleDelete} />
        </View>
      )}

      {/* animated version */}
      {measuredHeight && (
        <Animated.View style={{ height: height, overflow: "hidden", marginBottom: 8 }}>
          <Animated.View style={{ opacity: opacity }}>
            {/* <InvCard item={item} onPrepareDelete={handlePrepareDelete} /> */}
            <InvCard item={item} onDelete={handleDelete} />
          </Animated.View>
        </Animated.View>
      )}
    </>
  );
}