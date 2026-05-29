import { Router, type IRouter } from "express";
import healthRouter from "./health";
import chairsRouter from "./chairs";
import ergoMatchRouter from "./ergo-match";
import similarChairsRouter from "./similar-chairs";
import uploadRouter from "./upload";

const router: IRouter = Router();

router.use(healthRouter);
router.use(chairsRouter);
router.use(ergoMatchRouter);
router.use(similarChairsRouter);
router.use(uploadRouter);

export default router;
