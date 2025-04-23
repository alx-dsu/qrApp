// import React, { useState, useEffect } from "react";
// import { View, Text, Button, StyleSheet, TouchableOpacity, Pressable } from "react-native";
// import { CameraView, CameraType, useCameraPermissions, Camera } from "expo-camera";

// import { useRouter, useLocalSearchParams } from "expo-router";

// import ButtonStyle from "@/components/ButtonStyle";

// export default function Scan() {
//   const [facing, setFacing] = useState('back');
//   const [scanned, setScanned] = useState(false);
//   const [qrData, setQrData] = useState(null);
//   const [permission, requestPermission] = useCameraPermissions();

//   const router = useRouter();
//   const { userId } = useLocalSearchParams(); // lo mandaste desde el botón
//   // const [scanned, setScanned] = useState(false);

//   if (!permission) {
//     // Camera permissions are still loading.
//     return <View />;
//   }

//   if (!permission.granted) {
//     // Camera permissions are not granted yet.
//     return (
//       <View style={styles.container}>
//         <Text style={styles.message}>We need your permission to show the camera</Text>
//         <Button onPress={requestPermission} title="grant permission" />
//       </View>
//     );
//   }

//   const handleBarCodeScanned = ({ type, data }) => {
//     setScanned(true);
//     setQrData(data);
//     router.replace({
//       pathname: `/${userId}`,
//       params: { nuevoInventario: data },
//     });
//     alert(`QR code with type ${type} and data ${data} has been scanned!`);
//   };

//   const resetScan = () => {
//     setScanned(false);
//     setQrData(null);
//   };

//   return (
//     <View style={styles.container}>
//       <CameraView
//         style={styles.camera}
//         facing={facing}
//         onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
//       >
//         <View style={styles.buttonContainer}>
//           {scanned && (
//             <ButtonStyle style={styles.button} theme="primary" label="Escanear de Nuevo" onPress={resetScan} />
//           )}
//         </View>
//       </CameraView>
//       {qrData && <Text style={styles.qrText}>Numero de inventario: {qrData}</Text>}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   message: {
//     textAlign: 'center',
//     paddingBottom: 10,
//   },
//   camera: {
//     flex: 1,
//   },
//   buttonContainer: {
//     width: "100%",
//     height: "175%",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   button: {
//     borderRadius: 10,
//     width: "100%",
//     height: "100%",
//     alignItems: "center",
//     justifyContent: "center",
//     flexDirection: "row",
//   },
//   text: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: 'white',
//   },
//   qrText: {
//     textAlign: 'center',
//     fontSize: 18,
//     padding: 10,
//   },
// });

//** SCAN EJEMPLO */

// import React from "react";
// import { View, Text, StyleSheet } from "react-native";
// import { useRouter, useLocalSearchParams } from "expo-router";
// import QRScanner from "@/components/QRScanner";

// export default function Scan() {
//   const router = useRouter();
//   const { userId } = useLocalSearchParams();

//   const handleScan = (data) => {
//     router.replace({
//       pathname: `/${userId}`,
//       params: { nuevoInventario: data },
//     });
//     alert(`Código escaneado: ${data}`);
//   };

//   return (
//     <View style={styles.container}>
//       <QRScanner onScan={handleScan} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });

//** FIN Scan ejemplo */

// import QRScanner from "@/components/QRScanner";
// import { useRouter, useLocalSearchParams } from "expo-router";

// export default function Scan() {
//   const router = useRouter();
//   const { userId } = useLocalSearchParams();

//   return (
//     <QRScanner
//       onScanned={({ raw, consecutivo, id }) => {
//         router.replace({
//           pathname: `/${userId}`,
//           params: { nuevoInventario: raw },
//         });
//         setTimeout(() => router.back(), 100);
//         alert(`Escaneado: ${raw}`);
//       }}
//     />
//   );
// }

import QRScanner from "@/components/QRScanner";
import { useRouter, useLocalSearchParams } from "expo-router";
import EventBus from "@/utils/EventBus";

export default function Scan() {
  const router = useRouter();
  const { userId } = useLocalSearchParams();

  return (
    <QRScanner
      onScanned={({ raw }) => {
        EventBus.emit("qrScanned", raw);  // ⬅️ Emitimos evento
        router.back();                    // ⬅️ Regresamos sin cambiar navegación
      }}
    />
  );
}
