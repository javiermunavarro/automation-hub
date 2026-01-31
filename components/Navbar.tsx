"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Sparkles, Menu, X, LogOut, User, Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import SearchModal from "@/components/SearchModal";

const baseNavLinks = [
  { href: "/marketplace", label: "Marketplace" },
  { href: "/dashboard/seller", label: "Sell" },
  { href: "/dashboard/buyer", label: "My Subscriptions" },
];

const placeholderNotifications = [
  { id: 1, text: "Your automation 'AI Email Writer' was approved!", time: "2h ago", unread: true },
  { id: 2, text: "New review on 'Lead Generator Pro'", time: "5h ago", unread: true },
  { id: 3, text: "Monthly revenue report is ready", time: "1d ago", unread: true },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
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
      if (e.key === "/" && !searchOpen && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen]);

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
    ...baseNavLinks,
    ...(userRole === "admin"
      ? [{ href: "/dashboard/admin", label: "Admin" }]
      : []),
  ];

  const notifCount = 3;

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-white/20 glass">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-semibold text-gray-900">merAI</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  pathname.startsWith(link.href)
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop auth + actions */}
          <div className="hidden items-center gap-2 md:flex">
            {/* Search trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-400 transition-colors hover:border-gray-300 hover:bg-gray-100"
            >
              <Search className="h-4 w-4" />
              <span className="hidden lg:inline">Press / to search</span>
            </button>

            {loading ? (
              <div className="h-8 w-20 animate-pulse rounded bg-gray-100" />
            ) : user ? (
              <>
                {/* Become a Seller */}
                {userRole === "buyer" && (
                  <Link href="/dashboard/seller">
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold hover:from-blue-700 hover:to-purple-700"
                    >
                      Become a Seller
                    </Button>
                  </Link>
                )}

                {/* Notification Bell */}
                <div ref={notifRef} className="relative">
                  <button
                    onClick={() => setNotifOpen(!notifOpen)}
                    className="relative rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
                  >
                    <Bell className="h-5 w-5" />
                    {notifCount > 0 && (
                      <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                        {notifCount}
                      </span>
                    )}
                  </button>

                  {/* Notification dropdown */}
                  {notifOpen && (
                    <div className="absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                      <div className="border-b px-4 py-3">
                        <h3 className="font-semibold text-gray-900 text-sm">Notifications</h3>
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        {placeholderNotifications.map((n) => (
                          <div
                            key={n.id}
                            className={`flex gap-3 px-4 py-3 transition-colors hover:bg-gray-50 ${
                              n.unread ? "bg-blue-50/50" : ""
                            }`}
                          >
                            <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                              <Bell className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm text-gray-700">{n.text}</p>
                              <p className="mt-0.5 text-xs text-gray-400">{n.time}</p>
                            </div>
                            {n.unread && (
                              <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-600" />
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="border-t px-4 py-2">
                        <button className="w-full text-center text-xs font-medium text-blue-600 hover:text-blue-700">
                          View all notifications
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span className="max-w-[120px] truncate">{displayName}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="transition-all duration-200"
                >
                  <LogOut className="mr-1 h-4 w-4" />
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className="transition-all duration-200">
                    Log in
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button
                    size="sm"
                    className="gradient-primary text-white transition-all duration-200 hover:opacity-90"
                  >
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setSearchOpen(true)}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-50"
            >
              <Search className="h-5 w-5" />
            </button>
            {user && (
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-50"
              >
                <Bell className="h-5 w-5" />
                {notifCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {notifCount}
                  </span>
                )}
              </button>
            )}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="border-t border-gray-100 bg-white px-4 pb-4 pt-2 md:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  pathname.startsWith(link.href)
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user && userRole === "buyer" && (
              <Link
                href="/dashboard/seller"
                onClick={() => setMobileOpen(false)}
                className="mt-2 block"
              >
                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold"
                >
                  Become a Seller
                </Button>
              </Link>
            )}
            <div className="mt-3 flex gap-2">
              {user ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                >
                  <LogOut className="mr-1 h-4 w-4" />
                  Log out ({displayName})
                </Button>
              ) : (
                <>
                  <Link href="/auth/login" className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/auth/register" className="flex-1">
                    <Button
                      size="sm"
                      className="w-full gradient-primary text-white"
                    >
                      Sign up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Search Modal */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
