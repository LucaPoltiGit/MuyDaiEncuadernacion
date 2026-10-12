const formatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
});

/** Formatea un precio en pesos (entero) como "$ 12.500". Único formateador de precios. */
export function formatPrice(amount: number) {
  return formatter.format(amount);
}
