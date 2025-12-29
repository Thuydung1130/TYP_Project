
import problemRoute from "./problem.route.js"
export default (app) => {
  app.use("/admin/problems",problemRoute); 
};