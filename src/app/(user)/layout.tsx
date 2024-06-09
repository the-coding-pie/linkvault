import type { Metadata } from "next";
import "../globals.css";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";

export const metadata: Metadata = {
  title: "Listed.sh",
  description: "Listed.sh",
};

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="flex-1 mt-[80px] container pb-28">{children}</main>
      <Footer />
    </>
  );
}
