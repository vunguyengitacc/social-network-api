import http from "http";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport";
import path from "path";
import { facebookOAuthPassport } from "./config/facebookOAthPassport";
import { connectDB } from "./db/connect";
import MasterRoute from "./route/master.route";
import { cloudinaryConfig } from "./config/cloudiary.config";
import multerUploader from "./config/multer.config";
import { morganCustom } from "./config/morgan.custom";
import * as io from "socket.io";

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.use(morganCustom);
app.use(cookieParser({}));
app.use(cors({}));
app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(multerUploader.array("file"));

facebookOAuthPassport();
connectDB();
MasterRoute(app);
cloudinaryConfig();

app.get("/", (req, res) => {
  res.send("Server is working");
});

app.listen(port, () => console.log(`Server running on port ${port}`));

const socketServer = new io.Server(http.createServer().listen(8000), {
  cors: { origin: process.env.CLIENT_URL },
});
socketServer.on("connection", (socketId) => {
  console.log(socketId.id, "join socket");
});
export { socketServer };
