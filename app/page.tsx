import Nav from '@/components/Nav';
import FilmRail from '@/components/FilmRail';
import Hero from '@/components/sections/Hero';
import Splash from '@/components/sections/Splash';
import TheFive from '@/components/sections/TheFive';
import Proof from '@/components/sections/Proof';
import Inside from '@/components/sections/Inside';
import Yubase from '@/components/sections/Yubase';
import Vhvi from '@/components/sections/Vhvi';
import Products from '@/components/sections/Products';
import Transmission from '@/components/sections/Transmission';
import Distribution from '@/components/sections/Distribution';
import Enquire from '@/components/sections/Enquire';
import Footer from '@/components/sections/Footer';

export default function Page() {
  return (
    <>
      <Nav />
      <FilmRail />
      <main id="main">
        {/* Opening sequence: one becomes five */}
        <Hero />
        <Splash />
        <TheFive />
        <Proof />

        {/* Chapters 01-06 */}
        <Inside />
        <Yubase />
        <Vhvi />
        <Products />
        <Transmission />
        <Distribution />

        <Enquire />
      </main>
      <Footer />
    </>
  );
}
