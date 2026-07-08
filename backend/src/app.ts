import express, { Application } from "express";
import cors from "cors";
import { env } from "./config/env";
import { initSentry, Sentry } from "./config/sentry";
import routes from "./routes";
import { errorMiddleware, notFoundMiddleware } from "./middlewares/error.middleware";

initSentry();

export function createApp(): Application {
  const app = express();

  app.use(cors({ origin: env.corsOrigin }));
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.use("/api", routes);

  app.use(notFoundMiddleware);
  Sentry.setupExpressErrorHandler(app);
  app.use(errorMiddleware);

  return app;
}
