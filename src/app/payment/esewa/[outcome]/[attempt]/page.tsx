import { Suspense } from "react";
import EsewaResultClient from "./EsewaResultClient";

interface Props {
  params: Promise<{
    outcome: string;
    attempt: string;
  }>;
}

export default async function EsewaResultPage({ params }: Props) {
  const { outcome, attempt } = await params;
  return (
    <Suspense>
      <EsewaResultClient outcome={outcome} attempt={attempt} />
    </Suspense>
  );
}
