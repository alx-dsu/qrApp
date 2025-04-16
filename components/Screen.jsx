import { View } from "react-native";
import "../global.css"

export default function Screen({children}) {
return <View className="flex-1 bg-black pt-1 px-2">{children}</View>
}