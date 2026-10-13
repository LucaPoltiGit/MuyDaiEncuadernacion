import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router';
import { Button } from '../../ui/Button/Button';
import { Input } from '../../ui/Input/Input';
import { AuthCard } from '../AuthCard/AuthCard';
import { whatsappLink } from '../../../constants/contact';
import { ROUTES } from '../../../constants/routes';
import { content } from '../../../content';
import { validateLogin } from '../../../domain/auth';
import type { LoginErrors, LoginForm as LoginFormValues } from '../../../domain/auth';
import { useSessionActions } from '../../../hooks/useSessionActions';
import type { AuthLocationState } from '../../../types/route';
import styles from './LoginForm.module.css';

const text = content.auth;

export interface LoginFormProps {
  /** Se llama al ingresar bien (opcional: la página puede reaccionar a la sesión). */
  onSuccess?: () => void;
  /** Estado a conservar al pasar a "Crear cuenta" (a dónde volver, diseño en curso). */
  returnState?: AuthLocationState;
  /** Muestra las cuentas de prueba (solo en desarrollo). */
  showDemoAccounts?: boolean;
}

export function LoginForm({ onSuccess, returnState, showDemoAccounts = false }: LoginFormProps) {
  const { login } = useSessionActions();
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<LoginFormValues>({ email: '', password: '' });
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);

  const allErrors = validateLogin(values);
  const errors: LoginErrors = submitted ? allErrors : {};
  const errorText = (field: keyof LoginErrors) => {
    const type = errors[field];
    return type ? text.errors[type] : undefined;
  };

  function update(changes: Partial<LoginFormValues>) {
    setValues((current) => ({ ...current, ...changes }));
    setFailure(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setSubmitted(true);
    const firstError = (['email', 'password'] as const).find((field) => allErrors[field]);
    if (firstError) {
      const element = formRef.current?.elements.namedItem(firstError);
      if (element instanceof HTMLElement) element.focus();
      return;
    }
    setSubmitting(true);
    const result = await login(values.email, values.password);
    if (result.ok) {
      onSuccess?.();
      return;
    }
    setFailure(
      result.error === 'invalidCredentials' ? text.login.invalidCredentials : text.errors.generic,
    );
    setSubmitting(false);
  }

  return (
    <AuthCard
      eyebrow={text.login.eyebrow}
      title={text.login.title}
      lead={text.login.lead}
      footer={
        <p>
          {text.login.noAccount}{' '}
          <Link to={ROUTES.register} state={returnState}>
            {text.login.toRegister}
          </Link>
        </p>
      }
    >
      <form ref={formRef} className={styles.form} onSubmit={handleSubmit} noValidate>
        <Input
          label={text.login.email}
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          value={values.email}
          onChange={(event) => update({ email: event.target.value })}
          error={errorText('email')}
        />
        <Input
          label={text.login.password}
          name="password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          value={values.password}
          onChange={(event) => update({ password: event.target.value })}
          error={errorText('password')}
        />
        <label className={styles.showPassword}>
          <input
            type="checkbox"
            checked={showPassword}
            onChange={(event) => setShowPassword(event.target.checked)}
          />
          {text.showPassword}
        </label>
        <p role="alert" className={styles.failure}>
          {failure}
        </p>
        <a
          href={whatsappLink(text.login.forgotMessage)}
          target="_blank"
          rel="noreferrer"
          className={styles.forgot}
        >
          {text.login.forgot}
        </a>
        <Button type="submit" size="lg" fullWidth disabled={submitting}>
          {submitting ? text.login.submitting : text.login.submit}
        </Button>
      </form>
      {showDemoAccounts && (
        <div className={styles.demo}>
          <p className={styles.demoTitle}>{text.login.demoTitle}</p>
          <p>{text.login.demoCustomer}</p>
          <p>{text.login.demoAdmin}</p>
        </div>
      )}
    </AuthCard>
  );
}
