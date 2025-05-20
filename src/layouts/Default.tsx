import { Header } from '@/components/layout/Header/Header';

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex h-screen flex-col">
      <Header />
      <main className="container mx-auto max-w-7xl grow px-6 pt-16">
        {children}
      </main>
    </div>
  );
}
