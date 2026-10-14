import { useState } from 'react'
import { Link, useParams } from 'react-router'

export default function PaginaProduto({ produtos, listaEspera, onAdicionar, onRegistrarInteresse }) {
  const { id } = useParams()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [mensagemAviso, setMensagemAviso] = useState('')

  const produto = produtos.find((item) => item.id === id)

  if (!produto) {
    return (
      <div className="estado-vazio">
        <p>Produto não encontrado.</p>
        <Link to="/" className="botao botao-secundario">
          Voltar para a loja
        </Link>
      </div>
    )
  }

  const relacionados = produtos
    .filter((item) => item.category === produto.category && item.id !== produto.id && item.estoque > 0)
    .slice(0, 4)

  const produtoEsgotado = produto.estoque === 0

  function enviarAviso(evento) {
    evento.preventDefault()

    if (!nome.trim() || !email.trim()) {
      setMensagemAviso('Preencha nome e e-mail para receber o aviso.')
      return
    }

    onRegistrarInteresse(produto.id, nome.trim(), email.trim())
    setNome('')
    setEmail('')
    setMensagemAviso('Você foi adicionado à lista de espera para esse produto.')
  }

  return (
    <section>
      <nav className="trilha" aria-label="Você está em">
        <Link to="/">Loja</Link>
        <span aria-hidden="true">/</span>
        <span>{produto.title}</span>
      </nav>

      <div className="detalhe">
        <div className="detalhe-imagem-moldura">
          <img src={produto.image} alt={produto.title} className="detalhe-imagem" />
        </div>

        <div className="detalhe-info">
          <h1>{produto.title}</h1>
          <p className="card-avaliacao">
            ★ {produto.rating.rate} <span>({produto.rating.count} avaliações)</span>
          </p>
          <p className="detalhe-preco">R$ {produto.price.toFixed(2).replace('.', ',')}</p>
          <p className="detalhe-descricao">{produto.description}</p>
          <p className="detalhe-estoque">
            {produtoEsgotado ? 'Produto esgotado' : `${produto.estoque} unidades disponíveis`}
          </p>

          {!produtoEsgotado && (
            <button
              className="botao botao-grande"
              onClick={() => onAdicionar(produto)}
              disabled={produto.estoque === 0}
            >
              Adicionar ao carrinho
            </button>
          )}

          {produtoEsgotado && (
            <form className="cupom" onSubmit={enviarAviso}>
              <label className="rotulo">Receber aviso quando voltar ao estoque</label>
              <input
                type="text"
                value={nome}
                onChange={(evento) => setNome(evento.target.value)}
                placeholder="Seu nome"
                className="cupom-campo"
              />
              <input
                type="email"
                value={email}
                onChange={(evento) => setEmail(evento.target.value)}
                placeholder="Seu e-mail"
                className="cupom-campo"
              />
              <button type="submit" className="botao botao-grande">
                Avise-me
              </button>
              {mensagemAviso && <p className="mensagem-cupom">{mensagemAviso}</p>}
            </form>
          )}

          <ul className="detalhe-garantias">
            <li>Troca grátis em até 30 dias</li>
            <li>Parcele em até 10x sem juros</li>
          </ul>
        </div>
      </div>

      <h2>Produtos relacionados</h2>
      <div className="grade">
        {relacionados.map((item) => (
          <article key={item.id} className="card">
            <Link to={`/produto/${item.id}`} className="card-link">
              <div className="card-imagem-moldura">
                <img src={item.image} alt={item.title} className="card-imagem" />
              </div>
              <h3 className="card-titulo">{item.title}</h3>
            </Link>
            <p className="preco">R$ {Number(item.price).toFixed(2).replace('.', ',')}</p>
            <button className="botao" onClick={() => onAdicionar(item)}>
              Adicionar ao carrinho
            </button>
          </article>
        ))}
      </div>

      {produtoEsgotado && listaEspera.length > 0 && (
        <div className="lista-espera">
          <h3>Pessoas aguardando esse produto</h3>
          <ul>
            {listaEspera
              .filter((interesse) => interesse.produtoId === produto.id)
              .map((interesse) => (
                <li key={interesse.id}>
                  {interesse.nome} — {interesse.email}
                </li>
              ))}
          </ul>
        </div>
      )}
    </section>
  )
}
