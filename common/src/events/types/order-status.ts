export enum OrderStatus {
  // 1) the ticket is not yet reserved
  Created = 'created',

  // 1) failed to reserve the ticket
  // 2) user cancel order
  // 3) expires before payment
  Cancelled = 'cancelled',

  // 1) the order has reserved the ticket
  AwaitingPayment = 'awaiting:payments',

  // 1) the user has payed.
  Completed = 'completed',
}
