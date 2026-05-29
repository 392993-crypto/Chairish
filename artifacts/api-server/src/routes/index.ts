import { Router, type IRouter } from "express";
import healthRouter from "./health";
import chairsRouter from "./chairs";
import ergoMatchRouter from "./ergo-match";
import similarChairsRouter from "./similar-chairs";

const router: IRouter = Router();

router.use(healthRouter);
router.use(chairsRouter);
router.use(ergoMatchRouter);
router.use(similarChairsRouter);

export default router;
