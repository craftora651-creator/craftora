// app/page.tsx (Ana sayfa)
import Header from '../.meteor/Header';
import Hero from '../.meteor/Hero';
import Categories from '../.meteor/Categories'
import Featured from '../.meteor/Featured'; // ✅ YENİ!
import Deal from '../.meteor/Deal';
import StoreProducts from '../.meteor/StoreProducts'; // ✅ YENİ!
import Benefits from '../.meteor/Benefits';
import Testimonials from '../.meteor/Testimonials';
import Footer from "../.meteor/Footer";
export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Categories />
      <Featured />
      <Deal />
      <StoreProducts />
      <Benefits />
      <Testimonials />
      <Footer />
    </main>
  );
}