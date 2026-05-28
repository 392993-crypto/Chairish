import { Router, type IRouter } from "express";
import healthRouter from "./health";
import chairsRouter from "./chairs";

const router: IRouter = Router();

router.use(healthRouter);
router.use(chairsRouter);

export default router;
