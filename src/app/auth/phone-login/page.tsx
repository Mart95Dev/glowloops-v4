import { Metadata } from 'next';
import AuthLayout from '@/components/auth/AuthLayout';
import PhoneLoginForm from '@/components/auth/PhoneLoginForm';

export const metadata: Metadata = {
  title: 'Connexion par SMS | GlowLoops',
  description: 'Connectez-vous à votre compte GlowLoops avec votre numéro de téléphone',
};

export default function PhoneLoginPage() {
  return (
    <AuthLayout
      title="Connexion par SMS"
      subtitle="Accédez à votre compte en quelques secondes avec votre numéro de téléphone"
    >
      <PhoneLoginForm />
    </AuthLayout>
  );
} 