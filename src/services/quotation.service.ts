import prisma from "../config/prisma";
import { Quote } from "@prisma/client";
import { listResource } from '../utils/list-resource';
import { createDelivery } from "./delvery.service";

export const QuotationService = {

    async getAllQuotations(query: any) {
        return listResource(
            'quote',
            query,
            [
                'id',
                'customer.name',
                'user.name',
                'comments',
            ],
            {
                customer: true,
                user: true,
            },
            { created_at: 'desc' },
        );
    },

    async getQuotationsByCustomer(query: any) {
        return listResource(
            'quote',
            query,
            [
                'id',
                'customer.name',
                'user.name',
                'comments',
            ],
            {
                customer: true,
                user: true,
            },
            { created_at: 'desc' },
            { customer_id: query.customer_id }
        );
    },

    async getQuotationById(id: number): Promise<any> {
        const quotation = await prisma.quote.findUnique({
            where: { id },
            include: {
                customer: true,
                user: true,
                quote_items: true
            },
        });
        const delivery = await prisma.delivery.findFirst({
            where: {
                deliveriable_type: 'Quotation',
                deliveriable_id: id,
            },
        });

        

        return {...quotation, delivery};
    },

    async createQuotation(data: any): Promise<Quote> {
        return prisma.quote.create({
            data:{
                customer_id: +data.customer_id,
                ...data,
            },
            include: {
                customer: true,
                user: true,
            },
        });
    },

    async updateQuotation(id: number, data: any): Promise<Quote> {
        return prisma.quote.update({
            where: { id },
            data,
            include: {
                customer: true,
                user: true,
            },
        });
    },

    async deleteQuotation(id: number): Promise<Quote> {
        return prisma.quote.delete({
            where: { id },
            include: {
                customer: true,
                user: true,
                quote_items: true,
            },
        });
    },

    async createDelivery(data: any) {
    const { deliveriable_type, deliveriable_id, ...rest } = data;
    return await prisma.delivery.create({
      data: {
        ...rest,
        deliveriable_type,
        deliveriable_id,
        created_at: new Date(),
      },
    });
  },

  async updateDelivery(id: number, data: any) {
    const { deliveriable_type, deliveriable_id, ...rest } = data;
    return await prisma.delivery.update({
      where: { id },
      data: {
        ...rest,
        deliveriable_type,
        deliveriable_id,
      },
    });
  },

}