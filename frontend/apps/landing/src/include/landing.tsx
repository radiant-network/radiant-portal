import Container from '@/components/base/container';

import DataRelease from './sections/data-release';
import Demographics from './sections/demographics';
import Documentation from './sections/documentation';
import Footer from './sections/footer';
import Hero from './sections/hero';
import Studies from './sections/studies';
import Tiles from './sections/tiles';

export default function Landing() {
  return (
    <main className="bg-background h-screen w-full overflow-y-auto overflow-x-hidden">
      <Hero />

      <div className="bg-muted">
        <Container className="max-w-7xl space-y-8 px-4 py-12 sm:px-6 lg:space-y-12">
          <Studies />
          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <Demographics />
            <DataRelease />
          </div>
        </Container>
      </div>

      <div className="bg-background">
        <Container className="max-w-7xl space-y-8 px-4 py-12 sm:px-6 lg:space-y-12">
          <Tiles />
          <Documentation />
        </Container>
      </div>

      <Footer />
    </main>
  );
}
