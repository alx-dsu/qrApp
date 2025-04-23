// import { StyleSheet, View, Pressable, Text } from "react-native";
// import PropTypes from "prop-types";
// import Ionicons from "@expo/vector-icons/Ionicons";


// export default function ButtonStyle({ label, theme, onPress }) {
//   if (theme === "primary") {
//     return (
//       <View
//         style={[
//           styles.buttonContainer,
//           { borderWidth: 4, borderColor: "#44a4af", borderRadius: 18 },
//         ]}
//       >
//         <Pressable
//           style={[styles.button, { backgroundColor: "#fff" }]}
//           onPress={onPress}
//         >
//           <Ionicons
//             name="scan-circle-outline"
//             size={20}
//             color="#25292e"
//             style={styles.buttonIcon}
//           />
//           <Text style={[styles.buttonLabel, { color: "#25292e" }]}>
//             {label}
//           </Text>
//         </Pressable>
//       </View>
//     );
//   }
//   return (
//     <View style={styles.buttonContainer}>
//       <Pressable
//         style={styles.button}
//         onPress={onPress}
//         // onPress={() => alert("You pressed a button.")}
//       >
//         <Text style={styles.buttonLabel}>{label}</Text>
//       </Pressable>
//     </View>
//   );
// }

// ButtonStyle.propTypes = {
//   label: PropTypes.string.isRequired,
//   theme: PropTypes.string,
//   onPress: PropTypes.func,
// };

// const styles = StyleSheet.create({
//   buttonContainer: {
//     width: 200,
//     height: 60,
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 3,
//   },
//   button: {
//     borderRadius: 10,
//     width: "100%",
//     height: "100%",
//     alignItems: "center",
//     justifyContent: "center",
//     flexDirection: "row",
//   },
//   buttonIcon: {
//     paddingRight: 8,
//   },
//   buttonLabel: {
//     color: "#fff",
//     fontSize: 16,
//   },
// });
import { StyleSheet, View, Pressable, Text } from "react-native";
import PropTypes from "prop-types";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function ButtonStyle({ 
  label, 
  theme, 
  onPress, 
  disabled = false,
  style = {}, // Prop para estilos personalizados del contenedor
  textStyle = {}, // Prop para estilos personalizados del texto
  iconName = "scan-circle-outline" // Icono por defecto
}) {
  // Estilos base
  const baseButtonStyles = [
    styles.button,
    theme === "primary" && styles.primaryButton,
    disabled && styles.disabledButton,
    style // Estilos personalizados
  ];

  const baseTextStyles = [
    styles.buttonLabel,
    theme === "primary" && styles.primaryButtonLabel,
    textStyle // Estilos personalizados del texto
  ];

  if (theme === "primary") {
    return (
      <View style={[styles.buttonContainer, styles.primaryContainer]}>
        <Pressable
          style={baseButtonStyles}
          onPress={onPress}
          disabled={disabled}
          android_ripple={{ color: '#2d8c9e' }}
        >
          <Ionicons
            name={iconName}
            size={20}
            style={styles.buttonIcon}
          />
          <Text style={baseTextStyles}>{label}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.buttonContainer}>
      <Pressable
        style={baseButtonStyles}
        onPress={onPress}
        disabled={disabled}
        android_ripple={{ color: '#333' }}
      >
        <Text style={baseTextStyles}>{label}</Text>
      </Pressable>
    </View>
  );
}

ButtonStyle.propTypes = {
  label: PropTypes.string.isRequired,
  theme: PropTypes.string,
  onPress: PropTypes.func,
  disabled: PropTypes.bool,
  style: PropTypes.object,
  textStyle: PropTypes.object,
  iconName: PropTypes.string
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: '100%',
    marginVertical: 8,
    borderRadius: 10,
    overflow: 'hidden', // Para que el ripple effect no se salga del borde
  },
  primaryContainer: {
    borderWidth: 2,
    borderColor: '#44a4af',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#333',
  },
  primaryButton: {
    backgroundColor: '#fff',
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  primaryButtonLabel: {
    color: '#25292e',
  },
  buttonIcon: {
    marginRight: 8,
    color: '#25292e',
  },
  disabledButton: {
    opacity: 0.6,
  },
});