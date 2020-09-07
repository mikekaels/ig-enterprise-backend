import { Controller, Post, Body, Get, Put, Delete } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {

  constructor(private paymentService: PaymentService) { }

  @Post('create')
  async createCustomer(@Body() body): Promise<any> {
    return this.paymentService.createCustomer(body);
  }

  @Post('token')
  async createToken(@Body() body): Promise<any> {
    return this.paymentService.createToken(body);
  }

  @Post('add-card')
  async addCardToCustomer(@Body() body): Promise<any> {
    return this.paymentService.onlyAddCustomer(body);
  }

  @Post('charge')
  async chargeCustomer(@Body() body): Promise<any> {
    return this.paymentService.chargeCustomer(body);
  }

  @Post('cards')
  async listcards(@Body() body): Promise<any> {
    return this.paymentService.getCards(body);
  }

  @Put('card')
  async updateCard(@Body() body): Promise<any> {
    console.log('fetch cards list....');
    return this.paymentService.updateCard(body);
  }

  @Post('delete-card')
  async deleteCard(@Body() body): Promise<any> {
    console.log('delete card ....');
    return this.paymentService.deleteCard(body);
  }

  @Get('subscriptions')
  async listSubscriptions(): Promise<any> {
    return this.paymentService.listSubscriptions();
  }

  @Post('subscribe')
  async subscribe(@Body() body): Promise<any> {
    return this.paymentService.subscribe(body);
  }

  @Post()
  async getCustomerPaymentData(@Body() body): Promise<any> {
    return this.paymentService.getCustomerPaymentData(body);
  }

  @Post('invoices')
  async getCustommerInvoices(@Body() body): Promise<any> {
    return this.paymentService.getCustommerInvoices(body);
  }

}
