import { AddReviewForm } from "../../../src/components/reviews/AddReview";
import { Screen } from "../../../src/components/Screen";
import { useLocalSearchParams } from "expo-router";

export default function AddReviewPage() {
  const { serviceId } = useLocalSearchParams();
  return (
    <Screen>
      <AddReviewForm serviceId={serviceId} />
    </Screen>
  );
}
