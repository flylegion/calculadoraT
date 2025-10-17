// rondaDos.js
export const rondaDos = ({ totalUsd, promedioMinus5 }) => {
  const p = promedioMinus5;
  const nuevoTotal = totalUsd * 2; // Total total debe ser el doble del anterior

  // Distribuimos en una progresión geométrica 1x, 2x, 4x → suma = 7x
  const baseUsd = nuevoTotal / 7;

  // Calculamos las cantidades de coins según el precio
  const coinsInicial = baseUsd / p;
  const coins1 = (baseUsd * 2) / p;
  const coins2 = (baseUsd * 4) / p;

  const precios = [p, p * 0.985, p * 0.97];
  const coins = [coinsInicial, coins1, coins2];
  const labels = ['Inicial', '−1.5%', '−3%'];

  const datos = precios.map((precio, i) => ({
    label: labels[i],
    precio: precio.toFixed(4),
    coins: coins[i].toFixed(0),
    usd: (coins[i] * precio).toFixed(2),
  }));

  return datos;
};