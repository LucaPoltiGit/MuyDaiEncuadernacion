import { formatPrice } from '../../domain/money';
import type { OrderStatus } from '../../types/order';

const designs = (count: number) => (count === 1 ? '1 diseño' : `${count} diseños`);

/** Textos de ingreso, registro, rutas protegidas y Mi cuenta. */
export const auth = {
  login: {
    eyebrow: 'Mi cuenta',
    title: 'Ingresá',
    lead: 'Para ver tus compras y guardar tus diseños.',
    email: 'Email',
    password: 'Contraseña',
    submit: 'Ingresar',
    submitting: 'Ingresando…',
    invalidCredentials: 'El email o la contraseña no coinciden. Revisalos y probá de nuevo.',
    noAccount: '¿Todavía no tenés cuenta?',
    toRegister: 'Creá una',
    forgot: '¿Olvidaste tu contraseña? Escribinos',
    forgotMessage: '¡Hola MuyDai! Me olvidé la contraseña de mi cuenta.',
    demoTitle: 'Cuentas de prueba',
    demoCustomer: 'Clienta: ana@example.com / cuadernos',
    demoAdmin: 'Admin: admin@muydai.com / muydai123',
  },
  register: {
    eyebrow: 'Mi cuenta',
    title: 'Creá tu cuenta',
    lead: 'Guardá tus diseños y seguí tus pedidos. Comprar sin cuenta también se puede.',
    name: 'Nombre y apellido',
    email: 'Email',
    phone: 'Teléfono (WhatsApp, opcional)',
    phoneHint: 'Si lo dejás, completamos el checkout por vos.',
    password: 'Contraseña',
    passwordHint: (min: number) => `Al menos ${min} caracteres.`,
    passwordRule: (min: number) => `Elegí una contraseña de al menos ${min} caracteres.`,
    passwordConfirmation: 'Repetí la contraseña',
    submit: 'Crear cuenta',
    submitting: 'Creando tu cuenta…',
    emailTaken: 'Ya hay una cuenta con ese email.',
    toLogin: 'Ingresá',
    hasAccount: '¿Ya tenés cuenta?',
  },
  showPassword: 'Mostrar contraseña',
  errors: {
    required: 'Completá este dato.',
    email: 'Revisá el email: parece incompleto.',
    phone: 'Revisá el teléfono: solo números, con característica.',
    passwordShort: 'La contraseña es muy corta.',
    passwordMismatch: 'Las contraseñas no coinciden.',
    generic: 'Algo falló. Probá de nuevo en un momento.',
  },
  checking: 'Revisando tu sesión…',
  forbidden: {
    title: 'Esta parte no es para vos',
    text: 'Es solo para quien administra la tienda. Si creés que es un error, escribinos.',
    action: 'Volver a la tienda',
    account: 'Ir a Mi cuenta',
  },
};

const statusLabels: Record<OrderStatus, string> = {
  pendingPayment: 'Esperando el pago',
  paid: 'Pago aprobado',
  inProduction: 'En producción',
  shipped: 'Enviado',
  readyForPickup: 'Listo para retirar',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

export const account = {
  eyebrow: 'Mi cuenta',
  greeting: (name: string) => `Hola, ${name}`,
  logout: 'Salir',
  loggingOut: 'Saliendo…',
  tabsLabel: 'Secciones de mi cuenta',
  tabs: { orders: 'Mis compras', designs: 'Mis diseños' },
  adminLink: 'Ir al panel',

  orders: {
    loading: 'Buscando tus compras…',
    error: 'No pudimos cargar tus compras. Probá de nuevo.',
    retry: 'Reintentar',
    empty: {
      title: 'Todavía no compraste nada',
      text: 'Cuando compres con tu cuenta, tus pedidos van a aparecer acá.',
      action: 'Ver la tienda',
    },
    number: (number: string) => `Pedido ${number}`,
    date: (iso: string) =>
      new Date(iso).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' }),
    status: statusLabels,
    refund: 'Te vamos a devolver el dinero: escribinos por WhatsApp.',
    count: (count: number) => (count === 1 ? '1 cuaderno' : `${count} cuadernos`),
    total: 'Total',
    details: 'Ver detalle',
    subtotal: 'Subtotal',
    discount: (code: string) => `Descuento ${code}`,
    shipping: 'Envío',
    pickup: 'Retiro',
    free: 'Gratis',
    deliveryTo: (address: string) => `Envío a ${address}`,
    pickupAt: (point: string) => `Retiro en ${point}`,
    estimate: (min: number, max: number) =>
      min === max ? `Estimado: ${min} días hábiles` : `Estimado: ${min} a ${max} días hábiles`,
    payPending: 'Completar el pago',
    whatsapp: 'Consultar por WhatsApp',
    whatsappMessage: (number: string) => `¡Hola MuyDai! Te escribo por mi pedido ${number}.`,
    price: formatPrice,
  },

  designs: {
    loading: 'Buscando tus diseños…',
    error: 'No pudimos cargar tus diseños. Probá de nuevo.',
    retry: 'Reintentar',
    count: designs,
    empty: {
      title: 'Todavía no guardaste diseños',
      text: 'En el configurador, tocá "Guardar diseño" y lo vas a encontrar acá para retomarlo cuando quieras.',
      action: 'Diseñá tu cuaderno',
    },
    savedOn: (iso: string) =>
      `Guardado el ${new Date(iso).toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })}`,
    priceNow: (price: number) => `Hoy cuesta ${formatPrice(price)}`,
    unavailable: 'Alguna opción se agotó: al retomarlo te proponemos un reemplazo.',
    edit: 'Retomar diseño',
    remove: 'Borrar',
    removeLabel: (date: string) => `Borrar el diseño guardado el ${date}`,
    removeConfirm: 'Sí, borrarlo',
    removeQuestion: '¿Borrar este diseño?',
    cancel: 'Cancelar',
    removed: 'Borramos el diseño.',
  },
};
