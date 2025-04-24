import React, { useEffect, useState, memo } from "react";
import {
  ActivityIndicator,
  FlatList, 
  TextInput, 
  View,
  Text,
} from "react-native";
import "../global.css";
import { getLatestUsers } from "@/lib/users.js";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { UserCard, AnimateUserCard } from "./UserCard.jsx";
import Screen from "./Screen.jsx";

export function Main() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    getLatestUsers().then((users) => {
      setUsers(users);
      setFilteredUsers(users);
    })
    .finally(() => setIsLoading(false));
  }, []);

  const handleSearch = (text) => {
    setSearch(text);
    const filtered = users.filter((user) =>
      user.nombre.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const MemoizedUserCard = memo(AnimateUserCard);

  return (
    <Screen>
      <View className="px-4 pt-2 pb-2 bg-black">
        <TextInput
          placeholder="Buscar usuario..."
          placeholderTextColor="#9CA3AF" // Color gris para el placeholder
          value={search}
          onChangeText={handleSearch}
          className="border border-gray-600 rounded-xl p-3 text-white bg-gray-800"
          selectionColor="#44a4af" // Color del cursor
        />
      </View>

      {/* Estado de carga */}
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#44a4af" />
        </View>
      ) : (
        /* Lista de usuarios */
        <FlatList
          data={filteredUsers}
          keyExtractor={(user) => user.id.toString()}
          renderItem={({ item, index }) => (
            // <MemoizedUserCard user={item} index={index} />
            <AnimateUserCard user={item} index={index} />
          )}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center mt-10">
              <Text className="text-gray-400 text-lg">
                {search ? "No se encontraron resultados" : "No hay usuarios registrados"}
              </Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        />
      )}
    </Screen>
  );
}