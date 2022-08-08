const express = require("express");
const exphbs = require("express-handlebars");
const hbs = exphbs.create({ partialsDir: ["views/partials"] });
const app = express();
const conn = require("./database/connect");
const Insert = require("./models/Insert");

conn();
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// ROTAS----------------------------------

app.get("/", async (req, res) => {
  const list = await Insert.find({}).lean();
  const subs = [];
  let c = 0;

  // for (const it of list) {
  //   console.log(it.titulo);
  //   for (const it2 of it.subtitulos) {
  //     console.log(it2.subtitulo);
  //   }
  // }

  res.render("home", { list });
});

app.post("/add", async (req, res) => {
  const { titulo, subtitulo, item, text } = req.body;
  let subs = [];

  const findTitulo = await Insert.findOne({ titulo: titulo });

  if (!findTitulo) {
    await Insert.create({
      titulo,
      subtitulos: { subtitulo, items: [{ item, text }] },
    });

    // const data = await Insert.findOne({ titulo: titulo });
    // console.log(data);
  } else if (findTitulo) {
    const items = [];
    const subT = [];

    findTitulo.subtitulos.forEach((item) => {
      subT.push(item.subtitulo);
      if (item.subtitulo === subtitulo) {
        for (const it of item.items) {
          items.push(it);
        }
      }
    });

    items.push({ item, text });

    if (subT.includes(subtitulo)) {
      await Insert.updateOne(
        { titulo: findTitulo.titulo, "subtitulos.subtitulo": subtitulo },
        {
          $set: {
            "subtitulos.$.items": items,
          },
        }
      );
    } else {
      await Insert.findByIdAndUpdate(
        { _id: findTitulo.id },
        {
          $push: {
            subtitulos: {
              subtitulo,
              items: [{ item, text }],
            },
          },
        }
      );
    }
  }

  res.redirect("/");
});

app.get("/delete/:titulo/:item", async (req, res) => {
  const { titulo, item } = req.params;

  await Insert.findOneAndUpdate(
    { titulo: titulo, "items.item": item },
    { $pull: { "items.$.item": "foi" } }
  );

  res.redirect("/");
});

app.listen(3002);
