import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { Camera } from "expo-camera";

export default function Scan() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setText(data);
  };

  if (hasPermission === null) {
    return <Text>Solicitando permiso de cámara...</Text>;
  }
  if (hasPermission === false) {
    return <Text>Permiso denegado</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={styles.scanner}
        // barCodeScannerSettings={{
        //   barCodeTypes: ["qr"],
        // }}
        // barCodeScannerSettings={{
        //   barCodeTypes: [Camera.Constants.BarCodeType.qr],
        // }}
      />
      {scanned && (
        <Button title="Escanear de nuevo" onPress={() => setScanned(false)} />
      )}
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  scanner: { width: "100%", height: 300 },
  text: { marginTop: 20, fontSize: 18 },
});

// export default function Scan() {
//   return (
//     <View>
//       <Text>Pantalla de escaneo</Text>
//     </View>
//   );
// }
