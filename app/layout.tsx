"use client";

import "./globals.css";
import { ThemeProvider, useTheme } from "next-themes";
import { useState, useEffect } from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Notes App</title>
        <meta name="description" content="A beautiful notes application with dark mode support" />
      </head>
      <body className="bg-gray-100 dark:bg-[#0f0f11] text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <nav className="w-full backdrop-blur-lg bg-white/60 dark:bg-black/40 shadow-sm border-b border-white/20 dark:border-white/10 px-6 py-4 flex justify-between items-center sticky top-0 z-20">
            <div className="text-xl font-semibold">📝 Notes App</div>
            <ThemeSwitcher />
          </nav>
          <main className="p-6">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}

function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <select
      className="px-3 py-1 rounded-lg bg-white/70 dark:bg-black/30 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      value={theme}
      onChange={(e) => setTheme(e.target.value)}
    >
      <option value="system">System</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  );
}
