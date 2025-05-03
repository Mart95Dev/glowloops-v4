export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="bg-white py-6 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">GlowLoops V3</h1>
            <nav>
              <ul className="flex space-x-4">
                <li>
                  <a 
                    href="/test-firebase" 
                    className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                  >
                    Test Firebase
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <main className="py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-8">Bienvenue sur GlowLoops V3</h2>
          <p className="text-gray-600 mb-6">Notre plateforme de bijoux est en cours de développement.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Nouveautés</h3>
              <p className="text-gray-500">Découvrez nos dernières créations.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Collections</h3>
              <p className="text-gray-500">Explorez nos collections uniques.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Personnalisation</h3>
              <p className="text-gray-500">Créez des bijoux selon vos goûts.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-100 py-6">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 GlowLoops - Projet de test avec Firebase</p>
        </div>
      </footer>
    </div>
  );
}
