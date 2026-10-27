const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/auth');
const {
  getRevenue,
  toggleSecurities,
  addIncome,
  addExpense,
  addSecurity,
  settleSecurity,
  getTransactions,
  deleteTransaction,
} = require('../controllers/revenueController');

// ✅ All routes protected
router.use(verifyToken);
router.use(checkRole(['admin', 'moderator', 'super_admin']));

// ✅ Revenue routes
router.get('/', getRevenue);
router.get('/transactions', getTransactions);
router.put('/toggle-securities', toggleSecurities);

// ✅ Add transactions
router.post('/income', addIncome);
router.post('/expense', addExpense);
router.post('/security', addSecurity);
router.post('/security/settle', settleSecurity);

// ✅ Delete transaction (admin & super_admin only)
router.delete('/transaction/:transactionId', checkRole(['admin', 'super_admin']), deleteTransaction);

module.exports = router;
