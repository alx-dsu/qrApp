// import React, { useState } from "react";
// import { View, Text, StyleSheet } from "react-native";
// import { CameraView, useCameraPermissions } from "expo-camera";
// import ButtonStyle from "@/components/ButtonStyle";

// export default function QRScanner({ onScan }) {
//   const [facing] = useState('back');
//   const [scanned, setScanned] = useState(false);
//   const [permission, requestPermission] = useCameraPermissions();

//   if (!permission) return <View />;
//   if (!permission.granted) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.message}>Necesitamos permiso para usar la cámara</Text>
//         <ButtonStyle theme="primary" label="Conceder permiso" onPress={requestPermission} />
//       </View>
//     );
//   }

//   const handleBarCodeScanned = ({ type, data }) => {
//     setScanned(true);
//     if (onScan) onScan(data);
//   };

//   const resetScan = () => {
//     setScanned(false);
//   };

//   return (
//     <View style={styles.container}>
//       <CameraView
//         style={styles.camera}
//         facing={facing}
//         onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
//       >
//         {scanned && (
//           <View style={styles.buttonContainer}>
//             <ButtonStyle theme="primary" label="Escanear de nuevo" onPress={resetScan} />
//           </View>
//         )}
//       </CameraView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   camera: { flex: 1 },
//   message: { textAlign: 'center', padding: 10 },
//   buttonContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// components/QRScanner.jsx
import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import ButtonStyle from "@/components/ButtonStyle";

export default function QRScanner({ onScanned }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [qrData, setQrData] = useState(null);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Se requiere permiso para usar la cámara</Text>
        <ButtonStyle label="Conceder permiso" onPress={requestPermission} />
      </View>
    );
  }

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setQrData(data);

    const partes = data.split('-');
    const consecutivo = partes[partes.length - 1];
    const id = parseInt(consecutivo, 10);

    onScanned?.({ raw: data, consecutivo, id });
  };

  const resetScan = () => {
    setScanned(false);
    setQrData(null);
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        <View style={styles.buttonContainer}>
          {scanned && (
            <ButtonStyle
              style={styles.button}
              theme="primary"
              label="Escanear de nuevo"
              onPress={resetScan}
            />
          )}
        </View>
      </CameraView>
      {qrData && (
        <Text style={styles.qrText}>Número de inventario: {qrData}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    width: "100%",
    height: "175%",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    borderRadius: 10,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  qrText: {
    textAlign: "center",
    fontSize: 18,
    padding: 10,
  },
});
