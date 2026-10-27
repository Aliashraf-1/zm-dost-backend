const {
  getOrCreateRevenue,
  recalculate,
  recordIncome,
  recordExpense,
  recordSecurityReceived,
  settleSecurity,
  buildTransactions,
  filterRevenueData,
} = require('../utils/revenueLedger');

exports.getRevenue = async (req, res) => {
  try {
    const { buildingId, shift } = req.query;
    const revenue = await getOrCreateRevenue();

    if (!buildingId && !shift) {
      const stats = recalculate(revenue);
      await revenue.save();

      return res.status(200).json({
        success: true,
        data: revenue,
        stats,
      });
    }

    const filteredRevenue = await filterRevenueData(revenue, { buildingId, shift });
    const stats = recalculate(filteredRevenue);

    res.status(200).json({
      success: true,
      data: filteredRevenue,
      stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.toggleSecurities = async (req, res) => {
  try {
    const revenue = await getOrCreateRevenue();
    revenue.includeSecurities = !revenue.includeSecurities;
    const stats = recalculate(revenue);
    await revenue.save();

    res.status(200).json({
      success: true,
      message: `Securities ${revenue.includeSecurities ? 'included' : 'excluded'} successfully.`,
      data: revenue,
      stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.addIncome = async (req, res) => {
  try {
    const incomeData = { ...req.body };

    if (incomeData.type === 'Rent' && incomeData.rentPayment) {
      incomeData.unitNo = incomeData.rentPayment.unitNo || incomeData.unitNo;
      incomeData.tenantName = incomeData.rentPayment.tenantName || incomeData.tenantName;
      incomeData.amount = incomeData.rentPayment.amount || incomeData.amount;
    }

    const revenue = await recordIncome(incomeData);

    res.status(201).json({
      success: true,
      message: 'Income added successfully.',
      data: revenue,
    });
  } catch (error) {
    console.error('Add income error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.addExpense = async (req, res) => {
  try {
    const revenue = await recordExpense(req.body);

    res.status(201).json({
      success: true,
      message: 'Expense added successfully.',
      data: revenue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.addSecurity = async (req, res) => {
  try {
    const revenue = await recordSecurityReceived(req.body);

    res.status(201).json({
      success: true,
      message: 'Security added successfully.',
      data: revenue,
    });
  } catch (error) {
    console.error('Add security error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.settleSecurity = async (req, res) => {
  try {
    const revenue = await settleSecurity(req.body);

    res.status(201).json({
      success: true,
      message: 'Security settlement recorded successfully.',
      data: revenue,
    });
  } catch (error) {
    console.error('Settle security error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const { buildingId, shift } = req.query;
    const revenue = await getOrCreateRevenue();
    const transactions = await buildTransactions(revenue, { buildingId, shift });

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

exports.deleteTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const revenue = await getOrCreateRevenue();

    let deleted = false;

    // Check income
    const incomeIdx = (revenue.income || []).findIndex(
      (item) => item.id === transactionId || String(item._id) === transactionId
    );
    if (incomeIdx !== -1) {
      revenue.income.splice(incomeIdx, 1);
      deleted = true;
    }

    // Check expenses
    if (!deleted) {
      const expenseIdx = (revenue.expenses || []).findIndex(
        (item) => item.id === transactionId || String(item._id) === transactionId
      );
      if (expenseIdx !== -1) {
        revenue.expenses.splice(expenseIdx, 1);
        deleted = true;
      }
    }

    // Check securities
    if (!deleted) {
      const securityIdx = (revenue.securities || []).findIndex(
        (item) => item.id === transactionId || String(item._id) === transactionId
      );
      if (securityIdx !== -1) {
        revenue.securities.splice(securityIdx, 1);
        deleted = true;
      }
    }

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found.',
      });
    }

    const stats = recalculate(revenue);
    await revenue.save();

    res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully.',
      data: revenue,
      stats,
    });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
