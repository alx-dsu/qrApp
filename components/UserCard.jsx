import React, { useEffect, useRef, useState, memo } from "react";
import { Text, View, Image, Animated, Pressable, } from "react-native";
import { Link } from "expo-router";
import userPlaceholder from "@/assets/images/user.png";
import "../global.css";

const UserCard = ({ user }) => {
  const [imageError, setImageError] = useState(false);
  return (
    <Link asChild href={`/${user.id}`}>
      <Pressable
        className="active:opacity-70 border border-black 
      active:border-white/50 mb-2 bg-gray-200/10 rounded-xl p-4"
      >
        <View className="flex-row gap-4" key={user.id}>
          <View className="w-24 h-24 rounded-full bg-gray-700 overflow-hidden">
            <Image 
              source={imageError || !user.image 
                ? userPlaceholder 
                : { uri: user.image }}
              className="w-full h-full"
              onError={() => setImageError(true)}
              resizeMode="cover"
            />
          </View>
          <View className="flex-1">
            <Text className="text-white text-base font-bold mb-1">
              {user.nombre}
            </Text>
            <Text className="text-white text-sm mb-2">{user.email}</Text>
            <Text className="text-gray-300 text-sm">{user.organo}</Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
export default memo(UserCard);

export const AnimateUserCard = memo(
  ({ user, index }) => {
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
  },
  (prevProps, nextProps) => {
    return prevProps.user.id === nextProps.user.id && prevProps.index === nextProps.index;
  }
);
