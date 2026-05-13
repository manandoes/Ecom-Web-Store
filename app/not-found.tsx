import Link from "next/link";
import { Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-8xl font-serif text-amber-500 mb-4">404</h1>
      <h2 className="text-2xl font-medium mb-6">Page Not Found</h2>
      <p className="text-[#8b8b8b] max-w-md mb-8">
        We couldn't find the page you were looking for. It might have been removed, renamed, or doesn't exist.
      </p>
      <div className="flex items-center gap-4">
        <Link 
          href="/"
          className="h-12 px-6 rounded-full bg-amber-500 text-black font-medium flex items-center justify-center hover:bg-amber-400 transition-colors"
        >
          Return Home
        </Link>
        <Link 
          href="/candles"
          className="h-12 px-6 rounded-full border border-[#2a2a2e] text-white font-medium flex items-center justify-center hover:bg-[#1a1a1e] transition-colors gap-2"
        >
          <Search className="w-4 h-4" />
          Shop Candles
        </Link>
      </div>
    </div>
  );
}
