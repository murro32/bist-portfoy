export default async function handler(req, res) {

  const { symbols } = req.query;

  if (!symbols) {
    return res.status(400).json({ error: "symbols param gerekli" });
  }

  const symbolList = symbols.split(",");
  const results = {};

  try {

    for (const symbol of symbolList) {

      const response = await fetch(
        `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}.IS?interval=1d&range=2d`
      );

      const data = await response.json();

      if (data.chart && data.chart.result) {

        const result = data.chart.result[0];
        const meta = result.meta;
        const closes = result.indicators.quote[0].close;

        const currentPrice = meta.regularMarketPrice;

        // Son kapanış = bir önceki günün close değeri
        const previousClose = closes[closes.length - 2];

        results[symbol] = {
          price: currentPrice,
          prevClose: previousClose
        };

      } else {

        results[symbol] = null;

      }
    }

    return res.status(200).json(results);

  } catch (error) {

    console.error("API ERROR:", error);
    return res.status(500).json({ error: "Yahoo veri alınamadı" });

  }
}
