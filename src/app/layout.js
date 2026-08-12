import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Tricolor Challenge | STEM Robotics",
  description: "Join the STEM Robotics Tricolor Challenge and win a Drone!",
};

export default function RootLayout({ children }) {
  return (
    // Add suppressHydrationWarning here to stop extension errors!
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}