import { Vote } from 'lucide-react';

export function AppLogo() {
  return (
    <div className="flex items-center gap-2 p-2">
      <Vote className="h-8 w-8 text-primary" />
      <div className="flex flex-col">
        <span className="font-bold text-lg group-data-[collapsible=icon]:hidden">
          E-Voting
        </span>
        <span className="text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
          Platform
        </span>
      </div>
    </div>
  );
}
