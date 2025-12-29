
import problemRoute from "./problem.route.js"
import testCaseRoute from "./testcase.route.js"
export default (app) => {
  app.use("/admin/problems",problemRoute); 
  app.use("/admin/testcase",testCaseRoute)
};