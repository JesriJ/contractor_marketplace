import { ComingSoon } from "@/components/ComingSoon";
import { requireSession } from "@/lib/session";

export default async function MessagesPage() {
  await requireSession();

  return (
    <ComingSoon
      title="Messages"
      description="Messaging will be available after customers and contractors can start jobs together."
    />
  );
}
