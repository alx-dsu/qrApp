import React, { useEffect, useState, memo } from "react";
import {
  ActivityIndicator,
  FlatList, 
  TextInput, 
  View,
} from "react-native";
import "../global.css";

import { getLatestUsers } from "../lib/users.js";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { UserCard, AnimateUserCard } from "./UserCard.jsx";
import Screen from "./Screen.jsx";

export function Main() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const insets = useSafeAreaInsets();

  useEffect(() => {
    getLatestUsers().then((users) => {
      setUsers(users);
      setFilteredUsers(users);
    });
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
      <TextInput
        placeholder="Buscar usuario..."
        value={search}
        onChangeText={handleSearch}
        className="border border-gray-400 rounded-xl p-2 my-2 text-white"
      />

      {filteredUsers.length === 0 ? (
        <ActivityIndicator size={"large"} />
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(user) => user.id.toString()}
          renderItem={({ item, index }) => (
            <MemoizedUserCard user={item} index={index} />
          )}
        />
      )}
    </Screen>
  );
}