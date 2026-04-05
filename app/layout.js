import "./globals.css";

export const metadata = {
  title: "SlapCart — Rent-a-Tailgate | LSU Game Day",
  description: "Book your premium tailgate setup delivered to your spot near Tiger Stadium.",
};

export const viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}
