const restify = require("restify");
const ProdutosController = require("./controllers/produtos.controller");

const server = restify.createServer({
  name: "api-produtos-restify"
});

server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

// ROTAS
server.get("/produtos", ProdutosController.getProdutos);
server.get("/produtos/:id", ProdutosController.getProdutoByID);
server.post("/produtos", ProdutosController.createProduto);
server.patch("/produtos/:id", ProdutosController.patchProduto);
server.del("/produtos/:id", ProdutosController.deleteProdutoById);

// PORTA
const PORT = 3001;

server.listen(PORT, () => {
  console.log(`${server.name} rodando em ${server.url}`);
});