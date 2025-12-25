import { motion } from 'framer-motion';
import { Edit3, Trash2, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

const WalletCard = ({ 
  wallet, 
  onEdit, 
  onDelete, 
  onTransfer,
  maskedCurrency,
  index 
}) => {
  const getWalletColor = (type) => {
    switch (type) {
      case 'Bank': return 'bg-blue-500';
      case 'Cash': return 'bg-green-500';
      case 'Mobile': return 'bg-purple-500';
      case 'Card': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getWalletIcon = (type) => {
    switch (type) {
      case 'Bank': return '🏦';
      case 'Cash': return '💵';
      case 'Mobile': return '📱';
      case 'Card': return '💳';
      default: return '💰';
    }
  };

  return (
    <motion.div
      className="card p-4 hover:shadow-lg transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl ${getWalletColor(wallet.type)}`}>
            {getWalletIcon(wallet.type)}
          </div>
          <div>
            <h3 className="font-semibold text-primary text-base">{wallet.name}</h3>
            <p className="text-xs text-tertiary mt-1">{wallet.type}</p>
            <p className="text-xs text-tertiary mt-1">
              Created: {format(new Date(wallet.createdAt), 'MMM dd, yyyy')}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-tertiary">Balance</p>
          <p className="font-bold text-primary text-lg mt-1">
            {maskedCurrency(wallet.balance)}
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onTransfer(wallet)}
          className="flex-1 flex items-center justify-center gap-1 py-2 px-3 bg-gradient-1 text-brand-dark rounded-lg text-xs font-medium hover:opacity-90 transition-opacity"
        >
          <TrendingUp size={14} />
          Transfer
        </button>
        <button
          onClick={() => onEdit(wallet)}
          className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
        >
          <Edit3 size={16} className="text-tertiary" />
        </button>
        <button
          onClick={() => onDelete(wallet)}
          className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
        >
          <Trash2 size={16} className="text-red-500" />
        </button>
      </div>
    </motion.div>
  );
};

export default WalletCard;