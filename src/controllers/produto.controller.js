const prisma = require("../config/prisma");
const fetch = require("node-fetch"); // 🔥 IMPORTANTE

// 🔗 comunicação com estoque (AGORA NA PORTA 3003)
async function getEstoqueByProdutoID(produtoId) {
  try {
    const response = await fetch(`http://localhost:3003/estoque/${produtoId}`);

    if (!response.ok) {
      return { mensagem: "Estoque não encontrado" };
    }

    return await response.json();
  } catch (error) {
    return { mensagem: "Serviço de estoque offline" };
  }
}

// GET /produtos
async function getProdutos(req, res, next) {
  try {
    const produtos = await prisma.produto.findMany();
    res.send(produtos);
    next();
  } catch (error) {
    res.send(500, { error: "Erro ao buscar produtos" });
  }
}

// GET /produtos/:id
async function getProdutoByID(req, res, next) {
  try {
    const { id } = req.params;

    const produto = await prisma.produto.findUnique({
      where: { id: Number(id) }
    });

    if (!produto) {
      res.send(404, { error: "Produto não encontrado" });
      return next();
    }

    // 🔥 CHAMANDO O ESTOQUE
    const estoque = await getEstoqueByProdutoID(id);

    res.send({
      produto,
      estoque
    });

    next();
  } catch (error) {
    res.send(500, { error: "Erro ao buscar produto" });
  }
}

// POST /produtos
async function createProduto(req, res, next) {
  try {
    const { nome, preco, descricao, status } = req.body;

    const produto = await prisma.produto.create({
      data: { nome, preco, descricao, status }
    });

    res.send(201, produto);
    next();
  } catch (error) {
    res.send(500, { error: "Erro ao criar produto" });
  }
}

// PATCH /produtos/:id
async function patchProduto(req, res, next) {
  try {
    const { id } = req.params;

    const produto = await prisma.produto.update({
      where: { id: Number(id) },
      data: req.body
    });

    res.send(produto);
    next();
  } catch (error) {
    res.send(500, { error: "Erro ao atualizar produto" });
  }
}

// DELETE /produtos/:id
async function deleteProdutoById(req, res, next) {
  try {
    const { id } = req.params;

    await prisma.produto.update({
      where: { id: Number(id) },
      data: { status: 0 }
    });

    res.send({ message: "Produto desativado" });
    next();
  } catch (error) {
    res.send(500, { error: "Erro ao deletar produto" });
  }
}

module.exports = {
  getProdutos,
  getProdutoByID,
  createProduto,
  patchProduto,
  deleteProdutoById
};