const RealEstateRevenue = require('../models/RealEstateRevenue');

// ============================================================
// GET REVENUE
// ============================================================
exports.getRevenue = async (req, res) => {
  try {
    let revenue = await RealEstateRevenue.findOne();

    if (!revenue) {
      revenue = await RealEstateRevenue.create({
        transactions: [],
        totalRevenue: 0,
        saleCommissionTotal: 0,
        rentCommissionTotal: 0,
      });
    }

    res.status(200).json({
      success: true,
      data: revenue,
    });
  } catch (error) {
    console.error('Get revenue error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================================
// GET TRANSACTIONS
// ============================================================
exports.getTransactions = async (req, res) => {
  try {
    let revenue = await RealEstateRevenue.findOne();

    if (!revenue) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: [],
      });
    }

    const transactions = [...(revenue.transactions || [])].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};