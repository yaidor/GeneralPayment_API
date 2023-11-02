import axios from 'axios';
import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException, BadRequestException } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Payment } from './payment.entity';

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) {}

    // Get all payments
    @Get()
    async findAll(): Promise<Payment[]> {
        return await this.paymentsService.findAll();
    }

    // Get one payment
    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Payment> {
        const payment = await this.paymentsService.findOne(id);
        if (!payment) {
            throw new NotFoundException('Payment does not exist!');
        } else {
            return payment;
        }
    }

    // Create a payment
    @Post()
    async create(@Body() payment: Payment): Promise<Payment> {
        try{
            const token = await this.getToken(payment.email);
            // if token is equal to 'email without token' then throw error
            if (token == 'email without token') {
                throw new Error('email without token')
            } else {
                const paymentDone = await this.paymentsService.findOneByTransferCode(payment.trasnferCode);
                if (paymentDone) {
                    throw new Error('Payment already done')
                } else {
                    try{
                        const paymentMade = await this.makePayment(token, payment.trasnferCode, payment.amount, payment.email);
                        if (paymentMade && paymentMade.transferCode == payment.trasnferCode) {
                            return await this.paymentsService.create(payment);
                        } else {
                            throw new Error('Payment not made')
                        }
                    } catch (error) {
                        throw new BadRequestException('Data respose: "'+error.response.data+'" Status response: '+error.response.status+' Status text: '+error.response.statusText+' Config URL: '+error.response.config.url+' Config method: '+error.response.config.method+' Config headers: '+error.response.config.headers+' Config data: '+error.response.config.data);
                    }
                }
            }
        } catch (error) {
            throw error;
        }
    }

    // Update a payment
    @Put(':id')
    async update(@Param('id') id: number, @Body() payment: Payment): Promise<Payment> {
        const oldPayment = await this.paymentsService.findOne(id);
        if (!oldPayment) {
            throw new NotFoundException('Payment does not exist!');
        } else {
            return await this.paymentsService.update(id, payment);
        }
    }

    // Delete a payment
    @Delete(':id')
    async delete(@Param('id') id: number): Promise<void> {
        const payment = await this.paymentsService.findOne(id);
        if (!payment) {
            throw new NotFoundException('Payment does not exist!');
        } else {
            await this.paymentsService.delete(id);
        }
    }

    async getToken(email: string): Promise<string> {
        try {
            const response = await axios.get(process.env.URL_TOKEN+email)
            const data = response.data;
            return data;
        } catch (error) {
            throw new BadRequestException('email without token');
        }
    }

    async getPayment(token: string, trasnferCode: string, email: string): Promise<string> {
        try {
            const response = await axios.get(process.env.URL_GET_PAYMENT+email+'&transferCode='+trasnferCode,{
                headers: {
                    'Authorization': token
                }
            })
            const data = response.data;
            return data;
        } catch (error) {
            throw error;
        }
    }

    async makePayment(token: string, trasnferCode: string, amount: number, email: string): Promise<any> {
        try {
            const response = await axios.post(process.env.URL_MAKE_PAYMENT+email+'&transferCode='+trasnferCode,{
                trasnferCode: trasnferCode,
                amount: amount
            },{
                headers: {
                    'Authorization': token
                }
            })
            const data = response.data;
            return data;
        } catch (error) {
            throw error;
        }
    }
}
