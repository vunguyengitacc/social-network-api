import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport";
import path from "path";
import { facebookOAuthPassport } from "./config/facebookOAthPassport";
import { connectDB } from "./db/connect";
import MasterRoute from "./route/master.route";
import { cloudinaryConfig } from "./config/cloudiary.config";

require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.use(cookieParser({}));
app.use(cors({}));
app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

facebookOAuthPassport();
connectDB();
MasterRoute(app);
cloudinaryConfig();

app.get("/", (req, res) => {
  res.send("Server is working");
});

app.listen(port, () => console.log(`Server running on port ${port}`));