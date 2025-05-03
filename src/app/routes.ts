import {
  type NextFunction,
  type Request,
  type Response,
  Router,
} from "express";
import { modulerRoutes } from "../routes";
import { userRoutes } from "../modules/user/user.routes";
import { authRoutes } from "../modules/auth/auth.routes";
const routes = Router();

routes.get("/health", (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({
      status: 200,
      message: "success",
    });
  } catch (error) {
    next(error);
  }
});

console.log("Validating routes...");

routes.use("/user", userRoutes);
routes.use("/auth", authRoutes);

export default routes;
