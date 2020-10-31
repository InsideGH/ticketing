import { Publisher, ExpirationCompleteEvent, Subjects } from '@thelarsson/common344343';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
