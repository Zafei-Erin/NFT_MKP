import express from "express";
import { errorHandler } from "./middlewares/errorHandler";
import router from "./router";

const app = express();

const port = process.env.PORT || 4000;

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "PUT, POST, PATCH, GET, DELETE, OPTIONS"
  );
  next();
});
app.use(errorHandler);
app.use(router);

app.listen(port, () => console.log(`Server running on port ${port}`));

