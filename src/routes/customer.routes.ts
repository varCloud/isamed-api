import { Router } from "express";

import { CustomerController } from "../controllers/customer.controller";
import { requireAuth } from "../middleware/auth.middleware";

const customerRouter = Router();

customerRouter.get("/", requireAuth, CustomerController.index);
customerRouter.get("/select", requireAuth, CustomerController.select);
customerRouter.get("/:id", requireAuth, CustomerController.show);
customerRouter.post("/", requireAuth, CustomerController.create);
customerRouter.put("/:id", requireAuth, CustomerController.update);
customerRouter.delete("/:id", requireAuth, CustomerController.delete);

export default customerRouter;
