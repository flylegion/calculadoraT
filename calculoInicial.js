// cálculo inicial
export const calcularInicial = (precio, usd) => {
  // Convertir los valores a flotantes de forma segura
  const p = parseFloat(precio.toString().replace(',', '.'));
  const u = parseFloat(usd.toString().replace(',', '.'));

  // Validar que sean números válidos
  if (isNaN(p) || isNaN(u) || p === 0) return null;

  // Calcular coins como número flotante de precisión completa
  const coinsInicial = u / p;

  return {
    p,
    u,
    coinsInicial: parseFloat(coinsInicial.toFixed(9)), // evitar redondeos imprecisos
  };
};