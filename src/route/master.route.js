import checkToken from "../middleware/checkToken.middleware";
import AuthRouter from "../modules/Auth/auth.route";
import StoryRouter from "../modules/Story/story.route";
import UserRouter from "../modules/User/user.route";

const MasterRoute = (app) => {
  app.use("/api/auth", AuthRouter);
  app.use("/api/users", checkToken, UserRouter);
  app.use("/api/stories", checkToken, StoryRouter);
};

export default MasterRoute;
