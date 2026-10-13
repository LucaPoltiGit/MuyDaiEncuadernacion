import { Navigate } from 'react-router';
import { LoginForm } from '../../components/sections/LoginForm/LoginForm';
import { LoadingState } from '../../components/ui/LoadingState/LoadingState';
import { content } from '../../content';
import { useAuthRedirect } from '../../hooks/useAuthRedirect';
import { useSession } from '../../hooks/useSession';

export function LoginPage() {
  const session = useSession();
  const { target, forwardState, returnState } = useAuthRedirect();

  if (session.status === 'loading') return <LoadingState label={content.auth.checking} />;
  // Con sesión (ya iniciada o recién ingresada), se va a destino: un solo lugar navega.
  if (session.user) return <Navigate to={target} replace state={forwardState} />;

  return <LoginForm returnState={returnState} showDemoAccounts={import.meta.env.DEV} />;
}
