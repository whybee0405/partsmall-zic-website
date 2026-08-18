import Nav from '@/components/Nav';
import Cursor from '@/components/Cursor';
import FilmRail from '@/components/FilmRail';
import BackToTop from '@/components/BackToTop';
import OpeningSequence from '@/components/sections/OpeningSequence';
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
      <Cursor />
      <Nav />
      <FilmRail />
      <BackToTop />
      <main id="main">
        {/* Opening sequence: one becomes five, pinned and scrubbed */}
        <OpeningSequence />
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
