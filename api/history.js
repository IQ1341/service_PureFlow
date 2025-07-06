const { db } = require('../firebase');

module.exports = async (req, res) => {
  // Allow only POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { temperature, turbidity, timestamp } = req.body;

  // Log incoming data for debugging
  console.log("📥 Incoming data:", { temperature, turbidity, timestamp });

  // Validate required data
  if (typeof temperature !== 'number' || typeof turbidity !== 'number' || !timestamp) {
    console.log("❌ Data tidak lengkap atau format salah");
    return res.status(400).json({ error: "Data tidak lengkap atau format salah" });
  }

  try {
    // Store timestamp as string or date directly
    const saveResult = await db.collection('history').add({
      temperature,
      turbidity,
      timestamp, // simpan langsung tanpa diubah menjadi Firestore Timestamp
    });

    console.log("✅ Data sensor berhasil disimpan ke history dengan ID:", saveResult.id);

    return res.status(200).json({ message: "✅ Data sensor berhasil disimpan ke history" });
  } catch (error) {
    console.error("❌ Error menyimpan history:", error);
    return res.status(500).json({ error: "Gagal menyimpan data history", details: error.message });
  }
};
