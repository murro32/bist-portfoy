export default async function handler(req, res) {
  const { symbols } = req.query;

  if (!symbols) {
    return res.status(400).json({ error: "Symbols gerekli" });
  }

  try {
    const symbolList = symbols.split(",");

    const results = {};

    await Promise.all(
      symbolList.map(async (symbol) => {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}.IS?interval=1d&range=1d`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.chart && data.chart.result) {
          results[symbol] =
            data.chart.result[0].meta.regularMarketPrice;
        } else {
          results[symbol] = null;
        }
      })
    );

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası" });
  }
}
