export default function MentionsLegalesPage() {
  const lastUpdate = "15 juillet 2024";

  // Sections IDs pour le sommaire interactif
  const sections = [
    { id: "informations-legales", title: "Informations légales" },
    { id: "hebergement", title: "Hébergement" },
    { id: "propriete-intellectuelle", title: "Propriété intellectuelle" },
    { id: "donnees-personnelles", title: "Données personnelles" },
    { id: "cookies", title: "Cookies" },
    { id: "limitation-responsabilite", title: "Limitation de responsabilité" },
    { id: "liens-hypertextes", title: "Liens hypertextes" },
    { id: "droit-applicable", title: "Droit applicable" }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl md:text-3xl font-bold font-display text-lilas-fonce mb-6 text-center">
        Mentions Légales
      </h1>
      <p className="text-center text-gray-500 mb-6">Dernière mise à jour : {lastUpdate}</p>

      {/* Résumé introductif */}
      <div className="bg-lilas-clair/10 p-4 rounded-lg mb-8">
        <p className="text-gray-700">
          Ce document présente les informations légales obligatoires concernant notre société, notre site web et vos droits. Pour toute question, vous pouvez nous contacter à <a href="mailto:contact@glowloops.com" className="text-lilas-fonce underline">contact@glowloops.com</a>.
        </p>
      </div>

      {/* Sommaire interactif */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Sommaire</h2>
        <ul className="space-y-2">
          {sections.map((section) => (
            <li key={section.id}>
              <a 
                href={`#${section.id}`} 
                className="text-lilas-fonce hover:underline flex items-center"
              >
                <span className="mr-2">→</span>
                {section.title}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
        <section className="mb-8" id="informations-legales">
          <h2 className="text-xl font-semibold mb-4 text-lilas-fonce">1. Informations légales</h2>
          <p className="text-gray-700 mb-4">
            Le site www.glowloops.com est édité par :
          </p>
          <div className="pl-4 border-l-2 border-lilas-clair/50 mb-4">
            <p className="text-gray-700 mb-1">GlowLoops SAS</p>
            <p className="text-gray-700 mb-1">Capital social : 10 000 €</p>
            <p className="text-gray-700 mb-1">RCS Paris B 123 456 789</p>
            <p className="text-gray-700 mb-1">Siège social : 123 Avenue des Bijoux, 75001 Paris, France</p>
            <p className="text-gray-700 mb-1">N° TVA : FR 12 345 678 910</p>
            <p className="text-gray-700 mb-1">Directeur de la publication : Emma Dubois</p>
          </div>
          <p className="text-gray-700">
            Pour nous contacter : <a href="mailto:contact@glowloops.com" className="text-lilas-fonce hover:underline">contact@glowloops.com</a> ou au +33 (0)1 23 45 67 89 (du lundi au vendredi, de 9h à 18h).
          </p>
        </section>

        <section className="mb-8" id="hebergement">
          <h2 className="text-xl font-semibold mb-4 text-lilas-fonce">2. Hébergement</h2>
          <p className="text-gray-700 mb-4">
            Le site est hébergé par :
          </p>
          <div className="pl-4 border-l-2 border-lilas-clair/50">
            <p className="text-gray-700 mb-1">OVH SAS</p>
            <p className="text-gray-700 mb-1">2 rue Kellermann - 59100 Roubaix - France</p>
            <p className="text-gray-700 mb-1">
              <a href="https://www.ovh.com" target="_blank" rel="noopener noreferrer" className="text-lilas-fonce hover:underline">www.ovh.com</a>
            </p>
          </div>
        </section>

        <section className="mb-8" id="propriete-intellectuelle">
          <h2 className="text-xl font-semibold mb-4 text-lilas-fonce">3. Propriété intellectuelle</h2>
          <p className="text-gray-700 mb-4">
            L&apos;ensemble des éléments composant le site www.glowloops.com (textes, graphismes, logos, photographies, vidéos, sons, plans, noms, marques, etc.) sont la propriété exclusive de GlowLoops SAS ou de ses partenaires. Ces éléments sont protégés par les lois relatives à la propriété intellectuelle et notamment le droit d&apos;auteur.
          </p>
          <p className="text-gray-700 mb-4">
            Toute reproduction, représentation, modification, publication, adaptation ou exploitation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sans autorisation préalable écrite de GlowLoops SAS.
          </p>
          <p className="text-gray-700">
            L&apos;utilisation non autorisée de ces éléments engagerait votre responsabilité et constituerait une contrefaçon sanctionnée par les articles L.335-2 et suivants du Code de la Propriété Intellectuelle.
          </p>
        </section>

        <section className="mb-8" id="donnees-personnelles">
          <h2 className="text-xl font-semibold mb-4 text-lilas-fonce">4. Données personnelles</h2>
          <p className="text-gray-700 mb-4">
            Les informations concernant la collecte et le traitement des données personnelles sont détaillées dans notre <a href="/politique-de-confidentialite" className="text-lilas-fonce hover:underline">Politique de Confidentialité</a>.
          </p>
          <p className="text-gray-700">
            Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, vous disposez des droits suivants sur vos données :
          </p>
          <ul className="list-disc pl-6 text-gray-700 my-4 space-y-1">
            <li>Droit d'accès</li>
            <li>Droit de rectification</li>
            <li>Droit à l'effacement (« droit à l'oubli »)</li>
            <li>Droit à la limitation du traitement</li>
            <li>Droit à la portabilité</li>
            <li>Droit d'opposition</li>
          </ul>
          <p className="text-gray-700">
            Pour exercer ces droits ou pour toute question sur le traitement de vos données, vous pouvez nous contacter à <a href="mailto:privacy@glowloops.com" className="text-lilas-fonce hover:underline">privacy@glowloops.com</a>.
          </p>
        </section>

        <section className="mb-8" id="cookies">
          <h2 className="text-xl font-semibold mb-4 text-lilas-fonce">5. Cookies</h2>
          <p className="text-gray-700 mb-4">
            Le site www.glowloops.com utilise des cookies pour améliorer l&apos;expérience utilisateur et assurer certaines fonctionnalités.
          </p>
          <p className="text-gray-700">
            Pour en savoir plus sur l&apos;utilisation des cookies, veuillez consulter notre <a href="/politique-de-confidentialite#cookies" className="text-lilas-fonce hover:underline">Politique de Confidentialité</a>. Vous pouvez à tout moment paramétrer vos préférences en matière de cookies via notre <button className="text-lilas-fonce hover:underline font-normal">panneau de gestion des cookies</button>.
          </p>
        </section>

        <section className="mb-8" id="limitation-responsabilite">
          <h2 className="text-xl font-semibold mb-4 text-lilas-fonce">6. Limitation de responsabilité</h2>
          <p className="text-gray-700 mb-4">
            GlowLoops SAS s&apos;efforce d&apos;assurer au mieux de ses possibilités l&apos;exactitude et la mise à jour des informations diffusées sur son site, dont elle se réserve le droit de corriger, à tout moment et sans préavis, le contenu.
          </p>
          <p className="text-gray-700 mb-4">
            Cependant, GlowLoops SAS ne peut garantir l&apos;exactitude, la précision ou l&apos;exhaustivité des informations mises à disposition sur son site. En conséquence, GlowLoops SAS décline toute responsabilité :
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
            <li>Pour toute interruption du site</li>
            <li>Pour toute survenance de bugs</li>
            <li>Pour toute inexactitude ou omission dans les informations disponibles sur le site</li>
            <li>Pour tous dommages résultant d&apos;une intrusion frauduleuse d&apos;un tiers ayant entraîné une modification des informations mises à disposition sur le site</li>
            <li>Et plus généralement pour tous dommages, directs ou indirects, qu&apos;elles qu&apos;en soient les causes, origines, natures ou conséquences, provoqués à raison de l&apos;accès de quiconque au site ou de l&apos;impossibilité d&apos;y accéder</li>
          </ul>
          <p className="text-gray-700">
            En outre, GlowLoops SAS ne garantit pas que le site soit exempt de virus ou autres composants dangereux.
          </p>
        </section>

        <section className="mb-8" id="liens-hypertextes">
          <h2 className="text-xl font-semibold mb-4 text-lilas-fonce">7. Liens hypertextes</h2>
          <p className="text-gray-700 mb-4">
            Le site www.glowloops.com peut contenir des liens hypertextes vers d&apos;autres sites internet ou mobiles. GlowLoops SAS n&apos;exerce aucun contrôle sur ces sites et ne saurait être tenue responsable de leurs contenus, publicités, produits, services ou tout autre élément disponible sur ou à partir de ces sites.
          </p>
          <p className="text-gray-700">
            La mise en place de liens hypertextes pointant vers www.glowloops.com ne peut être faite qu&apos;avec l&apos;autorisation préalable et écrite de GlowLoops SAS.
          </p>
        </section>

        <section id="droit-applicable">
          <h2 className="text-xl font-semibold mb-4 text-lilas-fonce">8. Droit applicable et juridiction compétente</h2>
          <p className="text-gray-700 mb-4">
            Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents.
          </p>
          <p className="text-gray-700">
            Pour toute question relative à l&apos;application des présentes mentions légales, vous pouvez nous contacter à l&apos;adresse mentionnée ci-dessus.
          </p>
        </section>
      </div>

      {/* Bouton télécharger */}
      <div className="mt-8 text-center">
        <a 
          href="#" 
          className="inline-flex items-center px-6 py-3 border border-lilas-fonce text-lilas-fonce bg-white rounded-md hover:bg-lilas-clair/10 transition-colors"
          aria-label="Télécharger les mentions légales au format PDF"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Télécharger les mentions légales (PDF — 120 Ko)
        </a>
      </div>
    </div>
  );
} 