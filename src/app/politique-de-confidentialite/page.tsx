export default function PrivacyPolicyPage() {
  const lastUpdate = "15 juillet 2024";

  // Sections IDs pour le sommaire interactif
  const sections = [
    { id: "introduction", title: "Introduction" },
    { id: "responsable", title: "Responsable du traitement" },
    { id: "donnees-collectees", title: "Données collectées" },
    { id: "finalites", title: "Finalités des traitements" },
    { id: "destinataires", title: "Destinataires des données" },
    { id: "duree-conservation", title: "Durée de conservation" },
    { id: "securite", title: "Sécurité des données" },
    { id: "cookies", title: "Cookies et technologies" },
    { id: "droits", title: "Vos droits" },
    { id: "transferts", title: "Transferts internationaux" },
    { id: "modifications", title: "Modifications de la politique" }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl md:text-3xl font-bold font-display text-lilas-fonce mb-6 text-center">
        Politique de Confidentialité
      </h1>
      <p className="text-center text-gray-500 mb-6">Dernière mise à jour : {lastUpdate}</p>

      {/* Résumé simplifié */}
      <div className="bg-lilas-clair/10 p-4 rounded-lg mb-8">
        <h2 className="text-lg font-semibold mb-2 text-lilas-fonce">En résumé</h2>
        <p className="text-gray-700 mb-3">
          Nous respectons votre vie privée et protégeons vos données conformément au RGPD. 
          Nous collectons uniquement les données nécessaires pour vous fournir nos services, 
          et vous disposez de droits que vous pouvez exercer à tout moment.
        </p>
        <p className="text-gray-700">
          Pour toute question concernant vos données, contactez-nous à <a href="mailto:privacy@glowloops.com" className="text-lilas-fonce underline">privacy@glowloops.com</a>.
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

      {/* Lexique */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold mb-3 text-gray-800">Lexique</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-700 mb-1"><strong>RGPD</strong> : Règlement Général sur la Protection des Données</p>
            <p className="text-gray-700 mb-1"><strong>Données personnelles</strong> : Toute information se rapportant à une personne identifiable</p>
            <p className="text-gray-700 mb-1"><strong>Traitement</strong> : Toute opération sur des données personnelles</p>
          </div>
          <div>
            <p className="text-gray-700 mb-1"><strong>Responsable de traitement</strong> : Entité qui détermine les finalités du traitement</p>
            <p className="text-gray-700 mb-1"><strong>Sous-traitant</strong> : Entité qui traite des données pour le compte du responsable</p>
            <p className="text-gray-700 mb-1"><strong>Cookies</strong> : Petits fichiers stockés sur votre appareil lors de la navigation</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
        <section className="mb-8" id="introduction">
          <h2 className="text-xl font-semibold mb-4 text-lilas-fonce">1. Introduction</h2>
          <p className="text-gray-700 mb-4">
            Chez GlowLoops, nous accordons une grande importance à la protection de votre vie privée. Cette politique de confidentialité vous informe de la manière dont nous recueillons, utilisons et protégeons vos données personnelles lorsque vous utilisez notre site web et nos services.
          </p>
          <p className="text-gray-700">
            En utilisant notre site www.glowloops.com, vous acceptez les pratiques décrites dans la présente politique de confidentialité. Celle-ci est conforme au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés.
          </p>
        </section>

        <section className="mb-8" id="responsable">
          <h2 className="text-xl font-semibold mb-4 text-lilas-fonce">2. Responsable du traitement</h2>
          <p className="text-gray-700 mb-4">
            Le responsable du traitement de vos données personnelles est GlowLoops, dont le siège social est situé au 123 Avenue des Bijoux, 75001 Paris, France.
          </p>
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
            <h3 className="font-medium text-gray-800 mb-2">Coordonnées du délégué à la protection des données (DPO)</h3>
            <p className="text-gray-700">Email : <a href="mailto:privacy@glowloops.com" className="text-lilas-fonce hover:underline">privacy@glowloops.com</a></p>
            <p className="text-gray-700">Adresse : GlowLoops - DPO, 123 Avenue des Bijoux, 75001 Paris</p>
          </div>
          <p className="text-gray-700">
            Pour toute question concernant la présente politique de confidentialité ou pour exercer vos droits, vous pouvez nous contacter aux coordonnées ci-dessus.
          </p>
        </section>

        <section className="mb-8" id="donnees-collectees">
          <h2 className="text-xl font-semibold mb-4 text-lilas-fonce">3. Données collectées</h2>
          <p className="text-gray-700 mb-4">
            Nous collectons différents types de données vous concernant. Le tableau ci-dessous détaille ces données, leur finalité, la base légale et leur durée de conservation.
          </p>
          
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-lilas-clair/20">
                  <th className="py-3 px-4 text-left border-b">Type de données</th>
                  <th className="py-3 px-4 text-left border-b">Finalité</th>
                  <th className="py-3 px-4 text-left border-b">Base légale</th>
                  <th className="py-3 px-4 text-left border-b">Durée de conservation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-3 px-4 border-b">Données d&apos;identification (nom, prénom, email)</td>
                  <td className="py-3 px-4 border-b">Gestion du compte client, commandes</td>
                  <td className="py-3 px-4 border-b">Contrat, Consentement</td>
                  <td className="py-3 px-4 border-b">3 ans après dernière activité</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-3 px-4 border-b">Adresse de livraison</td>
                  <td className="py-3 px-4 border-b">Livraison des commandes</td>
                  <td className="py-3 px-4 border-b">Contrat</td>
                  <td className="py-3 px-4 border-b">10 ans (obligation légale)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 border-b">Données de connexion (IP, cookies)</td>
                  <td className="py-3 px-4 border-b">Amélioration du site, statistiques</td>
                  <td className="py-3 px-4 border-b">Intérêt légitime, Consentement</td>
                  <td className="py-3 px-4 border-b">13 mois maximum</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-3 px-4 border-b">Historique d&apos;achat</td>
                  <td className="py-3 px-4 border-b">Service client, recommandations</td>
                  <td className="py-3 px-4 border-b">Intérêt légitime</td>
                  <td className="py-3 px-4 border-b">10 ans (obligation légale)</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <p className="text-gray-700">
            Ces données sont collectées lorsque vous créez un compte, effectuez un achat, vous inscrivez à notre newsletter, ou naviguez simplement sur notre site.
          </p>
        </section>

        <section className="mb-8" id="finalites">
          <h2 className="text-xl font-semibold mb-4 text-lilas-fonce">4. Finalités des traitements</h2>
          <p className="text-gray-700 mb-4">
            Nous utilisons vos données personnelles aux fins suivantes :
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
            <li>Traiter et livrer vos commandes</li>
            <li>Gérer votre compte client</li>
            <li>Vous informer sur nos produits et services (si vous avez accepté de recevoir nos communications)</li>
            <li>Améliorer notre site web et nos produits</li>
            <li>Prévenir la fraude</li>
            <li>Répondre à vos questions et demandes</li>
            <li>Respecter nos obligations légales et réglementaires</li>
          </ul>
          <p className="text-gray-700">
            Le traitement de vos données est nécessaire à l&apos;exécution du contrat que nous avons avec vous (lors d&apos;un achat), à la poursuite de nos intérêts légitimes (amélioration de nos services), au respect de nos obligations légales, ou est basé sur votre consentement (pour l&apos;envoi de newsletters par exemple).
          </p>
        </section>

        <section className="mb-8" id="destinataires">
          <h2 className="text-xl font-semibold mb-4 text-lilas-fonce">5. Destinataires de vos données</h2>
          <p className="text-gray-700 mb-4">
            Vos données personnelles peuvent être partagées avec :
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <h3 className="font-medium text-gray-800 mb-2">Destinataires internes</h3>
              <ul className="list-disc pl-5 text-gray-700">
                <li>Services client et marketing</li>
                <li>Service logistique</li>
                <li>Service informatique</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <h3 className="font-medium text-gray-800 mb-2">Destinataires externes</h3>
              <ul className="list-disc pl-5 text-gray-700">
                <li>Prestataires logistiques (livraison)</li>
                <li>Prestataires de paiement sécurisé</li>
                <li>Hébergeur web</li>
                <li>Autorités (sur demande légale)</li>
              </ul>
            </div>
          </div>
          <p className="text-gray-700">
            Nous nous assurons que tous nos partenaires et sous-traitants respectent les mêmes standards de protection des données que nous. Nous ne vendons jamais vos données personnelles à des tiers.
          </p>
        </section>

        <section className="mb-8" id="duree-conservation">
          <h2 className="text-xl font-semibold mb-4 text-lilas-fonce">6. Durée de conservation</h2>
          <p className="text-gray-700 mb-4">
            Nous conservons vos données personnelles uniquement pendant la durée nécessaire aux finalités pour lesquelles elles ont été collectées, dans le respect des délais légaux :
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
            <li>Données de compte client : tant que votre compte est actif, puis archivage pendant 3 ans après votre dernière activité</li>
            <li>Données de commande : 10 ans (obligation légale)</li>
            <li>Données de navigation : 13 mois maximum</li>
            <li>Données de prospection commerciale : 3 ans à compter du dernier contact</li>
          </ul>
          <p className="text-gray-700">
            À l&apos;issue de ces périodes, vos données sont soit supprimées, soit anonymisées pour des finalités statistiques.
          </p>
        </section>

        <section className="mb-8" id="securite">
          <h2 className="text-xl font-semibold mb-4 text-lilas-fonce">7. Sécurité des données</h2>
          <p className="text-gray-700 mb-4">
            Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données personnelles contre la perte, l&apos;accès non autorisé, la divulgation, l&apos;altération ou la destruction :
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
            <li>Utilisation du protocole HTTPS pour sécuriser les transferts de données</li>
            <li>Accès limité aux données personnelles</li>
            <li>Politique de mots de passe forts</li>
            <li>Mise à jour régulière de nos systèmes</li>
            <li>Sensibilisation de notre personnel à la sécurité des données</li>
          </ul>
          <div className="bg-lilas-clair/15 p-4 rounded-lg border-l-4 border-lilas-fonce my-4">
            <p className="text-gray-700">
              En cas de violation de données susceptible d&apos;engendrer un risque pour vos droits et libertés, nous nous engageons à vous en informer dans les meilleurs délais et à notifier l&apos;autorité de contrôle compétente.
            </p>
          </div>
        </section>

        <section className="mb-8" id="cookies">
          <h2 className="text-xl font-semibold mb-4 text-lilas-fonce">8. Cookies et technologies similaires</h2>
          <p className="text-gray-700 mb-4">
            Notre site utilise des cookies et technologies similaires pour améliorer votre expérience de navigation. Les cookies sont de petits fichiers texte stockés sur votre appareil qui nous permettent de reconnaître votre navigateur et de vous offrir certaines fonctionnalités.
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-lilas-clair/20">
                  <th className="py-3 px-4 text-left border-b">Type de cookies</th>
                  <th className="py-3 px-4 text-left border-b">Finalité</th>
                  <th className="py-3 px-4 text-left border-b">Durée</th>
                  <th className="py-3 px-4 text-left border-b">Base légale</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-3 px-4 border-b">Cookies essentiels</td>
                  <td className="py-3 px-4 border-b">Fonctionnement du site (panier, session)</td>
                  <td className="py-3 px-4 border-b">Session</td>
                  <td className="py-3 px-4 border-b">Intérêt légitime</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-3 px-4 border-b">Cookies fonctionnels</td>
                  <td className="py-3 px-4 border-b">Mémoriser vos préférences</td>
                  <td className="py-3 px-4 border-b">1 an</td>
                  <td className="py-3 px-4 border-b">Consentement</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 border-b">Cookies analytiques</td>
                  <td className="py-3 px-4 border-b">Analyse de l&apos;utilisation du site</td>
                  <td className="py-3 px-4 border-b">13 mois</td>
                  <td className="py-3 px-4 border-b">Consentement</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-3 px-4 border-b">Cookies marketing</td>
                  <td className="py-3 px-4 border-b">Publicités personnalisées</td>
                  <td className="py-3 px-4 border-b">13 mois</td>
                  <td className="py-3 px-4 border-b">Consentement</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-gray-700">
            Vous pouvez à tout moment modifier vos préférences en matière de cookies via notre <button className="text-lilas-fonce hover:underline font-normal">panneau de gestion des cookies</button>.
          </p>
        </section>

        <section className="mb-8" id="droits">
          <h2 className="text-xl font-semibold mb-4 text-lilas-fonce">9. Vos droits</h2>
          <p className="text-gray-700 mb-4">
            Conformément au RGPD, vous disposez des droits suivants concernant vos données personnelles :
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <h3 className="font-medium text-gray-800 mb-2">Droits d&apos;accès et de contrôle</h3>
              <ul className="list-disc pl-5 text-gray-700">
                <li>Droit d&apos;accès à vos données</li>
                <li>Droit de rectification des données inexactes</li>
                <li>Droit à l&apos;effacement (« droit à l&apos;oubli »)</li>
                <li>Droit à la limitation du traitement</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <h3 className="font-medium text-gray-800 mb-2">Droits de gestion et d&apos;opposition</h3>
              <ul className="list-disc pl-5 text-gray-700">
                <li>Droit à la portabilité des données</li>
                <li>Droit d&apos;opposition au traitement</li>
                <li>Droit de retirer votre consentement</li>
                <li>Droit de ne pas faire l&apos;objet d&apos;une décision automatisée</li>
              </ul>
            </div>
          </div>
          <p className="text-gray-700 mb-4">
            Pour exercer ces droits, vous pouvez nous contacter à <a href="mailto:privacy@glowloops.com" className="text-lilas-fonce hover:underline">privacy@glowloops.com</a>. Nous nous efforcerons de répondre à votre demande dans un délai d&apos;un mois.
          </p>
          <div className="bg-lilas-clair/15 p-4 rounded-lg border-l-4 border-lilas-fonce">
            <p className="text-gray-700">
              Vous avez également le droit d&apos;introduire une réclamation auprès de la Commission Nationale de l&apos;Informatique et des Libertés (CNIL) si vous estimez que le traitement de vos données n&apos;est pas conforme à la réglementation. <a href="https://www.cnil.fr/" target="_blank" rel="noopener noreferrer" className="text-lilas-fonce hover:underline">www.cnil.fr</a>
            </p>
          </div>
        </section>

        <section className="mb-8" id="transferts">
          <h2 className="text-xl font-semibold mb-4 text-lilas-fonce">10. Transferts internationaux de données</h2>
          <p className="text-gray-700 mb-4">
            Certains de nos partenaires et sous-traitants peuvent être situés hors de l&apos;Union Européenne. Dans ce cas, nous nous assurons que les transferts de données sont encadrés par des garanties appropriées (clauses contractuelles types de la Commission européenne, décisions d&apos;adéquation, etc.) pour maintenir un niveau de protection équivalent à celui garanti au sein de l&apos;UE.
          </p>
        </section>

        <section id="modifications">
          <h2 className="text-xl font-semibold mb-4 text-lilas-fonce">11. Modifications de la politique de confidentialité</h2>
          <p className="text-gray-700 mb-4">
            Nous pouvons être amenés à modifier cette politique de confidentialité à tout moment, notamment pour nous conformer à de nouvelles réglementations ou pour tenir compte de l&apos;évolution de nos services.
          </p>
          <p className="text-gray-700 mb-4">
            Les modifications prennent effet dès la publication de la nouvelle version sur notre site. Nous vous informerons de toute modification substantielle par email ou via un bandeau sur notre site.
          </p>
          <p className="text-gray-700">
            Nous vous encourageons à consulter régulièrement cette page pour prendre connaissance des éventuelles modifications.
          </p>
        </section>
      </div>

      {/* Bouton télécharger */}
      <div className="mt-8 text-center">
        <a 
          href="#" 
          className="inline-flex items-center px-6 py-3 border border-lilas-fonce text-lilas-fonce bg-white rounded-md hover:bg-lilas-clair/10 transition-colors"
          aria-label="Télécharger la politique de confidentialité au format PDF"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Télécharger la politique de confidentialité (PDF — 150 Ko)
        </a>
      </div>
    </div>
  );
} 