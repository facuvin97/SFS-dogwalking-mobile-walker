import { ScrollView, Text, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { Screen } from "../Screen";
import { TurnCard } from "../cards/TurnCard";
import { useTurns } from "../../contexts/TurnsContext";

export default function TurnListComponent() {
  const [loading, setLoading] = useState(true);
  const { turns, fetchTurns, cargado } = useTurns();

  useEffect(() => {
    const fetchTurn = async () => {
      await fetchTurns();
      setLoading(false);
    };

    if (!cargado) {
      fetchTurn();
    } else {
      setLoading(false);
    }
  }, [fetchTurns, cargado, turns]);

  if (loading) {
    return (
      <Screen>
        <ActivityIndicator />
      </Screen>
    );
  }

  return (
    <>
      {turns.length > 0 ? (
        turns.map((turn) => <TurnCard key={turn.id} turn={turn} />)
      ) : (
        <Text>No hay turnos</Text>
      )}
    </>
  );
}
