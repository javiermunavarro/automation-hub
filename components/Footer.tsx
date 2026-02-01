"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t bg-black">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <span className="text-[20px] font-extrabold tracking-tight text-white">
            merai
          </span>
          <nav className="flex items-center gap-6">
            <Link href="/about" className="text-sm text-gray-400 transition-colors hover:text-white">
              {t.footer.about}
            </Link>
            <Link href="/blog" className="text-sm text-gray-400 transition-colors hover:text-white">
              {t.footer.blog}
            </Link>
            <Link href="/support" className="text-sm text-gray-400 transition-colors hover:text-white">
              {t.footer.support}
            </Link>
            <Link href="/terms" className="text-sm text-gray-400 transition-colors hover:text-white">
              {t.footer.terms}
            </Link>
          </nav>
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} merai. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
