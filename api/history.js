const { db, admin } = require('../firebase');

module.exports = async (req, res) => {
  // Allow only POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { temperature, turbidity, timestamp } = req.body;

  // Validate required data
  if (typeof temperature !== 'number' || typeof turbidity !== 'number' || !timestamp) {
    return res.status(400).json({ error: "Data tidak lengkap atau format salah" });
  }

  try {
    // Parse timestamp safely
    let parsedTimestamp;
    if (!isNaN(Date.parse(timestamp))) {
      parsedTimestamp = admin.firestore.Timestamp.fromDate(new Date(timestamp));
    } else {
      parsedTimestamp = admin.firestore.FieldValue.serverTimestamp();
    }

    await db.collection('history').add({
      temperature,
      turbidity,
      timestamp: parsedTimestamp,
    });

    return res.status(200).json({ message: "✅ Data sensor berhasil disimpan ke history" });
  } catch (error) {
    console.error("❌ Error menyimpan history:", error);
    return res.status(500).json({ error: "Gagal menyimpan data history" });
  }
};
