import React, { useEffect, useRef, useState, memo } from "react";
import { Text, View, Image, Animated, Pressable, } from "react-native";
import { Link } from "expo-router";
import userPlaceholder from "@/assets/images/user.png";
import "@/global.css";

// const UserCard = ({ user }) => {
//   const [imageError, setImageError] = useState(false);
//   return (
//     <Link asChild href={`/${user.id}`}>
//       <Pressable
//         className="active:opacity-70 border border-black 
//       active:border-white/50 mb-2 bg-gray-200/10 rounded-xl p-4"
//       >
//         <View className="flex-row gap-4" key={user.id}>
//           <View className="w-24 h-24 rounded-full bg-gray-700 overflow-hidden">
//             <Image 
//               source={imageError || !user.image 
//                 ? userPlaceholder 
//                 : { uri: user.image }}
//               className="w-full h-full"
//               onError={() => setImageError(true)}
//               resizeMode="cover"
//             />
//           </View>
//           <View className="flex-1">
//             <Text className="text-white text-base font-bold mb-1">
//               {user.nombre}
//             </Text>
//             <Text className="text-white text-sm mb-2">{user.email}</Text>
//             <Text className="text-gray-300 text-sm">{user.organo}</Text>
//           </View>
//         </View>
//       </Pressable>
//     </Link>
//   );
// }
const UserCard = ({ user }) => {
  const [imageError, setImageError] = useState(false);
  // const scaleValue = useRef(new Animated.Value(1)).current;
  
  // const handlePressIn = () => {
  //   Animated.spring(scaleValue, {
  //     toValue: 0.95,
  //     useNativeDriver: true,
  //   }).start();
  // };

  // const handlePressOut = () => {
  //   Animated.spring(scaleValue, {
  //     toValue: 1,
  //     useNativeDriver: true,
  //   }).start();
  // };

  return (
    <Link asChild href={`/${user.id}`}>
      <Pressable
        // onPressIn={handlePressIn}
        // onPressOut={handlePressOut}
        // accessibilityLabel={`Ver inventario de ${user.nombre}`}
        className="active:opacity-70 border border-gray-800 active:border-teal-500/50 mb-2 bg-gray-800 rounded-xl p-4"
      >
        {/* <Animated.View 
          style={{ transform: [{ scale: scaleValue }] }}
          className="active:opacity-70 border border-gray-800 active:border-teal-500/50 mb-2 bg-gray-800 rounded-xl p-4"
        > */}
          <View className="flex-row gap-4 items-center" key={user.id}>
            <View className="w-16 h-16 rounded-full bg-gray-700 overflow-hidden border border-gray-600">
              <Image 
                source={imageError || !user.image ? userPlaceholder : { uri: user.image }}
                className="w-full h-full"
                onError={() => setImageError(true)}
                accessibilityLabel={`Foto de ${user.nombre}`}
              />
            </View>
            <View className="flex-1">
              <Text className="text-white text-lg font-semibold mb-1" numberOfLines={1}>
                {user.nombre}
              </Text>
              <Text className="text-gray-400 text-sm mb-1" numberOfLines={1}>
                {user.email}
              </Text>
              <Text className="text-teal-400 text-xs">{user.organo}</Text>
            </View>
          </View>
        {/* </Animated.View> */}
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
