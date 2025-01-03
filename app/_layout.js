import { Text, View, StyleSheet } from "react-native";
import { Stack, Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { UserLogProvider } from "../src/contexts/UserLogContext";
import { TurnsProvider } from "../src/contexts/TurnsContext";
import { ServicesProvider } from "../src/contexts/ServicesContext";
import { StatusBar } from "expo-status-bar";

export default function Layout() {
  return (
    <>
      <StatusBar style="auto" />
      <View style={styles.container}>
        <SafeAreaProvider>
          <UserLogProvider>
            <TurnsProvider>
              <ServicesProvider>
                <Stack
                  screenOptions={{
                    headerTitle: "",
                  }}                  
                  > <Slot />
                </Stack>
              </ServicesProvider>
            </TurnsProvider>
          </UserLogProvider>
        </SafeAreaProvider>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
});
