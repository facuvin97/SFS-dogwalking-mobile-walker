import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import { useServices } from "../../src/contexts/ServicesContext";
import ServiceListComponent from "../../src/components/services/ServiceList";
import { Screen } from "../../src/components/Screen";

export default function ServiceRequests() {
  const { servicesRequest, fetchNextServices } = useServices();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      await fetchNextServices();
    };

    if (servicesRequest === null) {
      fetchServices();
    }
    setLoading(false);
  }, [servicesRequest, fetchNextServices]);

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
        {servicesRequest && servicesRequest.length > 0 ? (
          <ServiceListComponent services={servicesRequest} />
        ) : (
          <Text>No hay solicitudes de servicio</Text>
        )}
      </Screen>
    </ScrollView>
  );
}