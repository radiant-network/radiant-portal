import type { CSSProperties } from 'react';

import Container from '@/components/base/container';

import AcceleratingResearch from './sections/accelerating-research';
import Collaboration from './sections/collaboration';
import Documentation from './sections/documentation';
import Footer from './sections/footer';
import Hero from './sections/hero';
import Studies from './sections/studies';

/**
 * Kids First brand palette, scoped to this landing's root so it resolves
 * in any build (e.g. the QA preview running THEME=radiant), independent of the active theme.
 */
const brandVars = {
  '--primary-gradient': '#2c3689',
  '--secondary-gradient-1': '#ec2786',
  '--secondary-gradient-2': '#b63e97',
  '--secondary-gradient-3': '#765aab',
  '--secondary-gradient-4': '#4371bc',
  '--secondary-gradient-5': '#1e81c8',
  '--secondary-gradient-6': '#088bcf',
  '--secondary-gradient-7': '#008fd2',
  '--magenta-7': '#bf267d',
  '--cyan-6': '#009bba',
  '--purple-6': '#a6278f',
} as CSSProperties;

export default function KidsFirstLanding() {
  return (
    <main className="bg-background h-screen w-full overflow-y-auto overflow-x-hidden" style={brandVars}>
      <Hero />

      <div className="bg-background">
        <Container className="max-w-8xl space-y-8 px-4 py-12 sm:px-6 lg:space-y-12">
          <Studies />
        </Container>
      </div>

      <AcceleratingResearch />

      <div className="bg-background">
        <Container className="max-w-8xl space-y-8 px-4 py-12 sm:px-6 lg:space-y-12">
          <Collaboration />
        </Container>
      </div>

      <Documentation />

      <Footer />
    </main>
  );
}
