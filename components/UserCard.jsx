import { useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
  Pressable,
} from "react-native";
import "../global.css";
import { Link } from "expo-router";

export function UserCard({ user }) {
  return (
    <Link asChild href={`/${user.id}`}>
      <Pressable
        className="active:opacity-70 border border-black 
      active:border-white/50 mb-2 bg-gray-200/10 rounded-xl p-4"
      >
        <View className="flex-row gap-4" key={user.id}>
          <Image source={{ uri: user.image }} className="size-24 rounded-full" />
          <View>
            <Text className="mb-1 font-bold" style={styles.title}>
              {user.nombre}
            </Text>
            <Text style={styles.title}>{user.email}</Text>
            <Text className="mt-2 flex-1" style={styles.description}>
              {user.organo}
            </Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

export function AnimateUserCard({ user, index }) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 50,
      delay: index * 50,
      useNativeDriver: true,
    }).start();
  }, [opacity, index]);
  return (
    <Animated.View style={{ opacity }}>
      <UserCard user={user} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 25,
  },
  image: {
    width: 225,
    height: 125,
    borderRadius: 8,
    marginBottom: 5,
  },
  title: {
    fontSize: 15,
    marginBottom: 5,
    color: "#fff",
  },
  description: {
    fontSize: 14,
    color: "#eee",
  },
});
