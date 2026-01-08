import problemRoute from "./problem.route.js";
import authRouter from "./auth.route.js"
import { authMiddleware } from '../../middlewares/auth.middleware.js';
export default (app) => {
  app.use("/auth",authRouter)
  app.use("/problem",authMiddleware, problemRoute);  
};
