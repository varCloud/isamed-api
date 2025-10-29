import prisma from "../config/prisma";

import { Note } from "@prisma/client";

export const NoteService = {
  async createNote(data: Omit<Note, "id">): Promise<Note> {
    return await prisma.note.create({ data: {
      content: data.content,
      user_id: data.user_id,
      noteable_id: Number(data.noteable_id),
      noteable_type: data.noteable_type,
      note_type: data.note_type || 'default', 
      created_at: new Date(),
    } });
  },

  async getNotesByEntity(entityId: number, entityType: 'Order' | 'Repair_report'): Promise<Note[]> {
    return await prisma.note.findMany({ where: { noteable_id: Number(entityId), noteable_type: entityType } });
  },


  async getNoteById(id: number): Promise<Note | null> {
    return await prisma.note.findUnique({ where: { id } });
  },

  async updateNote(id: number, data: Partial<Omit<Note, "id">>): Promise<Note> {
    return await prisma.note.update({
      where: { id },
      data,
    });
  },

  async deleteNote(id: number): Promise<Note> {
    return await prisma.note.delete({ where: { id } });
  },
};