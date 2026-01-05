import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Collections } from '@/components/Collections';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Collections />
      <Footer />
    </main>
  );
}
