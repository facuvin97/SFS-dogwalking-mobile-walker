import { Text, TouchableOpacity } from "react-native";
import { Screen } from "./Screen";
import { removeToken } from "../utils/authStorage";

export function Main() {
  const handleLogout = async () => {
    await removeToken();
  };

  return (
    <Screen>
      <Text>Main</Text>
      <TouchableOpacity onPress={handleLogout}>
        <Text>Remove token</Text>
      </TouchableOpacity>
    </Screen>
  );
}
