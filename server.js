
import express from "express";
import dotenv from "dotenv"

const app = express();
dotenv.config();
// middleware
//app.use(cors());
app.use(express.json());

// route test
// app.get("/", (req, res) => {
//     res.send({ message: "Backend Node.js + Express đang chạy!" });
// });

//ket noi database
import *as database from "./src/config/database.js"
database.connect();

//route
import routeClient from "./src/router/client/index.route.js"
import routeAdmin from "./src/router/admin/index.route.js"


// chạy server

routeClient(app);
routeAdmin(app);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server đang chạy ở port ${PORT}`);
});
