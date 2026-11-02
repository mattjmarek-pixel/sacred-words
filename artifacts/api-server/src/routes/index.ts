import { Router, type IRouter } from "express";
import healthRouter from "./health";
import prayersRouter from "./prayers";

const router: IRouter = Router();

router.use(healthRouter);
router.use(prayersRouter);

export default router;
