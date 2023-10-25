import { Router } from "express";
import { methods } from "../methods.js";

const _router = Router({
  mergeParams: true,
});

const getMethods = async (req, res) => {
  const keys = Object.keys(methods);
  res.status(200).json({ methods: keys });
};

_router.route("/methods").get(getMethods);
export const router = _router;
