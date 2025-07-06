const { db, admin } = require('../firebase');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { temperature, turbidity, timestamp } = req.body;

  console.log("📥 Data diterima dari ESP32:", req.body);

  // Validasi data
  if (typeof temperature !== 'number') {
    return res.status(400).json({ error: "Temperature harus berupa angka" });
  }

  if (typeof turbidity !== 'number') {
    return res.status(400).json({ error: "Turbidity harus berupa angka" });
  }

  if (!timestamp || typeof timestamp !== 'string') {
    return res.status(400).json({ error: "Timestamp harus berupa string ISO 8601" });
  }

  try {
    let parsedTimestamp;
    const dateObj = new Date(timestamp);

    if (!isNaN(dateObj.getTime())) {
      parsedTimestamp = admin.firestore.Timestamp.fromDate(dateObj);
    } else {
      console.warn("⚠️ Timestamp tidak valid, menggunakan serverTimestamp()");
      parsedTimestamp = admin.firestore.FieldValue.serverTimestamp();
    }

    await db.collection('history').add({
      temperature,
      turbidity,
      timestamp: parsedTimestamp,
    });

    console.log("✅ Data sensor berhasil disimpan ke history");
    return res.status(200).json({ message: "✅ Data sensor berhasil disimpan ke history" });
  } catch (error) {
    console.error("❌ Error menyimpan history:", error);
    return res.status(500).json({ error: "Gagal menyimpan data history" });
  }
};
