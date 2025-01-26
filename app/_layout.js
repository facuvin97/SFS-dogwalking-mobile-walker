import { Text, View, StyleSheet, Alert } from "react-native";
import * as Linking from "expo-linking";
import { Stack, Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { UserLogProvider } from "../src/contexts/UserLogContext";
import { TurnsProvider } from "../src/contexts/TurnsContext";
import { ServicesProvider } from "../src/contexts/ServicesContext";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import { WebSocketProvider } from "../src/contexts/WebSocketContext";
import { ChatsProvider } from "../src/contexts/ChatContext";
import { NotificationsProvider } from "../src/contexts/NotificationsContext";
import Notifications from "../src/components/Notifications";
import { Provider as PaperProvider } from 'react-native-paper';
import ChatList from "../src/components/ChatList";

export default function Layout() {
  const router = useRouter();

  useEffect(() => {
    // Función para manejar el deep link cuando la app ya está corriendo
    const handleDeepLink = (event) => {
      const url = event.url;
      console.log("Deep link recibido:", url);

      // Aquí extraes la ruta de la URL
      const path = url.replace("SFS-dogwalking://", "");

      // Realizas la navegación a la ruta correspondiente
      router.push(`/${path}`);
    };

    // Primero, maneja la URL inicial si la app se abrió desde un deep link
    const checkInitialUrl = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        console.log("URL inicial:", initialUrl);

        // Extracción de la parte relevante de la URL (en este caso, 'service/1')
        const path = initialUrl.replace("SFS-dogwalking://", "");

        // Realizar la navegación hacia esa ruta
        router.push(`/${path}`);
      }
    };

    // Llamar a la función para verificar la URL inicial
    checkInitialUrl();

    // Registrar el listener de deep link
    const subscription = Linking.addEventListener("url", handleDeepLink);

    // Limpiar el listener cuando el componente se desmonte
    return () => {
      subscription.remove();
    };
  }, [router]);

  return (
    <>
      <StatusBar style="auto" />
      <View style={styles.container}>
        <SafeAreaProvider>
          <PaperProvider>
            <UserLogProvider>
              <WebSocketProvider>
                <ChatsProvider>
                  <NotificationsProvider> 
                    <TurnsProvider>
                      <ServicesProvider>
                        <Stack
                          screenOptions={{
                            headerRight: () => (
                              <View style={{ flexDirection: "row", alignItems: "flex-end",  gap: 0 }}>
                                <ChatList style={{ pading: 10}} />
                                <Notifications style={{ pading: 10}} />
                              </View>
                            ),
                            headerTitle: "",
                          }}
                        >
                          <Stack.Screen
                            name="chat/[clientId]"
                            options={{
                              headerRight: () => null,
                            }}
                          />
                        </Stack>
                      </ServicesProvider>
                    </TurnsProvider>
                  </NotificationsProvider>
                </ChatsProvider>
              </WebSocketProvider>
            </UserLogProvider>
          </PaperProvider>
        </SafeAreaProvider>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
