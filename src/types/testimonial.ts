/** Lo que cuenta una clienta. El admin los carga y elige cuáles se ven. */
export interface Testimonial {
  id: string;
  name: string;
  /** Ciudad o barrio (opcional, vacío si no lo quiere poner). */
  location: string;
  text: string;
  /** Solo los visibles aparecen en la tienda. */
  visible: boolean;
  createdAt: string;
}
