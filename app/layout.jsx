"use client";
import "./globals.css";
import { useState } from "react";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

const metadata = {
  title: "NeoFairs",
  description: "Lorem Ipsum dolor unit.",
};

export default function RootLayout({ children }) {
  const [showNav, setShowNav] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const parts = pathname.split("/");
    if (parts[1] == "visitors" || parts[1] == "neofairs-lite") {
      setShowNav(false);
    }
  }, [pathname]);
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
