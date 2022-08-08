const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  titulo: String,
  // subtitulos: [{ subtitulo: String, items: [{ item: String, text: String }] }],
  subtitulos: [],
});

const Insert = mongoose.model("BaseDeConhecimento", schema);

module.exports = Insert;
