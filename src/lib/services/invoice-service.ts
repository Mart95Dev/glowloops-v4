import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Order, OrderStatus } from '@/lib/types/order';

// Structure de données pour les informations de l'entreprise
interface CompanyInfo {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  email: string;
  phone: string;
  website: string;
  siret: string;
  tvaNumber?: string;
}

// Informations de l'entreprise GlowLoops
const COMPANY_INFO: CompanyInfo = {
  name: 'GlowLoops',
  address: '123 Avenue de la Mode',
  city: 'Paris',
  postalCode: '75001',
  country: 'France',
  email: 'contact@glowloops.com',
  phone: '+33 1 23 45 67 89',
  website: 'www.glowloops.com',
  siret: '123 456 789 00012',
  tvaNumber: 'FR 12 345 678 901'
};

/**
 * Traduit le statut de la commande en français
 */
function translateOrderStatus(status: OrderStatus): string {
  switch (status) {
    case 'pending':
      return 'En attente';
    case 'processing':
      return 'En préparation';
    case 'shipped':
      return 'Expédiée';
    case 'delivered':
      return 'Livrée';
    case 'cancelled':
      return 'Annulée';
    case 'refunded':
      return 'Remboursée';
    default:
      return 'Statut inconnu';
  }
}

/**
 * Génère un PDF de facture pour une commande
 * @param order La commande pour laquelle générer la facture
 * @returns Data URI du PDF généré
 */
