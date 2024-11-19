import { Text, View, StyleSheet } from "react-native";
import { Stack, Slot } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function Layout({ children }) {
  return (
    <>
      <StatusBar style="auto" />
      <View style={styles.container}>
        <Stack
          screenOptions={{
            headerTitle: "",
          }}
        />
        {children}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
});
