import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import AuthLayout from '@/components/auth/AuthLayout';

export const metadata = {
  title: 'Mot de passe oublié | GlowLoops',
  description: 'Réinitialisez votre mot de passe pour récupérer l\'accès à votre compte GlowLoops.',
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout 
      title="Mot de passe oublié" 
      subtitle="Nous vous enverrons un lien de réinitialisation"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
} 