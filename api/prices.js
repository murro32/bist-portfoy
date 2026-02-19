// pages/api/prices.js
export default async function handler(req, res) {
  const { symbols } = req.query;

  if (!symbols) {
    return res.status(400).json({ error: "Symbols gerekli" });
  }

  const symbolList = symbols.split(",");

  const results = {};

  try {
    await Promise.all(
      symbolList.map(async (symbol) => {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}.IS?interval=1d&range=2d`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.chart && data.chart.result) {
          const meta = data.chart.result[0].meta;
          results[symbol] = {
            price: meta.regularMarketPrice,
            prevClose: meta.chartPreviousClose || meta.previousClose || meta.regularMarketPreviousClose || meta.regularMarketPreviousClose
          };
        } else {
          results[symbol] = { price: null, prevClose: null };
        }
      })
    );

    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Veri alınamadı" });
  }
}
