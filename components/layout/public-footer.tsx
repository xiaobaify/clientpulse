import { Zap } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="border-t py-6">
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <div className="flex h-5 w-5 items-center justify-center rounded bg-primary/10">
          <Zap className="h-3 w-3 text-primary" />
        </div>
        <span>
          Powered by{" "}
          <span className="font-medium text-foreground/80">ClientPulse</span>
        </span>
      </div>
    </footer>
  );
}
