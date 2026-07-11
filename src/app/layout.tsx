import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Shuv Marg - Nepal's Trusted Travel Network",
  description: "Book Bus Tickets Across Nepal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-[var(--color-cream-50)] text-[var(--color-neutral-900)] font-sans relative">
        {/* Global Texture Overlay */}
        <div 
          className="fixed inset-0 opacity-[0.05] pointer-events-none mix-blend-multiply -z-50" 
          style={{ backgroundImage: "url('/images/image.png')" }} 
        />
        {children}
      </body>
    </html>
  );
}
