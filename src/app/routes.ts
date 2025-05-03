import {
  type NextFunction,
  type Request,
  type Response,
  Router,
} from "express";
import { modulerRoutes } from "../routes";
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

// all Routes
// biome-ignore lint/complexity/noForEach: <explanation>
// Load all routes with error handling
modulerRoutes.forEach(({ path, route }) => {
  console.log(`Mounting route: ${path}`); // Debug logging
  routes.use(path, route);
});
export default routes;
