const express = require("express");
const exphbs = require("express-handlebars");
const hbs = exphbs.create({ partialsDir: ["views/partials"] });
const app = express();
const conn = require("./database/connect");
const Insert = require("./models/insert");
const port = 4444;

conn();
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// ROTAS----------------------------------

app.get("/", async (req, res) => {
  const list = await Insert.find({}, null, { sort: { titulo: 1 } }).lean();

  res.render("home", { list });
});

app.post("/add", async (req, res) => {
  const { titulo, subtitulo, item, text } = req.body;

  const findTitulo = await Insert.findOne({ titulo: titulo });

  if (!findTitulo) {
    await Insert.create({
      titulo,
      subtitulos: { subtitulo, items: [{ item, text, titulo, subtitulo }] },
    });
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

    items.push({ item, text, titulo, subtitulo });

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
              items: [{ item, text, titulo, subtitulo }],
            },
          },
        }
      );
    }
  }

  res.redirect("/");
});

app.get("/delete/:titulo/:subtitulo/:item", async (req, res) => {
  const { titulo, item, subtitulo } = req.params;
  const findTitulo = await Insert.findOne({ titulo: titulo });
  const items = [];

  findTitulo.subtitulos.forEach((list) => {
    if (list.subtitulo === subtitulo) {
      for (const it of list.items) {
        if (it.item !== item) {
          items.push(it);
        }
      }
    }
  });

  await Insert.updateOne(
    { titulo: findTitulo.titulo, "subtitulos.subtitulo": subtitulo },
    {
      $set: {
        "subtitulos.$.items": items,
      },
    }
  );

  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Acesse: http://localhost:${port}`);
});
