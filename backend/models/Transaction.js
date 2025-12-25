const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['income', 'expense', 'transfer']
  },
  category: {
    type: String,
    required: function() {
      return this.type !== 'transfer'
    }
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  fromWallet: {
    type: String,
    required: function() {
      return this.type === 'transfer'
    }
  },
  toWallet: {
    type: String,
    required: function() {
      return this.type === 'transfer'
    }
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Transaction', transactionSchema)