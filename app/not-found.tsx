import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function NotFound() {
  return (
    <div className="shell">
      <Navbar />
      <main>
        <section className="not-found">
          <div className="not-found-code">404</div>
          <h1>Page not found</h1>
          <p>This page doesn&apos;t exist or was moved.</p>
          <div className="not-found-actions">
            <Link href="/" className="btn btn-primary">Go home</Link>
            <Link href="/play" className="btn btn-ghost">Play now</Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
