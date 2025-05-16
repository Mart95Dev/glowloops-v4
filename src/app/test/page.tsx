'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TestPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/debug');
  }, [router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-lilas-fonce mb-4"></div>
        <p>Redirection vers la page de débogage...</p>
      </div>
    </div>
  );
} 