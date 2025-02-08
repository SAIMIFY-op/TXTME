import "./globals.css"
import { Poppins } from "next/font/google"

const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
})

import type React from "react" // Import React

export const metadata = {
  title: "Message Form",
  description: "Send a message via WhatsApp",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={poppins.className}>{children}</body>
    </html>
  )
}

