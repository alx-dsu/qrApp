import React, { useState } from "react";
import { View, Text, ActivityIndicator, Linking, Dimensions, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import ButtonStyle from "@/components/ButtonStyle";
import { qrScannerStyles } from "@/utils/styles";
import "../global.css"

// import * as Haptics from 'expo-haptics';
// import { Audio } from 'expo-av';
// import { useCallback } from 'react';

// const { width } = Dimensions.get('window');
// const SCAN_FRAME_SIZE = width * 0.8; // Marco ocupará 80% del ancho

export default function QRScanner({ onScanned }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);

  const handleRequestPermission = async () => {
    setIsRequestingPermission(true);
    const response = await requestPermission();
    setIsRequestingPermission(false);
    
    if (!response.granted) {
      Alert.alert(
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
      <View className="flex-1 justify-center items-center bg-black">
        <ActivityIndicator size="large" color="#44a4af" />
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
          className="bg-blue-800 py-3"
          textClassName="text-base font-bold"
        />

        {/* Nota informativa */}
        <Text className="text-gray-500 text-xs text-center mt-8">
          Al permitir el acceso, podrás escanear códigos QR
        </Text>
      </View>
    );
  }

  // const playSound = useCallback(async () => {
  //   const { sound } = await Audio.Sound.createAsync(
  //     // require('@/assets/sounds/beep.mp3')
  //   );
  //   await sound.playAsync();
  // }, []);

  // const handleBarCodeScanned = useCallback(async ({ data }) => {
  //   setScanned(true);
  //   await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  //   await playSound();
    
  //   onScanned?.({ raw: data });
  // }, [onScanned, playSound]);

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    const partes = data.split('-');
    const consecutivo = partes[partes.length - 1];
    const id = parseInt(consecutivo, 10);
    onScanned?.({ raw: data, consecutivo, id });
  };
    
  return (
    <View className="flex-1 bg-black">
      {/* Vista de la cámara */}
      <CameraView
        style={qrScannerStyles.camera}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        {/* Overlay y marco de escaneo */}
        <View 
          style={
            qrScannerStyles.scanFrame}
        />
      </CameraView>
      {/* Panel inferior */}
      <View className="px-5 py-4 bg-gray-800 items-center">
        {scanned ? (
          <ButtonStyle
            label="Escanear Nuevamente"
            onPress={() => setScanned(false)}
            className="w-full bg-teal-500"
          />
        ) : (
          <Text className="text-white text-center">
            Enfoca el código QR dentro del marco
          </Text>
        )}
      </View>
    </View>
  );
}