export function generateInvoicePDF(order: Order): string {
  // Initialisation du document
  const doc = new jsPDF();
  
  // Couleurs GlowLoops
  const LILAS_FONCE: [number, number, number] = [117, 81, 183]; // lilas-fonce
  const GRAY: [number, number, number] = [75, 85, 99]; // gray-600
  const LIGHT_GRAY: [number, number, number] = [243, 244, 246]; // gray-100

  // Variables pour le positionnement
  const margin = 20;
  
  // ======== EN-TÊTE ========
  // Logo et titre
  doc.setFontSize(24);
  doc.setTextColor(LILAS_FONCE[0], LILAS_FONCE[1], LILAS_FONCE[2]);
  doc.setFont("helvetica", "bold");
  doc.text('GlowLoops', margin, 30);
  
  // Titre de facture
  doc.setFontSize(22);
  doc.text('FACTURE', doc.internal.pageSize.getWidth() - margin, 30, { align: 'right' });
  
  // Numéro de facture
  doc.setFontSize(12);
  doc.setTextColor(GRAY[0], GRAY[1], GRAY[2]);
  doc.setFont("helvetica", "normal");
  doc.text(`N° ${order.id.substring(0, 8)}`, doc.internal.pageSize.getWidth() - margin, 38, { align: 'right' });
  
  // Ligne de séparation
  doc.setDrawColor(LILAS_FONCE[0], LILAS_FONCE[1], LILAS_FONCE[2]);
  doc.setLineWidth(0.5);
  doc.line(margin, 42, doc.internal.pageSize.getWidth() - margin, 42);
  
  // ======== INFORMATIONS ========
  const infoStartY = 55;
  
  // Colonne d'informations
  doc.setFontSize(12);
  doc.setTextColor(LILAS_FONCE[0], LILAS_FONCE[1], LILAS_FONCE[2]);
  doc.setFont("helvetica", "bold");
  doc.text('INFORMATIONS', margin, infoStartY);
  
  doc.setFontSize(11);
  doc.setTextColor(GRAY[0], GRAY[1], GRAY[2]);
  doc.setFont("helvetica", "normal");
  doc.text(`Date: ${order.orderDate.toLocaleDateString('fr-FR')}`, margin, infoStartY + 8);
  doc.text(`N° de commande: ${order.id.substring(0, 8)}`, margin, infoStartY + 16);
  doc.text(`Statut: ${translateOrderStatus(order.status)}`, margin, infoStartY + 24);
  
  // Colonne client
  const clientX = doc.internal.pageSize.getWidth() / 2;
  doc.setFontSize(12);
  doc.setTextColor(LILAS_FONCE[0], LILAS_FONCE[1], LILAS_FONCE[2]);
  doc.setFont("helvetica", "bold");
  doc.text('FACTURER À', clientX, infoStartY);
  
  doc.setFontSize(11);
  doc.setTextColor(GRAY[0], GRAY[1], GRAY[2]);
  doc.setFont("helvetica", "normal");
  doc.text(order.shippingAddress.fullName, clientX, infoStartY + 8);
  doc.text(order.shippingAddress.address1, clientX, infoStartY + 16);
  if (order.shippingAddress.address2) {
    doc.text(order.shippingAddress.address2, clientX, infoStartY + 24);
    doc.text(`${order.shippingAddress.postalCode} ${order.shippingAddress.city}`, clientX, infoStartY + 32);
    doc.text(order.shippingAddress.country, clientX, infoStartY + 40);
  } else {
    doc.text(`${order.shippingAddress.postalCode} ${order.shippingAddress.city}`, clientX, infoStartY + 24);
    doc.text(order.shippingAddress.country, clientX, infoStartY + 32);
  }
  
  // ======== TABLEAU DES ARTICLES ========
  const tableStartY = infoStartY + 50;
  
  autoTable(doc, {
    startY: tableStartY,
    margin: { left: margin, right: margin },
    headStyles: {
      fillColor: LIGHT_GRAY,
      textColor: LILAS_FONCE,
      fontStyle: 'bold',
      lineWidth: 0.5,
      lineColor: LILAS_FONCE,
      halign: 'center',
      fontSize: 11,
      cellPadding: 8
    },
    head: [['Produit', 'Quantité', 'Prix unitaire', 'Total']],
    body: order.items.map(item => [
      item.productName,
      item.quantity,
      `${item.price.toFixed(2)} €`,
      `${item.subtotal.toFixed(2)} €`
    ]),
    columnStyles: {
      0: { cellWidth: 65 },
      1: { cellWidth: 35, halign: 'center' },
      2: { cellWidth: 40, halign: 'right' },
      3: { cellWidth: 40, halign: 'right' }
    },
    styles: {
      fontSize: 10,
      cellPadding: 6,
      textColor: GRAY
    },
    alternateRowStyles: {
      fillColor: [255, 255, 255]
    },
    didDrawCell: (data) => {
      if (data.section === 'head') {
        doc.setDrawColor(LILAS_FONCE[0], LILAS_FONCE[1], LILAS_FONCE[2]);
        doc.setLineWidth(0.5);
      }
    }
  });
  
  // ======== TOTAUX ========
  // Récupérer la position Y après le tableau
  const lastAutoTable = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable;
  let finalY = lastAutoTable ? lastAutoTable.finalY : 150;
  finalY += 10;
  
  // Section des totaux (alignée à droite)
  const totalsX = doc.internal.pageSize.getWidth() - margin - 80;
  doc.setFontSize(11);
  doc.setTextColor(GRAY[0], GRAY[1], GRAY[2]);
  doc.setFont("helvetica", "normal");
  
  // Sous-total
  doc.text('Sous-total:', totalsX, finalY);
  doc.text(`${order.subtotal.toFixed(2)} €`, doc.internal.pageSize.getWidth() - margin, finalY, { align: 'right' });
  finalY += 8;
  
  // Frais de livraison
  doc.text('Frais de livraison:', totalsX, finalY);
  doc.text(`${order.shippingCost.toFixed(2)} €`, doc.internal.pageSize.getWidth() - margin, finalY, { align: 'right' });
  finalY += 8;

  // TVA
  doc.text('TVA (20%):', totalsX, finalY);
  doc.text(`${order.tax.toFixed(2)} €`, doc.internal.pageSize.getWidth() - margin, finalY, { align: 'right' });
  finalY += 8;
  
  // Remise (si applicable)
  if (order.discount && order.discount > 0) {
    doc.text('Remise:', totalsX, finalY);
    doc.text(`-${order.discount.toFixed(2)} €`, doc.internal.pageSize.getWidth() - margin, finalY, { align: 'right' });
    finalY += 8;
  }
  
  // Ligne de séparation
  doc.setDrawColor(LILAS_FONCE[0], LILAS_FONCE[1], LILAS_FONCE[2]);
  doc.setLineWidth(0.5);
  doc.line(totalsX, finalY, doc.internal.pageSize.getWidth() - margin, finalY);
  finalY += 6;
  
  // Total
  doc.setFontSize(13);
  doc.setTextColor(LILAS_FONCE[0], LILAS_FONCE[1], LILAS_FONCE[2]);
  doc.setFont("helvetica", "bold");
  doc.text('Total:', totalsX, finalY);
  doc.text(`${order.total.toFixed(2)} €`, doc.internal.pageSize.getWidth() - margin, finalY, { align: 'right' });
  
  // ======== CONDITIONS ET NOTES ========
  finalY += 20;
  doc.setFontSize(12);
  doc.setTextColor(LILAS_FONCE[0], LILAS_FONCE[1], LILAS_FONCE[2]);
  doc.setFont("helvetica", "bold");
  doc.text('CONDITIONS ET NOTES', margin, finalY);
  finalY += 8;
  
  doc.setFontSize(11);
  doc.setTextColor(GRAY[0], GRAY[1], GRAY[2]);
  doc.setFont("helvetica", "normal");
  doc.text('Paiement dû dans les 30 jours. Merci pour votre confiance.', margin, finalY);
  
  // ======== PIED DE PAGE ========
  const pageHeight = doc.internal.pageSize.getHeight();
  const centerX = doc.internal.pageSize.getWidth() / 2;
  
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.setFont("helvetica", "normal");
  
  // Informations de l'entreprise
  doc.text('GlowLoops - Bijoux tendance et accessoires', centerX, pageHeight - 40, { align: 'center' });
  doc.text(`${COMPANY_INFO.email} - ${COMPANY_INFO.website}`, centerX, pageHeight - 30, { align: 'center' });
  doc.text(`SIRET: ${COMPANY_INFO.siret}`, centerX, pageHeight - 20, { align: 'center' });
  doc.text('Merci pour votre confiance', centerX, pageHeight - 10, { align: 'center' });
  
  // Génération du PDF
  return doc.output('datauristring');
}

/**
 * Génère un nom de fichier pour la facture
 * @param order La commande
 * @returns Le nom du fichier
 */
export function generateInvoiceFilename(order: Order): string {
  const date = order.orderDate.toISOString().split('T')[0];
  return `facture-glowloops-${date}-${order.id.substring(0, 8)}.pdf`;
} 