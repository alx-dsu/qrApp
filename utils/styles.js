import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get('window');
const SCAN_FRAME_SIZE = width * 0.8;

export const qrScannerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: SCAN_FRAME_SIZE,
    height: SCAN_FRAME_SIZE,
    borderWidth: 2,
    borderColor: '#44a4af',
    borderRadius: 10,
    backgroundColor: 'rgba(68, 164, 175, 0.1)',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -SCAN_FRAME_SIZE/2,
    marginTop: -SCAN_FRAME_SIZE/2,
  },
});