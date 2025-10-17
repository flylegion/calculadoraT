export const calcularResultados = (datos) => {
  // 🔹 Asegurar que todos los valores sean flotantes válidos
  const totalCoins = datos.reduce((acc, item) => {
    const c = parseFloat(item.coins);
    return acc + (isNaN(c) ? 0.0 : c);
  }, 0.0);

  const totalUsd = datos.reduce((acc, item) => {
    const u = parseFloat(item.usd);
    return acc + (isNaN(u) ? 0.0 : u);
  }, 0.0);

  // 🔹 Evitar división por cero
  const promedio = totalCoins > 0 ? totalUsd / totalCoins : 0.0;

  // 🔹 Calcular -5%
  const promedioMinus5 = promedio * 0.95;

  // 🔹 Devolver con formato final (sin truncar la precisión de cálculo)
  return {
    totalCoins: parseFloat(totalCoins.toFixed(6)),
    totalUsd: parseFloat(totalUsd.toFixed(6)),
    promedio: parseFloat(promedio.toFixed(6)),
    promedioMinus5: parseFloat(promedioMinus5.toFixed(6)),
  };
};