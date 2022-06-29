const express = require("express");
const exphbs = require("express-handlebars");
const hbs = exphbs.create({ partialsDir: ["views/partials"] });
const port = process.env.PORT || 8080;
const app = express();
// const indexRoute = require("./routes/index");
const connectDB = require("./database/connect");

connectDB();
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.use(express.static("routes/public"));
app.use(express.json());

// app.use("/", indexRoute);

app.get('/', (req, res) => {
    res.render('home')
})

app.listen(port, () => console.log(`Rodando na porta ${port}.`));
