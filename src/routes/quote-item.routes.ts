import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { authorize } from "../middleware/authorize.middleware";
import { QuoteItemController } from "../controllers/quote-item.controller";

const quoteItemRouter = Router();
quoteItemRouter.post('/', requireAuth, authorize('admin', 'agent'), QuoteItemController.create);
quoteItemRouter.put('/:id', requireAuth, authorize('admin', 'agent'), QuoteItemController.update);
quoteItemRouter.delete('/:id', requireAuth, authorize('admin', 'agent'), QuoteItemController.delete);

export default quoteItemRouter;