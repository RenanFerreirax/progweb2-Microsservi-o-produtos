const prisma = require("../config/prisma");
const fetch = require("node-fetch");

// 🔗 estoque (porta 3003)
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

// GET TODOS
async function getProdutos(req, res, next) {
  try {
    const produtos = await prisma.produto.findMany();
    res.send(produtos);
    next();
  } catch (error) {
    res.send(500, { error: "Erro ao buscar produtos" });
  }
}

// GET POR ID + ESTOQUE
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

    const estoque = await getEstoqueByProdutoID(id);

    res.send({ produto, estoque });
    next();
  } catch (error) {
    res.send(500, { error: "Erro ao buscar produto" });
  }
}

// POST
async function createProduto(req, res, next) {
  try {
    const {
      nome, preco, descricao, status,
      categoria, marca, tamanho, genero
    } = req.body;

    const produto = await prisma.produto.create({
      data: {
        nome, preco, descricao, status,
        categoria, marca, tamanho, genero
      }
    });

    res.send(201, produto);
    next();
  } catch (error) {
    res.send(500, { error: "Erro ao criar produto" });
  }
}

// PATCH
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

// DELETE (soft delete)
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

// 🔍 FILTROS

async function getByCategoria(req, res, next) {
  const produtos = await prisma.produto.findMany({
    where: { categoria: req.params.categoria }
  });
  res.send(produtos);
  next();
}

async function getByName(req, res, next) {
  const produtos = await prisma.produto.findMany({
    where: { nome: { contains: req.params.nome } }
  });
  res.send(produtos);
  next();
}

async function getByPrice(req, res, next) {
  const produtos = await prisma.produto.findMany({
    where: { preco: Number(req.params.preco) }
  });
  res.send(produtos);
  next();
}

async function getByPostDate(req, res, next) {
  const produtos = await prisma.produto.findMany({
    where: { createdAt: new Date(req.params.data) }
  });
  res.send(produtos);
  next();
}

async function getByTam(req, res, next) {
  const produtos = await prisma.produto.findMany({
    where: { tamanho: req.params.tamanho }
  });
  res.send(produtos);
  next();
}

async function getByGender(req, res, next) {
  const produtos = await prisma.produto.findMany({
    where: { genero: req.params.genero }
  });
  res.send(produtos);
  next();
}

async function getByBrand(req, res, next) {
  const produtos = await prisma.produto.findMany({
    where: { marca: req.params.marca }
  });
  res.send(produtos);
  next();
}

module.exports = {
  getProdutos,
  getProdutoByID,
  createProduto,
  patchProduto,
  deleteProdutoById,
  getByCategoria,
  getByName,
  getByPrice,
  getByPostDate,
  getByTam,
  getByGender,
  getByBrand
};