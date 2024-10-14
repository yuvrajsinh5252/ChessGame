import { OnlineBoard } from "@/Components/online-mode/onlineboard";

interface PageProps {
  params: {
    roomId: string;
  };
}

export default function Page({ params }: PageProps) {
  const { roomId } = params;

  return <OnlineBoard />;
}
