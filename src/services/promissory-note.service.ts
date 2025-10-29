import { listResource } from '../utils/list-resource';
import prisma from "../config/prisma";
import { Promissory_note } from "@prisma/client";

export const PromissoryNoteService = {
  async getAllPromissoryNotes(query: any) {
    return listResource(
      'promissory_note',
      query,
      ['customer.name', 'amount'],
      {customer: true},

      { created_at: 'desc' },
    );
  },

  async getPromissoryNotesByCustomer(query: any) {
    return listResource(
      'promissory_note',
      query,
      ['customer.name', 'amount'],
      {},
      { created_at: 'desc' },
      { customer_id: query.customer_id },
    );
  },

  async createPromissoryNote(data: Omit<Promissory_note, "id">): Promise<Promissory_note> {
    return await prisma.promissory_note.create({
      data: {
        ...data,
        created_at: new Date(),
      },
    });
  },

  async getPromissoryNoteById(promissoryNoteId: number) {
    return await prisma.promissory_note.findUnique({
      where: { id: promissoryNoteId },
      include: {
        customer: true,
      },
    });
  },

  async updatePromissoryNote(
    promissoryNoteId: number,
    data: Partial<Omit<Promissory_note, "id">>
  ): Promise<Promissory_note> {
    return await prisma.promissory_note.update({
      where: { id: promissoryNoteId },
      data: {
        ...data,
      },
    });
  },

  async deletePromissoryNote(promissoryNoteId: number): Promise<Promissory_note> {
    return await prisma.promissory_note.delete({
      where: { id: promissoryNoteId },
    });
  },

}