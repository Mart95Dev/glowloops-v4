import CartTest from '@/components/test/CartTest';

export default function TestCartPage() {
  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-lilas-fonce mb-8 text-center">
          Page de Test du Panier
        </h1>
        
        <CartTest />
      </div>
    </div>
  );
} 