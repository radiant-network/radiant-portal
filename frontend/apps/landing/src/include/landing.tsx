import Container from '@/components/base/container';

import DataRelease from './sections/data-release';
import Demographics from './sections/demographics';
import Documentation from './sections/documentation';
import Footer from './sections/footer';
import Hero from './sections/hero';
import Studies from './sections/studies';
import Tiles from './sections/tiles';

/**
 * INCLUDE Data Hub landing page (SJRA-1607).
 */
export default function Landing() {
  return (
    <main className="bg-muted h-screen w-full overflow-y-auto overflow-x-hidden">
      <Hero />

      {/* Body sections (centered) */}
      <Container className="max-w-7xl space-y-8 px-4 py-12 sm:px-6 lg:space-y-12">
        <Studies />
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <Demographics />
          <DataRelease />
        </div>
        <Tiles />
        <Documentation />
      </Container>

      <Footer />
    </main>
  );
}
