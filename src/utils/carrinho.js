// O carrinho guarda uma entrada por unidade adicionada.
// Ex.: duas camisetas iguais = o mesmo produto duas vezes no array.

export function precoValido(produto) {
  const valor = Number(produto?.price)
  return produto && Number.isFinite(valor) && valor > 0
}

export function sanitizarProdutoParaCarrinho(produto) {
  if (!precoValido(produto)) {
    return null
  }

  return {
    ...produto,
    price: Number(produto.price),
  }
}

export function calcularTotal(carrinho) {
  return carrinho.reduce((total, produto) => {
    if (!precoValido(produto)) {
      return total
    }

    return total + Number(produto.price)
  }, 0)
}

export function agruparItens(carrinho) {
  const itens = []
  carrinho
    .filter((produto) => precoValido(produto))
    .forEach((produto) => {
      const existente = itens.find((item) => item.produto.id === produto.id)
      if (existente) {
        existente.quantidade += 1
      } else {
        itens.push({ produto, quantidade: 1 })
      }
    })
  return itens
}
