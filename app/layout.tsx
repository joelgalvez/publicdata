import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Public Data for Public Events',
  description: '',
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>

        {/* <main className="fixed top-[50vh] h-screen w-full overflow-y-scroll bg-black">
            {result}
          </main> */}
        <div>{children}</div>


      </body>
    </html>
  )
}
