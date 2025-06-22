import React, { useEffect, useRef, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@heroui/react';

import { Header } from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const handleScroll = () => {
      setIsVisible(container.scrollTop > 300);
    };

    container.addEventListener('scroll', handleScroll);

    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex h-screen flex-col"
      style={{
        overflowY: 'scroll',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      <Header />
      <main className="container mx-auto max-w-7xl grow px-6 pt-16">
        {children}
      </main>
      <Button
        isIconOnly
        aria-label="to top"
        className={`fixed bottom-2 right-2 z-20 content-center items-center self-end border-2 border-secondary transition-opacity duration-300 ${
          isVisible ? 'flex' : 'pointer-events-none hidden'
        }`}
        color="default"
        variant="light"
        onClick={() => {
          containerRef.current?.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
        }}
      >
        <ArrowUp color="#aaa" strokeWidth={3} />
      </Button>
      <Footer />
    </div>
  );
}
