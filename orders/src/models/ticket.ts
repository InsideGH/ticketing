import mongoose from 'mongoose';
import { Order, OrderStatus } from './order';

// Plugin updates the version number automatically.
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface TicketAttrs {
  id: string;
  title: string;
  price: number;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<Boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
  findByEvent(event: { id: string; version: number }): Promise<TicketDoc | null>;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  },
);

ticketSchema.set('versionKey', 'version');

ticketSchema.plugin(updateIfCurrentPlugin);

// Use this if there are other services that require other kind of versioning.
// ticketSchema.pre('save', function (done) {
//   // function keyword due to 'this'
//   // @ts-ignore
//   this.$where = {
//     version: this.get('version') - 1,
//   };
//   done();
// });

ticketSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  const { id, ...rest } = attrs;

  /**
   * We are replicating the Ticket here, thus we need to 'set' the _id and not let mongoose auto
   * generate it for us.
   */
  return new Ticket({
    _id: attrs.id,
    ...rest,
  });
};

ticketSchema.methods.isReserved = async function () {
  // this === the ticket document
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [OrderStatus.Created, OrderStatus.AwaitingPayment, OrderStatus.Completed],
    },
  });
  return !!existingOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
