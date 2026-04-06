import "./globals.css";
import Script from "next/script";

export const metadata = {
  title: "SlapCart — Rent-a-Tailgate | LSU Game Day",
  description: "Book your premium tailgate setup delivered to your spot near Tiger Stadium.",
};

export const viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans">
        {children}
        {/* Tawk.to live chat widget */}
        <Script
          id="tawk-to"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
              (function(){
                var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
                s1.async=true;
                s1.src='https://embed.tawk.to/69d2fb16b137951c367ff499/1jlg29k8o';
                s1.charset='UTF-8';
                s1.setAttribute('crossorigin','*');
                s0.parentNode.insertBefore(s1,s0);
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
