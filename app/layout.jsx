import './globals.css';

export const runtime = 'edge';

export const metadata = {
  title: 'Base Engineering | Scaffolding & Construction Solutions',
  description:
    'Base Engineering provides reliable scaffolding, shuttering and construction support products engineered for strength, durability and performance.',
  keywords: [
    'Base Engineering',
    'Scaffolding Jack',
    'Acrow Span',
    'Shuttering Plates',
    'Telescopic Props',
    'Adjustable Jack',
    'U Jack',
    'Base Jack',
    'Construction Support',
    'Industrial Manufacturing',
  ],
  authors: [{ name: 'Base Engineering' }],
  metadataBase: new URL('https://baseengineering.com'),
  openGraph: {
    title: 'Base Engineering | Scaffolding & Construction Solutions',
    description:
      'Reliable scaffolding, shuttering and construction support products engineered for strength, durability and performance.',
    siteName: 'Base Engineering',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body>{children}</body>
    </html>
  );
}
