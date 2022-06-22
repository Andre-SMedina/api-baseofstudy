const express = require("express");
const port = 8080;
const app = express();
const indexRoute = require("./routes/index");
const connectDB = require("./database/connect");

connectDB();
app.use(express.json());
app.listen(port, () => console.log(`Rodando na porta ${port}.`));

app.use("/", indexRoute);
