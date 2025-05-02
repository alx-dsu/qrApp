import { View, Pressable, Text } from "react-native";
import PropTypes from "prop-types";
import Ionicons from "@expo/vector-icons/Ionicons";
import "@/global.css"

export default function ButtonStyle({ 
  label, 
  theme, 
  onPress, 
  disabled = false,
  className = "", 
  textClassName = "",
  iconName = "scan-circle-outline"
}) {
  // Clases base para el contenedor
  const containerClasses = `
    w-full my-2 rounded-xl overflow-hidden
    ${theme === "primary" ? "border-2 border-teal-400" : ""}
  `;

  // Clases base para el botón
  const buttonClasses = `
    py-3 px-6 rounded-lg flex-row items-center justify-center
    ${theme === "primary" ? "bg-white" : "bg-gray-800"}
    ${disabled ? "opacity-60" : ""}
    ${className}
  `;

  // Clases para el texto
  const textClasses = `
    text-base font-medium
    ${theme === "primary" ? "text-gray-900" : "text-white"}
    ${textClassName}
  `;

  // Clases para el ícono
  const iconClasses = `
    mr-2
    ${theme === "primary" ? "text-gray-900" : "text-white"}
  `;

  return (
    <View className={containerClasses}>
      <Pressable
        className={buttonClasses}
        onPress={onPress}
        disabled={disabled}
        android_ripple={{ color: theme === "primary" ? '#2d8c9e' : '#444' }}
      >
        {theme === "primary" && (
          <Ionicons
            name={iconName}
            size={20}
            className={iconClasses}
          />
        )}
        <Text className={textClasses}>{label}</Text>
      </Pressable>
    </View>
  );
}

ButtonStyle.propTypes = {
  label: PropTypes.string.isRequired,
  theme: PropTypes.string,
  onPress: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  textClassName: PropTypes.string,
  iconName: PropTypes.string
};