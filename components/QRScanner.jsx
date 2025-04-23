import React, { useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert, Stack } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import ButtonStyle from "@/components/ButtonStyle";

// import { useNavigation } from 'expo-router';
// import { useEffect } from 'react';

export default function QRScanner({ onScanned }) {

  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);

  // const navigation = useNavigation();

  // useEffect(() => {
  //   navigation.getParent()?.setOptions({
  //     headerShown: true,
  //     headerBackVisible: true,
  //   });
  // }, [navigation]);

  const handleRequestPermission = async () => {
    setIsRequestingPermission(true);
    const response = await requestPermission();
    setIsRequestingPermission(false);
    
    if (!response.granted) {
      alert(
        'Permiso requerido',
        'Se necesitan permisos de cámara para escanear QR',
        [
          { text: "OK" },
          { 
            text: "Abrir configuración", 
            onPress: () => Linking.openSettings() 
          }
        ]
      );
    }
  };

  if (!permission) {
    return (
      <View className="justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 bg-gray-900 p-6 justify-center">
        {/* Icono o logo */}
        <View className="items-center mb-8">
          <View className="bg-gray-700 p-4 rounded-full">
            <Text className="text-white text-2xl">📷</Text>
          </View>
        </View>

        {/* Mensaje principal */}
        <Text className="text-white text-xl font-bold text-center mb-2">
          Permiso requerido
        </Text>
        <Text className="text-gray-400 text-center mb-8">
          Necesitamos acceso a tu cámara para escanear códigos QR
        </Text>

        {/* Botón principal */}
        <ButtonStyle 
          label="Permitir acceso a la cámara"
          onPress={handleRequestPermission}
          disabled={isRequestingPermission}
          style={{
            backgroundColor: '#1e40af', // Azul oscuro
            paddingVertical: 14,
          }}
          textStyle={{
            fontSize: 16,
            fontWeight: 'bold',
          }}
        />

        {/* Nota informativa */}
        <Text className="text-gray-500 text-xs text-center mt-8">
          Al permitir el acceso, podrás escanear códigos QR
        </Text>
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

    // Mostrar alerta con el código escaneado
    // Alert.alert(
    //   "Código escaneado",
    //   `Inventario: ${data}`,
    //   [
    //     { 
    //       text: "OK", 
    //       onPress: () => setScanned(false) 
    //     }
    //   ]
    // );
  };

  const resetScan = () => {
    setScanned(false);
    setQrData(null);
  };
    
  return (
    <View style={styles.container}>
      {/* Vista de la cámara - elemento principal */}
      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        {/* Marco transparente para el área de escaneo */}
        <View style={styles.overlay}>
          <View style={styles.scanFrame} />
        </View>
      </CameraView>

      {/* Panel inferior */}
      <View style={styles.bottomPanel}>
        {scanned ? (
          <ButtonStyle
            label="Escanear Nuevamente"
            onPress={() => setScanned(false)}
            style={styles.scanButton}
          />
        ) : (
          <Text style={styles.instructionText}>
            Enfoca el código QR dentro del marco
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#fff',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#121212',
  },
  permissionTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  permissionText: {
    color: '#aaa',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  permissionButton: {
    width: '80%',
    backgroundColor: '#1E40AF',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  scanFrame: {
    width: 340,
    height: 340,
    borderWidth: 2,
    borderColor: '#44a4af',
    borderRadius: 10,
    backgroundColor: 'rgba(68, 164, 175, 0.1)',
  },
  bottomPanel: {
    padding: 20,
    backgroundColor: '#1F2937',
    alignItems: 'center',
  },
  scanButton: {
    width: '100%',
    backgroundColor: '#44a4af',
  },
  instructionText: {
    color: '#fff',
    textAlign: 'center',
  },
});