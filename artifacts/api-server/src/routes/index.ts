import { Router, type IRouter } from "express";
import healthRouter from "./health";
import accountRouter from "./account";
import prayersRouter from "./prayers";

const router: IRouter = Router();

router.use(healthRouter);
router.use(accountRouter);
router.use(prayersRouter);

export default router;
