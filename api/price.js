export default async function handler(req, res) {
  const { symbol } = req.query;

  if (!symbol) {
    return res.status(400).json({ error: "Symbol gerekli" });
  }

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}.IS?interval=1d&range=1d`;
    const response = await fetch(url);
    const data = await response.json();

    const price = data.chart.result[0].meta.regularMarketPrice;

    res.status(200).json({ price });

  } catch (error) {
    res.status(500).json({ error: "Veri alınamadı" });
  }
}
