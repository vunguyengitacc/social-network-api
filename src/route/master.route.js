import checkToken from "../middleware/checkToken.middleware";
import AuthRouter from "../modules/Auth/auth.route";
import NotificationRouter from "../modules/Notification/notification.route";
import StoryRouter from "../modules/Story/story.route";
import UserRouter from "../modules/User/user.route";

const MasterRoute = (app) => {
  app.use("/api/auth", AuthRouter);
  app.use("/api/users", checkToken, UserRouter);
  app.use("/api/stories", checkToken, StoryRouter);
  app.use("/api/notifications", checkToken, NotificationRouter);
};

export default MasterRoute;
