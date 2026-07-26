import { lazy, Suspense } from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ScrollToTop from '@/components/ScrollToTop';
import LoadingScreen from '@/components/LoadingScreen';
import CustomCursor from '@/components/CustomCursor';

const About = lazy(() => import('@/components/About'));
const Realisations = lazy(() => import('@/components/Realisations'));
const Gallery = lazy(() => import('@/components/Gallery'));
const Contact = lazy(() => import('@/components/Contact'));
const Footer = lazy(() => import('@/components/Footer'));

function SectionLoader() {
  return (
    <div className="flex items-center justify-center py-32">
      <div className="w-8 h-8 rounded-full border-2 border-sky-400/30 border-t-sky-400 animate-spin" />
    </div>
  );
}

function AppContent() {
  return (
    <div className="min-h-screen bg-white dark:bg-navy-900 antialiased">
      <CustomCursor />
      <LoadingScreen />
      <Navbar />
      <main>
        <Hero />
        <Suspense fallback={<SectionLoader />}>
          <About />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <Realisations />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <Gallery />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <Contact />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
      <ScrollToTop />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
