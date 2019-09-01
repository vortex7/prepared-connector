const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");

// Read config into env
const config = require("../config.json");
const nodeEnvironment = process.env.NODE_ENV || "dev";
const env = config[nodeEnvironment];
process.env = Object.assign(process.env, env);

const ModelRoutes = require("./routes/model-routes");
const AppRoutes = require("./routes/app-routes");

const app = express();
const port = process.env.port;

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(cors());

// routes
const router = express.Router();

ModelRoutes.getRoutes(router);
AppRoutes.getRoutes(router);

app.use("/", router);

// start the Express server
app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
