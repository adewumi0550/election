import Link from "next/link";
import { Vote } from "lucide-react";

export default function Header() {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center shadow-md">
      <Link href="/" className="flex items-center justify-center">
        <Vote className="h-6 w-6" />
        <span className="sr-only">Election Platform</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Link className="text-sm font-medium hover:underline underline-offset-4" href="/vote">
          Vote
        </Link>
        <Link className="text-sm font-medium hover:underline underline-offset-4" href="/results">
          Results
        </Link>
        <Link className="text-sm font-medium hover:underline underline-offset-4" href="/admin">
          Admin
        </Link>
      </nav>
    </header>
  );
}
