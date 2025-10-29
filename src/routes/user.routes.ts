import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { authorize } from "../middleware/authorize.middleware";

const userRouter = Router();
userRouter.get("/", requireAuth, authorize("admin"), UserController.index);
userRouter.get("/select", requireAuth, UserController.select);
userRouter.post("/change-password/:id", requireAuth, UserController.changePassword);
userRouter.get("/:id", requireAuth, authorize("admin"), UserController.show);
userRouter.post("/", requireAuth, authorize("admin"), UserController.create);   
userRouter.put("/:id", requireAuth, authorize("admin"), UserController.update);
userRouter.delete("/:id", requireAuth, authorize("admin"), UserController.delete);
export default userRouter;