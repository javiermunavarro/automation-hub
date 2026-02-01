"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut, User, Bell, Search, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import SearchModal from "@/components/SearchModal";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const placeholderNotifications = [
  { id: 1, text: "Your automation 'AI Email Writer' was approved!", time: "2h ago", unread: true },
  { id: 2, text: "New review on 'Lead Generator Pro'", time: "5h ago", unread: true },
  { id: 3, text: "Monthly revenue report is ready", time: "1d ago", unread: true },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { lang, t, toggleLang } = useLanguage();
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      setUser(user);
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        if (profile) setUserRole(profile.role);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "/" && !searchOpen && !menuOpen && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape" && menuOpen) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen, menuOpen]);

  // Lock body scroll when overlay is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
    router.refresh();
  };

  const displayName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "";

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/about", label: t.nav.about },
    { href: "/marketplace", label: t.nav.explore },
    { href: "/dashboard/seller", label: t.nav.sell },
    { href: "/dashboard/buyer", label: t.nav.mySubscriptions },
    ...(userRole === "admin"
      ? [{ href: "/dashboard/admin", label: t.nav.admin }]
      : []),
  ];

  const notifCount = 3;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-gray-200/80 glass">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: hamburger + logo */}
          <div className="flex items-center gap-3">
            {/* Hamburger menu trigger */}
            <button
              onClick={() => setMenuOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-black transition-colors hover:bg-gray-100"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Logo - marketfeed style */}
            <Link href="/" className="flex items-center">
              <span className="text-[22px] font-extrabold tracking-tight text-black" style={{ fontFamily: "var(--font-inter), system-ui, -apple-system, sans-serif" }}>
                merai
              </span>
            </Link>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2">
            {/* Search trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-400 transition-colors hover:border-gray-300 hover:bg-gray-100 md:flex"
            >
              <Search className="h-4 w-4" />
              <span className="hidden lg:inline">{t.nav.searchPlaceholder}</span>
            </button>

            {/* Mobile search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-50 md:hidden"
            >
              <Search className="h-5 w-5" />
            </button>

            {loading ? (
              <div className="h-8 w-20 animate-pulse rounded bg-gray-100" />
            ) : user ? (
              <>
                {/* Become a Seller */}
                {userRole === "buyer" && (
                  <Link href="/dashboard/seller" className="hidden md:block">
                    <Button
                      size="sm"
                      className="bg-black text-white text-xs font-semibold hover:bg-gray-800"
                    >
                      {t.nav.becomeSeller}
                    </Button>
                  </Link>
                )}

                {/* Notification Bell */}
                <div ref={notifRef} className="relative">
                  <button
                    onClick={() => setNotifOpen(!notifOpen)}
                    className="relative rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-black"
                  >
                    <Bell className="h-5 w-5" />
                    {notifCount > 0 && (
                      <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
                        {notifCount}
                      </span>
                    )}
                  </button>

                  {/* Notification dropdown */}
                  {notifOpen && (
                    <div className="absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                      <div className="border-b px-4 py-3">
                        <h3 className="font-semibold text-black text-sm">{t.nav.notifications}</h3>
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        {placeholderNotifications.map((n) => (
                          <div
                            key={n.id}
                            className={`flex gap-3 px-4 py-3 transition-colors hover:bg-gray-50 ${
                              n.unread ? "bg-gray-50/50" : ""
                            }`}
                          >
                            <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                              <Bell className="h-4 w-4 text-gray-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm text-gray-700">{n.text}</p>
                              <p className="mt-0.5 text-xs text-gray-400">{n.time}</p>
                            </div>
                            {n.unread && (
                              <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-black" />
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="border-t px-4 py-2">
                        <button className="w-full text-center text-xs font-medium text-black hover:text-gray-600">
                          {t.nav.viewAllNotifications}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="hidden items-center gap-2 text-sm text-gray-600 md:flex">
                  <User className="h-4 w-4" />
                  <span className="max-w-[120px] truncate">{displayName}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="hidden transition-all duration-200 md:flex"
                >
                  <LogOut className="mr-1 h-4 w-4" />
                  {t.nav.logout}
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="hidden md:block">
                  <Button variant="ghost" size="sm" className="transition-all duration-200">
                    {t.nav.login}
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button
                    size="sm"
                    className="bg-black text-white transition-all duration-200 hover:bg-gray-800"
                  >
                    {t.nav.signup}
                  </Button>
                </Link>
              </>
            )}

            {/* Language toggle */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50 hover:text-black"
            >
              <Globe className="h-3.5 w-3.5" />
              {lang}
            </button>
          </div>
        </div>
      </nav>

      {/* Full-screen navigation overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-[200] bg-white">
          {/* Close button */}
          <div className="flex justify-end px-6 pt-5">
            <button
              onClick={() => setMenuOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-black"
              aria-label="Close menu"
            >
              <X className="h-7 w-7" />
            </button>
          </div>

          {/* Centered navigation links */}
          <div className="flex flex-col items-center justify-center gap-8 pt-12">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`text-2xl font-semibold transition-colors sm:text-3xl ${
                  isActive(link.href)
                    ? "text-black"
                    : "text-gray-400 hover:text-black"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Bottom auth actions (mobile) */}
          <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-4 px-6 md:hidden">
            {user ? (
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                {t.nav.logout}
              </Button>
            ) : (
              <Link href="/auth/login" onClick={() => setMenuOpen(false)}>
                <Button variant="outline" size="lg">
                  {t.nav.login}
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Search Modal */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
