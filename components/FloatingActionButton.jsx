import { TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function FloatingActionButton({ onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="absolute bottom-8 right-4 bg-teal-500 w-16 h-16 rounded-full justify-center items-center shadow-lg shadow-black"
    >
      <Ionicons name="add" size={28} color="#25292e" />
    </TouchableOpacity>
  );
}