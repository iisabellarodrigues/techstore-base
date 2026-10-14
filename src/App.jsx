import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router'
import Header from './components/Header'
import Footer from './components/Footer'
import RolarParaTopo from './components/RolarParaTopo'
import Loja from './pages/Loja'
import PaginaProduto from './pages/PaginaProduto'
import Carrinho from './pages/Carrinho'
import Estoque from './pages/Estoque'
import { buscarProdutos } from './services/produtos'
import { buscarClientes } from './services/clientes'
import { sanitizarProdutoParaCarrinho } from './utils/carrinho'

export default function App() {
  const [produtos, setProdutos] = useState([])
  const [listaEspera, setListaEspera] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [carrinho, setCarrinho] = useState([])
  const [clientes, setClientes] = useState([])
  const [clienteAtualId, setClienteAtualId] = useState(null)

  useEffect(() => {
    buscarProdutos()
      .then((dados) => {
        const produtosValidos = dados.filter(
          (produto) =>
            produto &&
            produto.price !== null &&
            produto.price !== undefined &&
            produto.price !== '' &&
            Number.isFinite(Number(produto.price)) &&
            Number(produto.price) > 0
        )

        setProdutos(produtosValidos)
      })
      .catch(() => setErro('Não foi possível carregar os produtos.'))
      .finally(() => setCarregando(false))

    buscarClientes().then((dados) => {
      setClientes(dados)
      if (dados.length > 0) setClienteAtualId(dados[0].id)
    })
  }, [])

  const produtosEmLoja = produtos.filter((produto) => produto.estoque > 0)

  function adicionarAoCarrinho(produto) {
    const produtoValido = sanitizarProdutoParaCarrinho(produto)

    if (!produtoValido) {
      return
    }

    setCarrinho((carrinhoAtual) => carrinhoAtual.concat(produtoValido))
  }

  function registrarInteresse(produtoId, nome, email) {
    setListaEspera((atual) => [
      ...atual,
      {
        id: Date.now() + Math.random(),
        produtoId,
        nome,
        email,
      },
    ])
  }

  function removerUmaUnidade(produtoId) {
    // Remove só a primeira unidade encontrada do produto
    let removido = false
    setCarrinho(
      carrinho.filter((produto) => {
        if (!removido && produto.id === produtoId) {
          removido = true
          return false
        }
        return true
      })
    )
  }

  const clienteAtual = clientes.find((cliente) => cliente.id === clienteAtualId)

  return (
    <div className="app">
      <RolarParaTopo />
      <Header carrinho={carrinho} clienteAtual={clienteAtual} />

      <main className="conteudo">
        {carregando && <p className="aviso">Carregando produtos...</p>}
        {erro && <p className="aviso aviso-erro">{erro}</p>}

        {!carregando && !erro && (
          <Routes>
            <Route
              path="/"
              element={<Loja produtos={produtosEmLoja} onAdicionar={adicionarAoCarrinho} />}
            />
            <Route
              path="/produto/:id"
              element={
                <PaginaProduto
                  produtos={produtos}
                  listaEspera={listaEspera}
                  onAdicionar={adicionarAoCarrinho}
                  onRegistrarInteresse={registrarInteresse}
                />
              }
            />
            <Route
              path="/carrinho"
              element={
                <Carrinho
                  carrinho={carrinho}
                  produtos={produtos}
                  clienteAtual={clienteAtual}
                  onAdicionar={adicionarAoCarrinho}
                  onRemover={removerUmaUnidade}
                />
              }
            />
            <Route
              path="/estoque"
              element={<Estoque produtos={produtos} listaEspera={listaEspera} />}
            />
          </Routes>
        )}
      </main>

      <Footer
        clientes={clientes}
        clienteAtualId={clienteAtualId}
        onTrocarCliente={setClienteAtualId}
      />
    </div>
  )
}
