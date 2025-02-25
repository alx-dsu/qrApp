import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity, Pressable } from "react-native";
import { CameraView, CameraType, useCameraPermissions, Camera } from "expo-camera";

import ButtonStyle from "@/components/ButtonStyle";

export default function Scan() {
  const [facing, setFacing] = useState('back');
  const [scanned, setScanned] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setQrData(data);
    alert(`QR code with type ${type} and data ${data} has been scanned!`);
  };

  // function toggleCameraFacing() {
  //   setFacing(current => (current === 'back' ? 'front' : 'back'));
  // }

  const resetScan = () => {
    setScanned(false);
    setQrData(null);
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        <View style={styles.buttonContainer}>
          {/* <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity> */}
          {scanned && (
            // <TouchableOpacity style={styles.button} onPress={resetScan}>
            //   <Text style={styles.text}>Escanear de Nuevo</Text>
            // </TouchableOpacity>
            <ButtonStyle style={styles.button} theme="primary" label="Escanear de Nuevo" onPress={resetScan} />
          )}
        </View>
      </CameraView>
      {qrData && <Text style={styles.qrText}>Numero de inventario: {qrData}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
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
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  qrText: {
    textAlign: 'center',
    fontSize: 18,
    padding: 10,
  },
});

// export default function Scan() {
//   return (
//     <View>
//       <Text>Pantalla de escaneo</Text>
//     </View>
//   );
// }
