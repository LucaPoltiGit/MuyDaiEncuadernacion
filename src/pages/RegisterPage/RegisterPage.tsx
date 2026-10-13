import { Navigate } from 'react-router';
import { RegisterForm } from '../../components/sections/RegisterForm/RegisterForm';
import { LoadingState } from '../../components/ui/LoadingState/LoadingState';
import { content } from '../../content';
import { useAuthRedirect } from '../../hooks/useAuthRedirect';
import { useSession } from '../../hooks/useSession';

export function RegisterPage() {
  const session = useSession();
  const { target, forwardState, returnState } = useAuthRedirect();

  if (session.status === 'loading') return <LoadingState label={content.auth.checking} />;
  if (session.user) return <Navigate to={target} replace state={forwardState} />;

  return <RegisterForm returnState={returnState} />;
}
