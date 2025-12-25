import { format } from 'date-fns';
import { ArrowUpDown, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';

const headers = [
  { key: 'date', label: 'Date' },
  { key: 'description', label: 'Description' },
  { key: 'category', label: 'Category' },
  { key: 'type', label: 'Type' },
  { key: 'amount', label: 'Amount' },
];

const TransactionTable = ({ transactions, onEdit }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const { deleteTransaction } = useAppContext();

  const sortedTransactions = [...transactions].sort((a, b) => {
    const direction = sortConfig.direction === 'asc' ? 1 : -1;
    if (sortConfig.key === 'amount') {
      return (a.amount - b.amount) * direction;
    }
    if (sortConfig.key === 'date') {
      return (new Date(a.date) - new Date(b.date)) * direction;
    }
    return a[sortConfig.key].localeCompare(b[sortConfig.key]) * direction;
  });

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedTransactions.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);

  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700/50 rounded-2xl overflow-hidden">
        <thead className="bg-gray-50 dark:bg-gray-800/50">
          <tr>
            {headers.map((header) => (
              <th
                key={header.key}
                onClick={() => handleSort(header.key)}
                className="px-4 py-3 text-left text-xs font-medium text-tertiary uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
              >
                <span className="inline-flex items-center gap-1">
                  {header.label}
                  <ArrowUpDown size={14} />
                </span>
              </th>
            ))}
            <th className="px-4 py-3 text-right text-xs font-medium text-tertiary uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800/30 divide-y divide-gray-100 dark:divide-gray-700/30">
          {currentItems.map((transaction) => (
            <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
              <td className="px-4 py-3 whitespace-nowrap text-sm">
                <div className="md:hidden font-medium text-primary">
                  {format(new Date(transaction.date), 'MMM dd')}
                </div>
                <div className="hidden md:block text-primary">
                  {format(new Date(transaction.date), 'MMM dd, yyyy')}
                </div>
              </td>
              <td className="px-4 py-3 text-sm font-medium text-primary max-w-xs">
                <div className="truncate">{transaction.description}</div>
              </td>
              <td className="px-4 py-3 text-sm text-secondary">
                <span className="md:hidden inline-block px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700/50 text-secondary">
                  {transaction.category}
                </span>
                <span className="hidden md:inline text-secondary">
                  {transaction.category}
                </span>
              </td>
              <td className="px-4 py-3 text-sm">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    transaction.type === 'income'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300'
                  } text-primary`}
                >
                  <span className="md:hidden">
                    {transaction.type === 'income' ? '+' : '-'}
                  </span>
                  <span className="hidden md:inline">
                    {transaction.type}
                  </span>
                </span>
              </td>
              <td className="px-4 py-3 text-sm font-semibold">
                <div className="flex items-center justify-end">
                  <span className={transaction.type === 'income' ? 'text-success' : 'text-error'}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-right">
                <div className="flex justify-end space-x-1">
                  <button
                    onClick={() => onEdit(transaction)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <Edit size={16} className="text-tertiary" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Delete this transaction?')) {
                        deleteTransaction(transaction.id);
                      }
                    }}
                    className="p-2 rounded-lg hover:bg-error-100 dark:hover:bg-error-900/20 transition-colors"
                  >
                    <Trash2 size={16} className="text-error" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {transactions.length === 0 && (
        <div className="py-12 text-center text-tertiary w-full rounded-2xl bg-white dark:bg-gray-800/30 border border-gray-200/50 dark:border-gray-700/50">
          No transactions found. Add some to get started.
        </div>
      )}

      <div className="flex justify-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700/50 text-tertiary disabled:opacity-50"
        >
          Previous
        </button>
        <span className="mx-4 text-tertiary">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700/50 text-tertiary disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TransactionTable;