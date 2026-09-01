import './globals.css';

export const metadata = {
  title: 'Remote Data Optimization Assistant — Apply Now',
  description:
    'Join a flexible remote role as a Remote Data Optimization Assistant. Complete a short guided conversation to get started.',
  openGraph: {
    title: 'Remote Data Optimization Assistant — Apply Now',
    description:
      'Flexible remote work. Guided onboarding. $15 joining reward for eligible participants.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
