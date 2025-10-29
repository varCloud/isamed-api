import prisma from "../config/prisma";
import { Prisma, quote_item } from "@prisma/client";

export const QuoteItemService = {
   async createQuoteItem(data: Omit<Prisma.quote_itemCreateInput, 'quote'> & { quote_id: number }) {
    const { quote_id, ...rest } = data;

    return await prisma.quote_item.create({
      data: {
        ...rest,
        quote: {
          connect: { id: quote_id },
        },
        created_at: new Date(),
      },
    });
  },
  async updateQuoteItem(id: number, data: Partial<Omit<quote_item, "id">>): Promise<quote_item> {
    if (!id) {
      throw new Error("ID de cotización es requerido");
    }
    return await prisma.quote_item.update({
      where: { id },
      data,
    });
  },

  async deleteQuoteItem(id: number): Promise<quote_item> {
    return await prisma.quote_item.delete({ where: { id } });
  },
};
