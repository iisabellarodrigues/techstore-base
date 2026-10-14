const CUPONS = {
  PRIMEIRACOMPRA: 0.1,
}

export function validarCupom(codigo, cliente) {
  const codigoNormalizado = String(codigo ?? '').trim().toUpperCase()
  const desconto = CUPONS[codigoNormalizado]

  if (!codigoNormalizado || !desconto) {
    return { valido: false }
  }

  return { valido: true, desconto }
}
