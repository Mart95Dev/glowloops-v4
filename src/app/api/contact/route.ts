import { NextResponse } from 'next/server';
import { contactSchema } from '@/lib/types/schemas';
import { emailService } from '@/lib/services/email-service';

export async function POST(request: Request) {
  try {
    // Récupérer les données de la requête
    const data = await request.json();

    // Valider les données avec Zod
    const validationResult = contactSchema.safeParse(data);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          errors: validationResult.error.format() 
        },
        { status: 400 }
      );
    }

    // Envoyer l'email
    const result = await emailService.sendContactEmail(validationResult.data);

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Erreur lors de l'envoi de l'email"
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: "Votre message a été envoyé avec succès"
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Erreur lors du traitement de la requête contact:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Une erreur est survenue lors du traitement de votre demande"
      },
      { status: 500 }
    );
  }
} 