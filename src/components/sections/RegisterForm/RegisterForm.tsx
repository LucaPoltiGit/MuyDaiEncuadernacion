import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router';
import { Button } from '../../ui/Button/Button';
import { Input } from '../../ui/Input/Input';
import { AuthCard } from '../AuthCard/AuthCard';
import { ROUTES } from '../../../constants/routes';
import { content } from '../../../content';
import { MIN_PASSWORD_LENGTH, validateRegister } from '../../../domain/auth';
import type { RegisterErrors, RegisterForm as RegisterFormValues } from '../../../domain/auth';
import { useSessionActions } from '../../../hooks/useSessionActions';
import type { AuthLocationState } from '../../../types/route';
import styles from './RegisterForm.module.css';

const text = content.auth;

const FIELD_ORDER: (keyof RegisterFormValues)[] = [
  'name',
  'email',
  'phone',
  'password',
  'passwordConfirmation',
];

export interface RegisterFormProps {
  /** Se llama al crear la cuenta (opcional: la página puede reaccionar a la sesión). */
  onSuccess?: () => void;
  /** Estado a conservar al pasar a "Ingresar". */
  returnState?: AuthLocationState;
}

export function RegisterForm({ onSuccess, returnState }: RegisterFormProps) {
  const { register } = useSessionActions();
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<RegisterFormValues>({
    name: '',
    email: '',
    phone: '',
    password: '',
    passwordConfirmation: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);
  const [emailTaken, setEmailTaken] = useState<string | null>(null);

  const allErrors = validateRegister(values);
  const errors: RegisterErrors = submitted ? allErrors : {};
  const errorText = (field: keyof RegisterErrors) => {
    const type = errors[field];
    return type ? text.errors[type] : undefined;
  };
  // El email ya registrado se marca en su campo hasta que lo cambie.
  const emailError =
    errorText('email') ?? (emailTaken === values.email ? text.register.emailTaken : undefined);

  function update(changes: Partial<RegisterFormValues>) {
    setValues((current) => ({ ...current, ...changes }));
    setFailure(null);
  }

  function focusField(field: keyof RegisterFormValues) {
    const element = formRef.current?.elements.namedItem(field);
    if (element instanceof HTMLElement) element.focus();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setSubmitted(true);
    const firstError = FIELD_ORDER.find((field) => allErrors[field]);
    if (firstError) {
      focusField(firstError);
      return;
    }
    setSubmitting(true);
    const result = await register({
      name: values.name,
      email: values.email,
      phone: values.phone,
      password: values.password,
    });
    if (result.ok) {
      onSuccess?.();
      return;
    }
    if (result.error === 'emailTaken') {
      setEmailTaken(values.email);
      focusField('email');
    } else {
      setFailure(text.errors.generic);
    }
    setSubmitting(false);
  }

  const passwordType = showPassword ? 'text' : 'password';

  return (
    <AuthCard
      eyebrow={text.register.eyebrow}
      title={text.register.title}
      lead={text.register.lead}
      footer={
        <p>
          {text.register.hasAccount}{' '}
          <Link to={ROUTES.login} state={returnState}>
            {text.register.toLogin}
          </Link>
        </p>
      }
    >
      <form ref={formRef} className={styles.form} onSubmit={handleSubmit} noValidate>
        <Input
          label={text.register.name}
          name="name"
          autoComplete="name"
          value={values.name}
          onChange={(event) => update({ name: event.target.value })}
          error={errorText('name')}
        />
        <Input
          label={text.register.email}
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          value={values.email}
          onChange={(event) => update({ email: event.target.value })}
          error={emailError}
        />
        <Input
          label={text.register.phone}
          name="phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          hint={text.register.phoneHint}
          value={values.phone}
          onChange={(event) => update({ phone: event.target.value })}
          error={errorText('phone')}
        />
        <Input
          label={text.register.password}
          name="password"
          type={passwordType}
          autoComplete="new-password"
          hint={text.register.passwordHint(MIN_PASSWORD_LENGTH)}
          value={values.password}
          onChange={(event) => update({ password: event.target.value })}
          // Con error, se repite la regla (la ayuda se reemplaza por el error).
          error={errors.password ? text.register.passwordRule(MIN_PASSWORD_LENGTH) : undefined}
        />
        <Input
          label={text.register.passwordConfirmation}
          name="passwordConfirmation"
          type={passwordType}
          autoComplete="new-password"
          value={values.passwordConfirmation}
          onChange={(event) => update({ passwordConfirmation: event.target.value })}
          error={errorText('passwordConfirmation')}
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
        <Button type="submit" size="lg" fullWidth disabled={submitting}>
          {submitting ? text.register.submitting : text.register.submit}
        </Button>
      </form>
    </AuthCard>
  );
}
