import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { NoteController } from "../controllers/note.controller";

const noteRouter = Router();
noteRouter.post("/", requireAuth, NoteController.createNote);
noteRouter.get("/:entityType/:entityId", requireAuth, NoteController.getNotesByEntity);
noteRouter.delete("/:id", requireAuth, NoteController.deleteNote);

export default noteRouter;