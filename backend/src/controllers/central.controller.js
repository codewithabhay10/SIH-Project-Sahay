import Central from "../models/central.model.js";

// GET /api/central
// Returns the central record containing `total_balance` and `total_released`.
// If no record exists, create a default one and return it.
const getCentralInfo = async (req, res) => {
  try {
    let central = await Central.findOne();

    if (!central) {
      central = new Central();
      await central.save();
    }

    return res.json({
      success: true,
      central: {
        id: central._id,
        info: central.info || null,
        total_balance: Number(central.total_balance || 0),
        total_released: Number(central.total_released || 0),
        createdAt: central.createdAt,
        updatedAt: central.updatedAt,
      },
    });
  } catch (err) {
    console.error("getCentralInfo error", err);
    return res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch central info",
        error: err.message,
      });
  }
};

export { getCentralInfo };
