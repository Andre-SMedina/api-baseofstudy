const router = require("express").Router();

module.exports = router;

router.get("/", (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

router.get("/teste", (req, res) => {
  return res.send("Página teste!");
});

router.get("/teste/teste2", (req, res) => {
  return res.send("Página teste2!");
});
