import "@styles/globals.css";
import AuthProvider from "@context/AuthProvider";

export const metadata = {
  title: "BlogoTypo",
  description: "Blogotypo is Blogging platform. Anyone from anywhere can create account and post their blogs for free.",
  icons: {
    icon: '/assets/icons/favicon.ico',
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="roboto_font bg-theme_1" cz-shortcut-listen="true">

        <AuthProvider>
          {children}
        </AuthProvider>

        <script src="https://kit.fontawesome.com/93f8c5dee5.js" crossOrigin="anonymous"></script>
      </body>
    </html>
  );
}
