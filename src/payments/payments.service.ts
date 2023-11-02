import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity';

@Injectable()
export class PaymentsService {
    constructor(
        @InjectRepository(Payment)
        private paymentsRepository: Repository<Payment>,
    ) {}
    
    // Get all payments
    async findAll(): Promise<Payment[]> {
        return await this.paymentsRepository.find();
    }

    // Get one payment
    async findOne(id: number): Promise<Payment> {
        return await this.paymentsRepository.findOne({ where: { id } });
    }

    // Get one payment by transfer code
    async findOneByTransferCode(transferCode: string): Promise<Payment> {
        return await this.paymentsRepository.findOne({ where: { transferCode } });
    }

    // Create a payment
    async create(payment: Payment): Promise<Payment> {
        const newPayment = this.paymentsRepository.create(payment);
        return await this.paymentsRepository.save(newPayment);
    }

    // Update a payment
    async update(id: number, payment: Payment): Promise<Payment> {
        await this.paymentsRepository.update(id, payment);
        return await this.paymentsRepository.findOne({ where: { id } });
    }

    // Delete a payment
    async delete(id: number): Promise<void> {
        await this.paymentsRepository.delete(id);
    }

}