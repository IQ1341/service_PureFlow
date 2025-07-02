const { db } = require('../firebase');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { temperature, turbidity, createdAt } = req.body;

  if (temperature === undefined || turbidity === undefined || !createdAt) {
    return res.status(400).json({ error: "Data tidak lengkap" });
  }

  try {
    await db.collection('history')
      .add({
        temperature,
        turbidity,
        createdAt: new Date(createdAt),
      });

    return res.status(200).json({ message: "Data sensor berhasil disimpan ke history" });
  } catch (error) {
    console.error("❌ Error menyimpan history:", error);
    return res.status(500).json({ error: "Gagal menyimpan data history" });
  }
};
