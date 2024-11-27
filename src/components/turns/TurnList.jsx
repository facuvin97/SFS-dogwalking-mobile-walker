import { ScrollView, Text } from "react-native";
import { Screen } from "../Screen";
import { TurnCard } from "../cards/TurnCard";

export default function TurnListComponent({ turns }) {
  return (
    <>
      {turns.map((turn) => (
        <TurnCard key={turn.id} turn={turn} />
      ))}
    </>
  );
}
