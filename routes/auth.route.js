import { Router } from "express";
import authController from "../controllers/auth.controller.js";

const _router = Router({
  mergeParams: true,
});

_router.route("/nonce").get(authController.getNonce);
_router.route("/verify").post(authController.verifyNonce);
_router.route("/create").post(authController.createUser);
_router.route("/status").get(authController.checkStatus);
export const router = _router;
