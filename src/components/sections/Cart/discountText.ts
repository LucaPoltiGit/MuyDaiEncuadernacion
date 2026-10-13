import { content } from '../../../content';
import type { DiscountRejection } from '../../../domain/cart/discounts';

const text = content.cart.discount.rejected;

/** Explica por qué un código no aplica, con lo que hay que hacer si se puede. */
export function discountRejectionText(reason: DiscountRejection) {
  switch (reason.type) {
    case 'notApplicable':
      return text.notApplicable[reason.appliesTo];
    case 'belowMinimum':
      return text.belowMinimum(reason.minSubtotal, reason.missing);
    default:
      return text[reason.type];
  }
}
