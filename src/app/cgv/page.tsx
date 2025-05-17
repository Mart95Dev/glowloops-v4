export default function CGVPage() {
  const lastUpdate = "1er septembre 2023";

  // Sections IDs pour le sommaire interactif
  const sections = [
    { id: "preambule", title: "Préambule" },
    { id: "produits", title: "Produits" },
    { id: "prix", title: "Prix" },
    { id: "commande", title: "Commande" },
    { id: "paiement", title: "Paiement" },
    { id: "livraison", title: "Livraison" },
    { id: "droit-retractation", title: "Droit de rétractation" },
    { id: "garanties", title: "Garanties" },
    { id: "responsabilite", title: "Responsabilité" },
    { id: "propriete-intellectuelle", title: "Propriété intellectuelle" },
    { id: "donnees-personnelles", title: "Données personnelles" },
    { id: "droit-applicable", title: "Droit applicable" },
    { id: "service-client", title: "Service client" }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl md:text-3xl font-bold font-display text-lilas-fonce mb-6 text-center">
        Conditions Générales de Vente
      </h1>
      <p className="text-center text-gray-500 mb-6">Dernière mise à jour : {lastUpdate}</p>

      {/* Résumé introductif */}
      <div className="bg-lilas-clair/10 p-4 rounded-lg mb-8">
        <p className="text-gray-700">
          Ce document définit les conditions générales qui régissent votre utilisation du site GlowLoops et vos achats. En passant commande sur notre site, vous acceptez ces conditions dans leur intégralité.
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
            <p className="text-gray-700 mb-1"><strong>Client</strong> : Tout utilisateur effectuant un achat sur le site</p>
            <p className="text-gray-700 mb-1"><strong>CGV</strong> : Conditions Générales de Vente</p>
            <p className="text-gray-700 mb-1"><strong>Produit</strong> : Article proposé à la vente sur le site</p>
          </div>
          <div>
            <p className="text-gray-700 mb-1"><strong>Commande</strong> : Achat validé par le client</p>
            <p className="text-gray-700 mb-1"><strong>Délai de rétractation</strong> : Période pendant laquelle le client peut annuler sa commande</p>
            <p className="text-gray-700 mb-1"><strong>RGPD</strong> : Règlement Général sur la Protection des Données</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
        <section className="mb-8" id="preambule">
          <h2 className="text-xl font-semibold mb-4 text-lilas-fonce">1. Préambule</h2>
          <p className="text-gray-700 mb-4">
            Les présentes Conditions Générales de Vente (ci-après &ldquo;CGV&rdquo;) régissent les relations contractuelles entre la société GlowLoops, immatriculée au Registre du Commerce et des Sociétés sous le numéro 123 456 789, dont le siège social est situé au 123 Avenue des Bijoux, 75001 Paris (ci-après &ldquo;GlowLoops&rdquo; ou &ldquo;nous&rdquo;), et toute personne physique ou morale effectuant un achat sur le site internet www.glowloops.com (ci-après &ldquo;le Client&rdquo; ou &ldquo;vous&rdquo;).
          </p>
          <p className="text-gray-700">
            En validant une commande sur notre site, vous reconnaissez avoir pris connaissance des présentes CGV et les accepter sans réserve. GlowLoops se réserve le droit de modifier les présentes CGV à tout moment, sans préavis. Les CGV applicables sont celles en vigueur au moment de la validation de la commande.
          </p>
        </section>

        <section className="mb-8" id="produits">
          <h2 className="text-xl font-semibold mb-4 text-lilas-fonce">2. Produits</h2>
          <p className="text-gray-700 mb-4">
            Les bijoux proposés à la vente sont décrits et présentés avec la plus grande précision possible sur notre site. Toutefois, des variations mineures peuvent exister en raison de la nature artisanale de certains produits. Les photographies ne sont pas contractuelles.
          </p>
          <p className="text-gray-700 mb-4">
            Tous nos bijoux sont fabriqués à partir de matériaux hypoallergéniques et conformes aux normes européennes en vigueur.
          </p>
          <p className="text-gray-700">
            Les produits sont disponibles dans la limite des stocks indiqués sur le site. Si, malgré nos précautions, un produit commandé se révélait indisponible, nous vous en informerions dans les plus brefs délais et vous proposerions soit un produit de remplacement, soit l&apos;annulation de votre commande avec remboursement intégral.
          </p>
        </section>

        <section className="mb-8" id="prix">
          <h2 className="text-xl font-semibold mb-4 text-lilas-fonce">3. Prix</h2>
          <p className="text-gray-700 mb-4">
            Les prix de nos produits sont indiqués en euros, toutes taxes comprises (TTC), hors frais de livraison. Les frais de livraison sont indiqués avant la validation de la commande.
          </p>
          <p className="text-gray-700 mb-4">
            GlowLoops se réserve le droit de modifier ses prix à tout moment. Néanmoins, les produits seront facturés sur la base des tarifs en vigueur au moment de l&apos;enregistrement de la commande.
          </p>
          <p className="text-gray-700">
            En cas d&apos;erreur manifeste sur le prix, GlowLoops ne saurait être engagée à vendre le produit au prix erroné et se réserve le droit d&apos;annuler la commande.
          </p>
        </section>

        <section className="mb-8" id="commande">
          <h2 className="text-xl font-semibold mb-4 text-lilas-fonce">4. Commande</h2>
          <p className="text-gray-700 mb-4">
            Pour passer commande, vous devez suivre le processus de commande en ligne en ajoutant les produits de votre choix au panier, puis en validant votre panier. Vous devrez ensuite vous identifier, soit en créant un compte, soit en vous connectant à votre compte existant, soit en commandant sans créer de compte.
          </p>
          <p className="text-gray-700 mb-4">
            La validation de votre commande implique l&apos;acceptation expresse des présentes CGV. Une fois votre commande validée, vous recevrez un email de confirmation contenant un récapitulatif de votre commande.
          </p>
          <p className="text-gray-700">
            GlowLoops se réserve le droit de refuser ou d&apos;annuler toute commande en cas de litige avec le Client, de non-paiement total ou partiel d&apos;une commande antérieure, ou en cas de suspicion de fraude.
          </p>
        </section>

        <section className="mb-8" id="paiement">
          <h2 className="text-xl font-semibold mb-4 text-lilas-fonce">5. Paiement</h2>
          <p className="text-gray-700 mb-4">
            Le paiement de votre commande peut être effectué par carte bancaire (Visa, Mastercard), PayPal, ou virement bancaire. Le débit de la carte bancaire est effectué au moment de la validation de la commande.
          </p>
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
            <h3 className="font-medium text-gray-800 mb-2">Sécurité des paiements</h3>
            <p className="text-gray-700">
              Toutes les transactions sont sécurisées par un système de cryptage SSL (Secure Socket Layer), garantissant la confidentialité des informations transmises lors du paiement en ligne.
            </p>
          </div>
          <p className="text-gray-700">
            Une facture électronique sera disponible dans votre espace client et/ou vous sera envoyée par email après validation de votre commande.
          </p>
        </section>

        <section className="mb-8" id="livraison">
          <h2 className="text-xl font-semibold mb-4 text-lilas-fonce">6. Livraison</h2>
          <p className="text-gray-700 mb-4">
            GlowLoops propose plusieurs options de livraison, dont les délais et tarifs sont indiqués lors du processus de commande. Les délais de livraison sont donnés à titre indicatif et peuvent varier en fonction de la destination et des aléas de transport.
          </p>
          
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-lilas-clair/20">
                  <th className="py-3 px-4 text-left border-b">Mode de livraison</th>
                  <th className="py-3 px-4 text-left border-b">Délai estimé</th>
                  <th className="py-3 px-4 text-left border-b">Tarif</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-3 px-4 border-b">Livraison standard</td>
                  <td className="py-3 px-4 border-b">3-5 jours ouvrés</td>
                  <td className="py-3 px-4 border-b">4,90€</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-3 px-4 border-b">Livraison express</td>
                  <td className="py-3 px-4 border-b">1-2 jours ouvrés</td>
                  <td className="py-3 px-4 border-b">7,90€</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 border-b">Livraison gratuite</td>
                  <td className="py-3 px-4 border-b">3-5 jours ouvrés</td>
                  <td className="py-3 px-4 border-b">Gratuit dès 50€ d&apos;achat</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <p className="text-gray-700 mb-4">
            Les commandes sont livrées à l&apos;adresse de livraison indiquée par le Client lors du processus de commande. Il appartient au Client de vérifier l&apos;exactitude des informations fournies.
          </p>
          <p className="text-gray-700 mb-4">
            En cas de colis endommagé ou de produit manquant, le Client doit émettre des réserves auprès du transporteur au moment de la livraison et contacter notre service client dans les 48 heures.
          </p>
          <p className="text-gray-700">
            GlowLoops livre en France métropolitaine et dans certains pays européens, selon les modalités précisées sur le site.
          </p>
        </section>

        <section className="mb-8" id="droit-retractation">
          <h2 className="text-xl font-semibold mb-4 text-lilas-fonce">7. Droit de rétractation</h2>
          <p className="text-gray-700 mb-4">
            Conformément à la législation en vigueur, vous disposez d&apos;un délai de 14 jours à compter de la réception de votre commande pour exercer votre droit de rétractation, sans avoir à justifier de motifs ni à payer de pénalités.
          </p>
          <div className="bg-lilas-clair/15 p-4 rounded-lg border-l-4 border-lilas-fonce my-4">
            <p className="text-gray-700">
              <strong>Comment exercer votre droit de rétractation :</strong> Envoyez-nous une déclaration claire par email à contact@glowloops.com ou via notre formulaire de contact. Vous pouvez également utiliser le modèle de formulaire de rétractation disponible <a href="#" className="text-lilas-fonce hover:underline">ici</a>.
            </p>
          </div>
          <p className="text-gray-700 mb-4">
            Vous devez nous retourner les produits concernés dans leur état d&apos;origine, complets (emballage, accessoires, notice...) et non utilisés, dans un délai de 14 jours suivant la communication de votre décision de vous rétracter. Les frais de retour sont à votre charge.
          </p>
          <p className="text-gray-700">
            Le remboursement sera effectué dans un délai de 14 jours à compter de la réception des produits retournés ou de la preuve d&apos;expédition de ces derniers, la date retenue étant celle du premier de ces faits.
          </p>
        </section>

        <section className="mb-8" id="garanties">
          <h2 className="text-xl font-semibold mb-4 text-lilas-fonce">8. Garanties</h2>
          <p className="text-gray-700 mb-4">
            Nos produits bénéficient de la garantie légale de conformité (articles L217-4 et suivants du Code de la consommation) et de la garantie contre les vices cachés (articles 1641 et suivants du Code civil).
          </p>
          <p className="text-gray-700 mb-4">
            Si vous constatez un défaut de conformité ou un vice caché, vous devez nous en informer dans les plus brefs délais en précisant le problème rencontré et en joignant si possible des photos. Après analyse de votre demande, nous procéderons, selon les cas, à la réparation, au remplacement ou au remboursement du produit défectueux.
          </p>
          <p className="text-gray-700">
            Sont exclus de garantie les produits modifiés, réparés, intégrés ou ajoutés par le Client ou par un tiers, ainsi que les détériorations provenant d&apos;une négligence, d&apos;une utilisation ou d&apos;un entretien non conforme.
          </p>
        </section>

        <section className="mb-8" id="responsabilite">
          <h2 className="text-xl font-semibold mb-4 text-lilas-fonce">9. Responsabilité</h2>
          <p className="text-gray-700 mb-4">
            GlowLoops ne pourra être tenue responsable des dommages indirects résultant de l&apos;utilisation des produits achetés sur son site, ni des préjudices résultant d&apos;une utilisation non conforme des produits.
          </p>
          <p className="text-gray-700">
            La responsabilité de GlowLoops ne pourra être engagée en cas d&apos;inexécution ou de mauvaise exécution du contrat due à un cas de force majeure, à un fait imprévisible et insurmontable d&apos;un tiers, ou à une faute du Client.
          </p>
        </section>

        <section className="mb-8" id="propriete-intellectuelle">
          <h2 className="text-xl font-semibold mb-4 text-lilas-fonce">10. Propriété intellectuelle</h2>
          <p className="text-gray-700 mb-4">
            Tous les éléments du site www.glowloops.com (textes, images, logos, photos, etc.) sont la propriété exclusive de GlowLoops ou de ses partenaires et sont protégés par le droit d&apos;auteur et le droit des marques.
          </p>
          <p className="text-gray-700">
            Toute reproduction, représentation, modification, publication, adaptation ou exploitation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est strictement interdite sans l&apos;autorisation écrite préalable de GlowLoops.
          </p>
        </section>

        <section className="mb-8" id="donnees-personnelles">
          <h2 className="text-xl font-semibold mb-4 text-lilas-fonce">11. Protection des données personnelles</h2>
          <p className="text-gray-700 mb-4">
            GlowLoops s&apos;engage à protéger vos données personnelles et à respecter la réglementation en vigueur, notamment le Règlement Général sur la Protection des Données (RGPD).
          </p>
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
            <h3 className="font-medium text-gray-800 mb-2">Résumé de notre politique de confidentialité</h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              <li>Nous collectons uniquement les données nécessaires au traitement de votre commande</li>
              <li>Vos données peuvent être transmises à nos partenaires logistiques et bancaires</li>
              <li>Vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression de vos données</li>
              <li>Nous conservons vos données pendant la durée légale requise</li>
            </ul>
          </div>
          <p className="text-gray-700">
            Pour plus d&apos;informations sur la gestion de vos données personnelles, veuillez consulter notre <a href="/politique-de-confidentialite" className="text-lilas-fonce hover:underline">Politique de Confidentialité</a>.
          </p>
        </section>

        <section className="mb-8" id="droit-applicable">
          <h2 className="text-xl font-semibold mb-4 text-lilas-fonce">12. Loi applicable et juridiction compétente</h2>
          <p className="text-gray-700 mb-4">
            Les présentes CGV sont soumises au droit français. En cas de litige, une solution amiable sera recherchée avant toute action judiciaire. À défaut, les tribunaux français seront seuls compétents.
          </p>
          <p className="text-gray-700">
            Conformément aux dispositions du Code de la consommation concernant le règlement amiable des litiges, GlowLoops adhère au Service du Médiateur du e-commerce de la FEVAD. Vous pouvez recourir à ce service de médiation pour les litiges de consommation liés à un achat effectué sur notre site.
          </p>
        </section>

        <section id="service-client">
          <h2 className="text-xl font-semibold mb-4 text-lilas-fonce">13. Service client</h2>
          <p className="text-gray-700 mb-4">
            Pour toute question ou réclamation concernant votre commande ou nos produits, notre service client est à votre disposition :
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200 text-center">
              <h3 className="font-medium text-gray-800 mb-2">Par email</h3>
              <p className="text-gray-700"><a href="mailto:contact@glowloops.com" className="text-lilas-fonce hover:underline">contact@glowloops.com</a></p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200 text-center">
              <h3 className="font-medium text-gray-800 mb-2">Par téléphone</h3>
              <p className="text-gray-700">+33 (0)1 23 45 67 89</p>
              <p className="text-gray-600 text-sm">(Lundi-vendredi, 9h-18h)</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200 text-center">
              <h3 className="font-medium text-gray-800 mb-2">Par courrier</h3>
              <p className="text-gray-700">GlowLoops - Service Client</p>
              <p className="text-gray-700">123 Avenue des Bijoux</p>
              <p className="text-gray-700">75001 Paris</p>
            </div>
          </div>
        </section>
      </div>

      {/* Bouton télécharger */}
      <div className="mt-8 text-center">
        <a 
          href="#" 
          className="inline-flex items-center px-6 py-3 border border-lilas-fonce text-lilas-fonce bg-white rounded-md hover:bg-lilas-clair/10 transition-colors"
          aria-label="Télécharger les conditions générales de vente au format PDF"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Télécharger les CGV (PDF — 130 Ko)
        </a>
      </div>
    </div>
  );
} 