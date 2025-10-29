import { AuthenticatedRequest } from "../types/express";
import { Response } from "express";
import { NoteService } from "../services/note.service";

export const NoteController = {
  async createNote(req: AuthenticatedRequest, res: Response): Promise<void> {
    const data = req.body;
    if (!data || !data.noteable_id || !data.noteable_type || !data.content) {
      res.status(400).json({ error: "Invalid note data" });
      return;
    }

    try {
      const note = await NoteService.createNote(data);
      res.status(201).json(note);
    } catch (error) {
      console.error("Error creating note:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getNotesByEntity(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { entityId, entityType } = req.params;
    if (!entityId || !entityType) {
      res.status(400).json({ error: "Entity ID and type are required" });
      return;
    }

    try {
      const notes = await NoteService.getNotesByEntity(entityId, entityType);
      res.status(200).json(notes);
    } catch (error) {
      console.error("Error fetching notes:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async deleteNote(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "Note ID is required" });
      return;
    }

    try {
      const deletedNote = await NoteService.deleteNote(Number(id));
      res.status(200).json(deletedNote);
    } catch (error) {
      console.error("Error deleting note:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

};
