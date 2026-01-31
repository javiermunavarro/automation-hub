import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <span className="text-lg font-semibold text-gray-900">merAI</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/about" className="text-sm text-gray-500 transition-colors hover:text-gray-900">
              About
            </Link>
            <Link href="/blog" className="text-sm text-gray-500 transition-colors hover:text-gray-900">
              Blog
            </Link>
            <Link href="/support" className="text-sm text-gray-500 transition-colors hover:text-gray-900">
              Support
            </Link>
            <Link href="/terms" className="text-sm text-gray-500 transition-colors hover:text-gray-900">
              Terms
            </Link>
          </nav>
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} merAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
