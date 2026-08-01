import { PageTransition } from "@/components/layout/PageTransition";
import { PageHeader } from "@/components/ui/PageHeader";
import { Compass } from "lucide-react";

export default function DiscoverPage() {
  return (
    <PageTransition>
      <PageHeader title="Discover" subtitle="People worth remembering — quiet inspiration" />
      <div className="paper overflow-hidden p-0">
        <img
          src="/journey-photo.png"
          alt="A journey through quiet places"
          className="h-48 w-full object-cover"
        />
      </div>
      <div className="paper flex flex-col items-center gap-4 px-8 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-card-soft text-text-muted">
          <Compass size={28} strokeWidth={1.4} />
        </div>
        <h3 className="text-section">Soon</h3>
        <p className="editorial max-w-[40ch] text-[15px]">
          Discoveries will gather here — creators, missionaries, writers, and
          artists worth remembering. A quiet collection, still being kept.
        </p>
      </div>
    </PageTransition>
  );
}