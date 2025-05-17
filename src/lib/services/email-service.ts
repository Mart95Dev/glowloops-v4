import nodemailer from "nodemailer";
import { ContactFormValues } from "../types/schemas";

// Type pour les pièces jointes
interface Attachment {
  filename: string;
  content: Buffer | string;
  contentType?: string;
  path?: string;
}

/**
 * Service pour l'envoi d'emails
 */
export const emailService = {
  /**
   * Envoie un email générique
   */
  async sendEmail({ 
    to, 
    subject, 
    text, 
    html, 
    attachments = [] 
  }: { 
    to: string;
    subject: string;
    text: string;
    html?: string;
    attachments?: Attachment[];
  }) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.hostinger.com",
        port: Number(process.env.SMTP_PORT) || 465,
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      const info = await transporter.sendMail({
        from: `GlowLoops <${process.env.SMTP_USER}>`,
        to,
        subject,
        text,
        html,
        attachments,
      });

      return { success: true, info };
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email:", error);
      return { success: false, error };
    }
  },

  /**
   * Envoie un email depuis le formulaire de contact
   */
  async sendContactEmail(data: ContactFormValues) {
    const { nom, email, sujet, message } = data;
    
    const subjectLine = `Nouveau message de contact: ${sujet}`;
    const textContent = `
      Nouveau message de contact:
      
      Nom: ${nom}
      Email: ${email}
      Sujet: ${sujet}
      
      Message:
      ${message}
    `;
    
    const htmlContent = `
      <h2>Nouveau message de contact</h2>
      <p><strong>Nom:</strong> ${nom}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Sujet:</strong> ${sujet}</p>
      <h3>Message:</h3>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `;
    
    return this.sendEmail({
      to: process.env.SMTP_USER as string, // Envoyer à l'adresse de l'entreprise
      subject: subjectLine,
      text: textContent,
      html: htmlContent
    });
  }
}; 