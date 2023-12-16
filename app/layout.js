import './globals.css'

export const metadata = {
  title: 'Visual Analytics of Car Data',
  description: 'COMP5048',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className='w-full overflow-x-hidden'>{children}</body>
    </html >
  )
}
