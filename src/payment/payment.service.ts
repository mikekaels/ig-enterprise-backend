import { Injectable } from '@nestjs/common';
import { InjectStripe } from 'nestjs-stripe';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  public constructor(@InjectStripe() private readonly stripe: Stripe) { }

  // need to check is this is existing user in our system, because all user must register on mobile app
  // if found the user only proceed subscription
  async createCustomer(body) {
    let params = {
      email: body.email,
      name: body.name,
      description: 'IGAPP User'
    };

    for (let prop in params) if (!params[prop] || params[prop] == '') delete params[prop];

    const isExist = await this.checkCustomer(body.email);
    console.log('EXIST: ', isExist);
    if (isExist) {

      const cards = await this.listCards({ id: isExist.id });

      const check = await this.checkCards(cards, body.token.card.last4);

      console.log('CHECK CARD: ', check);

      if (check === 'exist') {
        return await this.subscribe(isExist.id);
      } else if (check == 'not exist') {
        await this.addCardToCustomer(isExist.id, body.token.id);
        return await this.subscribe(isExist.id);
      }

    } else if (isExist === undefined) {
      const customer = await this.stripe.customers.create(params);

      await this.addCardToCustomer(customer.id, body.token.id);

      return await this.subscribe(customer.id);
    }
  }

  checkCards(cards, last4) {
    console.log('LAST4: ', last4);
    const exist = cards.data.filter(card => card.last4 == last4);
    console.log('Exist Card: ', exist);
    console.log('Exist Length: ', exist.length);
    if (exist.length == 1) {
      return 'exist';
    } else if (exist.length == 0) {
      return 'not exist';
    }
  }

  async checkCustomer(email) {
    const customers = await this.stripe.customers.list();
    const customer = customers.data.find(customer => customer.email == email);

    return customer;
  }

  async onlyAddCustomer(body) {
    const customer = await this.checkCustomer(body.email);

    const cards = await this.listCards({ id: customer.id });
    console.log('CARDS: ', cards);

    const check = await this.checkCards(cards, body.token.card.last4);

    console.log('CHECK CARD: ', check);

    return new Promise((resolve, rejects) => {
      if (check === 'exist') {
        return resolve({ message: 'Card already exist!' });
      } else if (check == 'not exist') {
        this.addCardToCustomer(customer.id, body.token.id).then(res => {
          return resolve({ res: res, message: 'Card added' });
        });

      }
    });
  }

  async createToken(body) {
    let params = {
      card: {
        number: body.number,
        exp_month: body.exp_month,
        exp_year: body.exp_year,
        cvc: body.cvc,
        name: body.name
      }
    };

    for (let prop in params.card) {
      if (!params.card[prop]) delete params.card[prop];
    }

    return this.stripe.tokens.create(params);
  }

  async addCardToCustomer(id, token) {
    console.log('Add card ...');
    let param = {
      source: token
    };
    return this.stripe.customers.createSource(id, param);
  }

  async chargeCustomer(body) {
    return this.stripe.charges.create(body);
  }

  async getCards(body) {
    const customer = await this.checkCustomer(body.email);
    return this.listCards({ id: customer.id });
  }

  async listCards(body) {
    return this.stripe.customers.listSources(body.id, { object: 'card' });
  }

  async updateCard(body) {
    let params = {
      name: body.update.name,
      exp_month: body.update.exp_month,
      exp_year: body.update.exp_year,
      address_country: body.update.address_country,
      address_city: body.update.address_city,
      address_line1: body.update.address_line1,
      address_line2: body.update.address_line2,
      address_state: body.update.address_state,
      address_zip: body.update.address_zip,
      metadata: body.update.metadata,
    };

    for (let prop in params) if (!params[prop] || params[prop] == '') delete params[prop];

    return this.stripe.customers.updateSource(body.id, body.card, params);
  }

  async listSubscriptions() {
    return await this.stripe.subscriptions.list();
  }

  async subscribe(id) {
    return await this.stripe.subscriptions.create({
      customer: id,
      items: [{ price: "price_1HnZbqBJBXDtpMAEEKokSQD9" }]
    });
  }

  async deleteCard(body) {
    const customer = await this.checkCustomer(body.email);

    return await this.stripe.customers.deleteSource(customer.id, body.card.id);

  }

  getCustomerPaymentData(body) {
    return new Promise((resolve, rejects) => {
      this.stripe.charges.list({ customer: body.id })
        .then(async charges => {
          console.log('Customer-Payment-Data: ', charges.data);
          let data = [];
          // charges.data.map(charge => {
          //   data.push({
          //     id: charge.id,
          //     amount: this.formatMoney(charge.amount / 100),
          //     currency: charge.currency,
          //     source: charge.source.name,
          //     date: charge.created
          //   });
          // });
          return resolve(data);
        })
        .catch(err => {
          return rejects(err);
        });
    });
  }


  async getCustommerInvoices(body) {

    const customer = await this.checkCustomer(body.email);

    return new Promise((resolve, rejects) => {
      this.stripe.invoices.list({ customer: customer.id })
        .then(async invoices => {
          console.log('Customer-Invoices-Data: ', invoices.data);
          let data = [];
          invoices.data.map(invoice => {
            data.push({
              id: invoice.id,
              amount: this.formatMoney(invoice.amount_paid / 100),
              currency: invoice.currency,
              email: invoice.customer_email,
              date: invoice.created,
              pdf_download: invoice.invoice_pdf,
              status: invoice.status
            });
          });
          return resolve(data);
        })
        .catch(err => {
          return rejects(err);
        });
    });
  }

  formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
    try {
      decimalCount = Math.abs(decimalCount);
      decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

      const negativeSign = amount < 0 ? "-" : "";

      let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
      let j = (i.length > 3) ? i.length % 3 : 0;

      return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - +i).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
      console.log(e);
    }
  };

}
