import { Router } from "express";
import { router as AuthRouter } from "./auth.route.js";
import { router as OrderRouter } from "./order.router.js";
import { router as ViewRouter } from "./views.router.js";

const _router = Router({
  mergeParams: true,
});

_router.use("/auth", AuthRouter);
_router.use("/order", OrderRouter);
_router.use("/", ViewRouter);
export const router = _router;
