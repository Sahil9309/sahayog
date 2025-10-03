const Contribution = require('../models/Contribution.js');
const Event = require('../models/Event.js');
const User = require('../models/User.js');

// POST /contributions
const createContribution = async (req, res) => {
  try {
    const { eventId, amount, email, transactionId, invoiceNumber, paymentMethod } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!eventId || !amount || !email || !transactionId || !invoiceNumber) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Create contribution record
    const contribution = await Contribution.create({
      userId,
      eventId,
      amount,
      email,
      transactionId,
      invoiceNumber,
      paymentMethod: paymentMethod || 'Credit Card',
      status: 'completed', // Since we're using mock payments
    });

    // Update event's current amount
    event.currentAmount += Number(amount);
    await event.save();

    // Populate the contribution with event and user details
    await contribution.populate([
      { path: 'eventId', select: 'title description imageUrl images' },
      { path: 'userId', select: 'firstName lastName email avatar username' }
    ]);

    res.status(201).json({
      message: 'Contribution recorded successfully',
      contribution,
      eventProgress: {
        currentAmount: event.currentAmount,
        progress: (event.currentAmount / event.amountToRaise) * 100
      }
    });
  } catch (error) {
    console.error('Contribution creation error:', error);
    
    // Handle duplicate transaction ID
    if (error.code === 11000 && error.keyPattern?.transactionId) {
      return res.status(422).json({ error: 'Transaction ID already exists' });
    }
    
    res.status(500).json({ error: 'Failed to record contribution' });
  }
};

// GET /contributions/my
const getMyContributions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const contributions = await Contribution.find({ userId })
      .populate('eventId', 'title description imageUrl images amountToRaise currentAmount createdBy')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Contribution.countDocuments({ userId });

    // Calculate total contributed amount
    const totalContributed = await Contribution.aggregate([
      { $match: { userId: req.user.id, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      contributions,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total,
      totalContributed: totalContributed[0]?.total || 0
    });
  } catch (error) {
    console.error('Get contributions error:', error);
    res.status(500).json({ error: 'Failed to fetch contributions' });
  }
};

// GET /contributions/event/:eventId
const getEventContributions = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Verify event exists and user has permission to view contributions
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Only event creator can view detailed contributions
    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to view contributions for this event' });
    }

    const contributions = await Contribution.find({ eventId, status: 'completed' })
      .populate('userId', 'firstName lastName avatar username')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Contribution.countDocuments({ eventId, status: 'completed' });

    // Calculate total raised for this event
    const totalRaised = await Contribution.aggregate([
      { $match: { eventId: event._id, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      contributions,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total,
      totalRaised: totalRaised[0]?.total || 0,
      event: {
        title: event.title,
        amountToRaise: event.amountToRaise,
        currentAmount: event.currentAmount
      }
    });
  } catch (error) {
    console.error('Get event contributions error:', error);
    res.status(500).json({ error: 'Failed to fetch event contributions' });
  }
};

// GET /contributions/stats
const getContributionStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's contribution statistics
    const stats = await Contribution.aggregate([
      { $match: { userId: req.user.id, status: 'completed' } },
      {
        $group: {
          _id: null,
          totalContributed: { $sum: '$amount' },
          totalContributions: { $sum: 1 },
          averageContribution: { $avg: '$amount' }
        }
      }
    ]);

    // Get number of unique events contributed to
    const uniqueEvents = await Contribution.distinct('eventId', { userId, status: 'completed' });

    // Get recent contributions
    const recentContributions = await Contribution.find({ userId, status: 'completed' })
      .populate('eventId', 'title imageUrl images')
      .sort({ createdAt: -1 })
      .limit(5);

    const userStats = stats[0] || {
      totalContributed: 0,
      totalContributions: 0,
      averageContribution: 0
    };

    res.json({
      ...userStats,
      uniqueEventsSupported: uniqueEvents.length,
      recentContributions
    });
  } catch (error) {
    console.error('Get contribution stats error:', error);
    res.status(500).json({ error: 'Failed to fetch contribution statistics' });
  }
};

module.exports = {
  createContribution,
  getMyContributions,
  getEventContributions,
  getContributionStats,
};