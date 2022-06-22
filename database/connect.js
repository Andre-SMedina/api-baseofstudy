const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@cluster0.rnsitng.mongodb.net/?retryWrites=true&w=majority`,
    (error) => {
      if (error) {
        return console.log("Ocorreu um erro ao se conectar ao banco de dados.");
      }
      return console.log("Conexão com o banco de dados realizado com sucesso!");
    }
  );
};

module.exports = connectDB;
