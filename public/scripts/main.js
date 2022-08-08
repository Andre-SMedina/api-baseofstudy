const insTit = document.querySelector("#insTitulo");

function edit(tit) {
  console.log(tit);
  const name = tit.id;
  insTit.value = name;
}
