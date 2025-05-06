import Link from 'next/link';

export const Logo = () => {
  return (
    <div className="flex-shrink-0 pl-2 md:pl-4">
      <Link href="/" className="text-2xl md:text-3xl font-bold font-display" aria-label="GlowLoops - Accueil">
        <span className="text-black">Glow</span>
        <span className="text-lilas-fonce">Loops</span>
      </Link>
    </div>
  );
};

export default Logo;
