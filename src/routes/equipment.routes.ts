import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { authorize } from "../middleware/authorize.middleware";
import { EquipmentController } from "../controllers/equipment.controller";

const equipmentRouter = Router();

equipmentRouter.post(
    "/",
    requireAuth,
    authorize("admin", "agent"),
    EquipmentController.createEquipment
);

equipmentRouter.put(
    "/:id",
    requireAuth,
    authorize("admin", "agent"),
    EquipmentController.updateEquipment
);

equipmentRouter.delete(
    "/:id",
    requireAuth,
    authorize("admin", "agent"),
    EquipmentController.deleteEquipment
);

export default equipmentRouter;
