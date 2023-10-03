import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Public Data for Public Events',
  description: '',
}

export default function RootLayout({
  children,
  filter,
  event,
  subscribe
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>

        <div className="grid grid-cols-[18rem,1fr]">

          <div className=''>{filter}</div>
          <div className=''>{children}</div>
          <div className=''>{event}</div>
          <div className='subscribe '>{subscribe}</div>
        </div>
        {/* <main className="fixed top-[50vh] h-screen w-full overflow-y-scroll bg-black">
            {result}
          </main> */}


      </body>
    </html>
  )
}
