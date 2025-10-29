import { Router } from "express";
import { BrandCatController } from "../controllers/brand-cat.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { authorize } from "../middleware/authorize.middleware";

const brandCatRouter = Router();
brandCatRouter.post("/",requireAuth,authorize("admin", "agent"),BrandCatController.createBrandCat);
brandCatRouter.get("/", requireAuth, authorize("admin", "agent"), BrandCatController.getAllBrandCats);
brandCatRouter.put("/:id", requireAuth, authorize("admin", "agent"), BrandCatController.updateBrandCat);
brandCatRouter.delete("/:id", requireAuth, authorize("admin", "agent"), BrandCatController.deleteBrandCat);
brandCatRouter.get("/select", requireAuth, authorize("admin", "agent", "engineer"), BrandCatController.getBrandCatToSelect);

export default brandCatRouter;