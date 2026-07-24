import { Router } from "express";
import { registerPurchase, registerVisit } from "./controllers/analyticsController.js";

const router = Router();

router.get("/api/visit", registerVisit);
router.post("/api/purchase", registerPurchase);

export default router;
