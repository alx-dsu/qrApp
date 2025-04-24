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
