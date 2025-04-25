import { useEffect } from 'react';
import { View, Text, Alert} from 'react-native';

export default function MutationStatus({ mutation, successMessage }) {
  useEffect(() => {
    if (mutation.isError) {
      Alert.alert('Error', mutation.error.message);
    }
    if (mutation.isSuccess) {
      Alert.alert('Éxito', successMessage);
    }
  }, [mutation.status]);

  return null;
}