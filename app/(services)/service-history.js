import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import { useServices } from "../../src/contexts/ServicesContext";
import ServiceListComponent from "../../src/components/services/ServiceList";
import { Screen } from "../../src/components/Screen";

export default function ServiceRequests() {
  const { servicesHistory, fetchFinishedServices } = useServices();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      await fetchFinishedServices();
    };

    if (servicesHistory === null) {
      fetchServices();
    }
    setLoading(false);
  }, [servicesHistory, fetchFinishedServices]);

  if (loading) {
    return (
      <Screen>
        <ActivityIndicator />
      </Screen>
    );
  }

  return (
    <ScrollView>
      <Screen>
        {servicesHistory && servicesHistory.length > 0 ? (
          <ServiceListComponent services={servicesHistory} />
        ) : (
          <Text>No hay servicios en el historial</Text>
        )}
      </Screen>
    </ScrollView>
  );
}
