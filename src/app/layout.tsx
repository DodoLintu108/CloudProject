// src/app/layout.tsx
import './globals.css';
import AmplifyProvider from '@/components/AmplifyProvider';

export const metadata = {
  title: 'Task Manager',
  description: 'AWS-backed Task Management App',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AmplifyProvider>
          {children}
        </AmplifyProvider>
      </body>
    </html>
  );
}
