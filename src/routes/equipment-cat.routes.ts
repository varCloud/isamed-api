import { Router } from "express";
import { EquipmentCatController } from "../controllers/equipment-cat.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { authorize } from "../middleware/authorize.middleware";
const equipmentCatRouter = Router();
equipmentCatRouter.post("/", requireAuth, authorize("admin", "agent"), EquipmentCatController.createEquipmentCat);
equipmentCatRouter.get("/", requireAuth, authorize("admin", "agent"), EquipmentCatController.getAllEquipmentCats);
equipmentCatRouter.put("/:id", requireAuth, authorize("admin", "agent"), EquipmentCatController.updateEquipmentCat);
equipmentCatRouter.delete("/:id", requireAuth, authorize("admin", "agent"), EquipmentCatController.deleteEquipmentCat);
equipmentCatRouter.get("/select", requireAuth, authorize("admin", "agent", "engineer"), EquipmentCatController.getEquipmentCatToSelect);

export default equipmentCatRouter;