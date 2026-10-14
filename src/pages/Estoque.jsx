// Página usada pelo time de estoque para acompanhar a quantidade de cada produto
export default function Estoque({ produtos, listaEspera }) {
  // slice cria uma cópia, para o sort não alterar a lista original
  const ordenados = produtos.slice().sort((a, b) => a.estoque - b.estoque)
  const interessadosPorProduto = listaEspera.reduce((acumulador, item) => {
    if (!acumulador[item.produtoId]) {
      acumulador[item.produtoId] = []
    }

    acumulador[item.produtoId].push({ nome: item.nome, email: item.email })
    return acumulador
  }, {})

  return (
    <section>
      <p className="sobretitulo">Área interna</p>
      <h1>Estoque</h1>
      <p className="aviso">Produtos com menos de 5 unidades precisam de reposição.</p>

      <div className="tabela-moldura">
        <table className="tabela">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Unidades</th>
              <th>Situação</th>
              <th>Quem está esperando</th>
            </tr>
          </thead>
          <tbody>
            {ordenados.map((produto) => (
              <tr key={produto.id}>
                <td>{produto.title}</td>
                <td>{produto.category}</td>
                <td>{produto.estoque}</td>
                <td>
                  {produto.estoque === 0 && <span className="selo selo-esgotado">Esgotado</span>}
                  {produto.estoque > 0 && produto.estoque < 5 && (
                    <span className="selo selo-alerta">Repor</span>
                  )}
                  {produto.estoque >= 5 && <span className="selo selo-ok">OK</span>}
                </td>
                <td>
                  {interessadosPorProduto[produto.id]?.length ? (
                    <ul>
                      {interessadosPorProduto[produto.id].map((cliente, index) => (
                        <li key={`${produto.id}-${cliente.email}-${index}`}>
                          {cliente.nome} — {cliente.email}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span>Nenhum</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
