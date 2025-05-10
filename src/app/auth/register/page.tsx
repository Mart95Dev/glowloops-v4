import RegisterForm from '@/components/auth/RegisterForm';
import AuthLayout from '@/components/auth/AuthLayout';
import SocialRegisterOptions from '@/components/auth/SocialRegisterOptions';

export const metadata = {
  title: 'Inscription | GlowLoops',
  description: 'Créez votre compte GlowLoops pour bénéficier d\'un suivi personnalisé de vos commandes et favoris.',
};

export default function RegisterPage() {
  return (
    <AuthLayout 
      title="Créer un compte" 
      subtitle="Rejoignez la communauté GlowLoops"
      sideContent={<SocialRegisterOptions />}
    >
      <RegisterForm />
    </AuthLayout>
  );
}