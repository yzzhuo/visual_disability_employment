import './globals.css'

export const metadata = {
  title: 'Visual Analytics of Employment of People with Disabilities',
  description: 'Disability inclusion in employment is a global challenge.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className='w-full overflow-x-hidden'>{children}</body>
    </html >
  )
}
