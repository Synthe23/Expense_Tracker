const router = require('express').Router();
const auth = require('../middleware/auth');
const Expense = require('../models/Expense');

// @route  GET /api/expenses/monthly?year=&month=
router.get('/monthly', auth, async (req, res) => {
  try {
    const { year, month } = req.query;
    if (!year || !month) return res.status(400).json({ message: 'year and month are required' });

    const start = new Date(Number(year), Number(month) - 1, 1);
    const end = new Date(Number(year), Number(month), 0, 23, 59, 59, 999);

    const expenses = await Expense.find({
      user: req.user.id,
      date: { $gte: start, $lte: end },
    }).sort({ date: 1, createdAt: 1 });

    res.json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route  GET /api/expenses  (all for user)
router.get('/', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 }).limit(200);
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route  POST /api/expenses
router.post('/', auth, async (req, res) => {
  try {
    const { itemName, amount, date, note } = req.body;
    if (!itemName || amount === undefined || !date)
      return res.status(400).json({ message: 'itemName, amount and date are required' });

    const expense = new Expense({
      user: req.user.id,
      itemName,
      amount: Number(amount),
      date: new Date(date),
      note: note || '',
    });

    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route  PUT /api/expenses/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const { itemName, amount, date, note } = req.body;

    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      {
        ...(itemName && { itemName }),
        ...(amount !== undefined && { amount: Number(amount) }),
        ...(date && { date: new Date(date) }),
        ...(note !== undefined && { note }),
      },
      { new: true }
    );

    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json(expense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route  DELETE /api/expenses/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json({ message: 'Expense deleted', id: req.params.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
