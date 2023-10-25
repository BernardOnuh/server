import { Router } from "express";
import orderControler from "../controllers/order.controller.js";
const _router = Router({
  mergeParams: true,
});

_router.route("/buy").post(orderControler.buyToken);
_router.route("/sell").post(orderControler.sellToken);
_router.route("/snipe").post(orderControler.snipeToken);
_router.route("/buy-limit-order").post(orderControler.buylimitOrder);
_router.route("/sell-limit-order").post(orderControler.selllimitOrder);
_router.route("/buy-limit-order").get(orderControler.getAllBuyLimitOrders);
_router.route("/sell-limit-order").get(orderControler.getAllSellLimitOrders);

export const router = _router;
