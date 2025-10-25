// rondasMultiples.js
export const generarRondas = (numRondas, totalUsdInicial, promedioInicial) => {
  const resultados = [];
  let totalUsd = parseFloat(totalUsdInicial) || 0.0;
  let promedio = parseFloat(promedioInicial) || 0.0;

  for (let i = 1; i <= numRondas; i++) {
    const totalRonda = totalUsd * 1.85;
    const factores = [0.5714, 0.2857, 0.1429];
    const nivelesUsd = factores.map((f) => totalRonda * f);

    const precios = [promedio, promedio * 0.985, promedio * 0.97];
    const labels = ['Inicial', '−1.5%', '−3%'];

    // 🔹 Calculamos coins solo en flotante, el formateo es solo visual
    const datos = precios.map((precio, i) => {
      const p = parseFloat(precio) || 0.0;
      const usdNivel = parseFloat(nivelesUsd[i]) || 0.0;
      const coinsCalculadas = p > 0 ? usdNivel / p : 0.0; // <- flotante real

      return {
        label: labels[i],
        precio: p.toFixed(4),
        coins: coinsCalculadas, // guardamos el número real
        usd: usdNivel.toFixed(6),
      };
    });


    // 🔹 Totales reales
    const totalCoins = datos.reduce((sum, d) => sum + (parseFloat(d.coins) || 0.0), 0.0);
    const totalUsdRonda = datos.reduce((sum, d) => sum + (parseFloat(d.usd) || 0.0), 0.0);

    const promedioRonda =
      precios.reduce((sum, p) => sum + (parseFloat(p) || 0.0), 0.0) / precios.length;
    const promedioMenos5 = promedioRonda * 0.95;

    resultados.push({
      ronda: i+1,
      datos: datos.map((d) => ({
        ...d,
        coins:
          d.coins < 0.000001
            ? d.coins.toExponential(6)
            : d.coins.toFixed(6), // solo aquí se formatea para mostrar
      })),
      totalCoins: parseFloat(totalCoins.toFixed(6)), // flotante real
      totalUsd: parseFloat(totalUsdRonda.toFixed(6)),
      promedio: parseFloat(promedioRonda.toFixed(6)),
      promedioMenos5: parseFloat(promedioMenos5.toFixed(6)),
    });

    totalUsd = totalUsdRonda;
    promedio = promedioMenos5;
  }

  return resultados;
};
