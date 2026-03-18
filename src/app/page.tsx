import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { BestSellers } from '@/components/BestSellers';
import { Collections } from '@/components/Collections';
import { FeaturedReviews } from '@/components/FeaturedReviews';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <BestSellers />
      <Collections />
      <FeaturedReviews />
      <Footer />
    </main>
  );
}
