// cálculo de puntos
export const calcularPuntos = ({ p, coinsInicial }) => {
  // Asegurar flotantes
  const precioBase = parseFloat(p);
  const coinsBase = parseFloat(coinsInicial);

  if (isNaN(precioBase) || isNaN(coinsBase)) return [];

  const coins1 = coinsBase * 2.0;
  const coins2 = coinsBase * 4.0;

  const precios = [precioBase, precioBase * 0.985, precioBase * 0.97];
  const coins = [coinsBase, coins1, coins2];
  const labels = ['Inicial', '−1.5%', '−3%'];

  const datos = precios.map((precio, i) => {
    const precioFloat = parseFloat(precio);
    const coinsFloat = parseFloat(coins[i]);
    const usdFloat = coinsFloat * precioFloat;

    return {
      label: labels[i],
      precio: precioFloat.toFixed(4),
      coins:
        coinsFloat < 0.000001
          ? coinsFloat.toExponential(6)
          : coinsFloat.toFixed(6),
      usd: usdFloat.toFixed(6),
    };
  });

  return datos;
};