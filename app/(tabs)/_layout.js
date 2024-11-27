import { Tabs } from "expo-router";

import { useEffect } from "react";
import { check } from "prettier";
import { AntDesign } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "lightblue" },
        tabBarActiveTintColor: "black",
      }}
    >
      <Tabs.Screen
        name="mainPage"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <AntDesign name="home" size={24} color="#000" />
          ),
        }}
      />
      <Tabs.Screen
        name="service-requests"
        options={{
          title: "Solicitudes",
          tabBarIcon: ({ color }) => (
            <AntDesign name="book" size={24} color="#000" />
          ),
        }}
      />
      <Tabs.Screen
        name="service-list"
        options={{
          title: "Servicios",
          tabBarIcon: ({ color }) => (
            <AntDesign name="profile" size={24} color="#000" />
          ),
        }}
      />
      <Tabs.Screen
        name="turn-list"
        options={{
          title: "Turnos",
          tabBarIcon: ({ color }) => (
            <AntDesign name="calendar" size={24} color="#000" />
          ),
        }}
      />
    </Tabs>
  );
}