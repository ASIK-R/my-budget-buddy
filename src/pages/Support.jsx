import { motion } from 'framer-motion';
import { BookOpen, Download, FileText, Heart, Mail, MessageCircle, Phone } from 'lucide-react';
import { useState } from 'react';
import { getIconClass } from '../utils/iconUtils';

const Support = () => {
  const [activeTab, setActiveTab] = useState('help');
  const [feedback, setFeedback] = useState({ name: '', email: '', message: '' });

  const handleSubmitFeedback = e => {
    e.preventDefault();
    // In a real app, this would send the feedback to a server
    alert('Thank you for your feedback!');
    setFeedback({ name: '', email: '', message: '' });
  };

  const helpTopics = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      description: 'Learn the basics of using Expense Tracker',
      icon: BookOpen,
    },
    {
      id: 'transactions',
      title: 'Managing Transactions',
      description: 'How to add, edit, and delete transactions',
      icon: FileText,
    },
    {
      id: 'budgets',
      title: 'Budgets & Goals',
      description: 'Setting up budgets and tracking your goals',
      icon: Heart,
    },
    {
      id: 'sync',
      title: 'Data Sync',
      description: 'Syncing your data across devices',
      icon: Download,
    },
  ];

  return (
    <div className="p-responsive w-full max-w-full overflow-x-hidden bg-gray-50 dark:bg-gray-900">
          {/* Mobile-specific spacing adjustments */}
          <div class="sm:hidden mt-16"></div>
      <div className="sm:hidden mt-16"></div>
      
      {/* Modern Header with Gradient Background */}
      <div className="rounded-2xl bg-gradient-to-r from-[#076653]/10 to-[#076653]/5 p-5 sm:p-6 md:p-7 backdrop-blur-sm border border-[#076653]/20 dark:border-[#076653]/10 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#076653]/5 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#076653]/5 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">Support & About</h1>
              <p className="text-gray-600 dark:text-gray-300">Get help, provide feedback, and learn about the app</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Support Options with Modern Design */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
        <motion.div
          className="rounded-2xl bg-white/80 dark:bg-gray-800/60 p-5 sm:p-6 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -5 }}
        >
          <div className="mx-auto w-12 h-12 rounded-xl bg-[#076653]/10 flex items-center justify-center mb-4">
            <MessageCircle className={`${getIconClass()} text-[#076653]`} size={24} />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white text-lg">Live Chat</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Chat with our support team
          </p>
          <button className="mt-4 w-full py-2.5 bg-[#076653] text-white rounded-lg hover:bg-[#076653]/90 transition-all duration-300 shadow-md hover:shadow-lg font-semibold">
            Start Chat
          </button>
        </motion.div>

        <motion.div
          className="rounded-2xl bg-white/80 dark:bg-gray-800/60 p-5 sm:p-6 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ y: -5 }}
        >
          <div className="mx-auto w-12 h-12 rounded-xl bg-[#076653]/10 flex items-center justify-center mb-4">
            <Mail className={`${getIconClass()} text-[#076653]`} size={24} />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white text-lg">Email Support</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Send us an email</p>
          <button className="mt-4 w-full py-2.5 bg-[#076653] text-white rounded-lg hover:bg-[#076653]/90 transition-all duration-300 shadow-md hover:shadow-lg font-semibold">
            support@expensetracker.com
          </button>
        </motion.div>

        <motion.div
          className="rounded-2xl bg-white/80 dark:bg-gray-800/60 p-5 sm:p-6 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -5 }}
        >
          <div className="mx-auto w-12 h-12 rounded-xl bg-[#076653]/10 flex items-center justify-center mb-4">
            <Phone className={`${getIconClass()} text-[#076653]`} size={24} />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white text-lg">Phone Support</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Call us for immediate help
          </p>
          <button className="mt-4 w-full py-2.5 bg-[#076653] text-white rounded-lg hover:bg-[#076653]/90 transition-all duration-300 shadow-md hover:shadow-lg font-semibold">
            +1 (555) 123-4567
          </button>
        </motion.div>

        <motion.div
          className="rounded-2xl bg-white/80 dark:bg-gray-800/60 p-5 sm:p-6 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ y: -5 }}
        >
          <div className="mx-auto w-12 h-12 rounded-xl bg-[#076653]/10 flex items-center justify-center mb-4">
            <BookOpen className={`${getIconClass()} text-[#076653]`} size={24} />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white text-lg">Knowledge Base</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Browse our help articles</p>
          <button className="mt-4 w-full py-2.5 bg-[#076653] text-white rounded-lg hover:bg-[#076653]/90 transition-all duration-300 shadow-md hover:shadow-lg font-semibold">
            Visit Knowledge Base
          </button>
        </motion.div>
      </div>

      {/* Modern Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('help')}
          className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-all duration-300 ${
            activeTab === 'help'
              ? 'text-[#076653] border-b-2 border-[#076653] bg-[#076653]/5 dark:bg-[#076653]/10'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Help Topics
        </button>
        <button
          onClick={() => setActiveTab('feedback')}
          className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-all duration-300 ${
            activeTab === 'feedback'
              ? 'text-[#076653] border-b-2 border-[#076653] bg-[#076653]/5 dark:bg-[#076653]/10'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Feedback
        </button>
        <button
          onClick={() => setActiveTab('about')}
          className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-all duration-300 ${
            activeTab === 'about'
              ? 'text-[#076653] border-b-2 border-[#076653] bg-[#076653]/5 dark:bg-[#076653]/10'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          About
        </button>
      </div>

      {/* Help Topics Tab */}
      {activeTab === 'help' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
          {helpTopics.map((topic, index) => {
            const Icon = topic.icon;
            return (
              <motion.div
                key={topic.id}
                className="rounded-2xl bg-white/80 dark:bg-gray-800/60 p-5 sm:p-6 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-[#076653]/10 text-[#076653]">
                    <Icon size={20} className={`${getIconClass()}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">{topic.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {topic.description}
                    </p>
                    <button className="mt-3 text-[#076653] text-sm font-semibold hover:underline">
                      Read More →
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Feedback Tab */}
      {activeTab === 'feedback' && (
        <div className="rounded-2xl bg-white/80 dark:bg-gray-800/60 p-5 sm:p-6 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Send Us Feedback</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We'd love to hear your thoughts and suggestions to improve Expense Tracker.
          </p>
          <form onSubmit={handleSubmitFeedback} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
              <input
                type="text"
                value={feedback.name}
                onChange={e => setFeedback({ ...feedback, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[#076653] focus:border-transparent transition-all duration-200"
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={feedback.email}
                onChange={e => setFeedback({ ...feedback, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[#076653] focus:border-transparent transition-all duration-200"
                placeholder="your.email@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
              <textarea
                value={feedback.message}
                onChange={e => setFeedback({ ...feedback, message: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[#076653] focus:border-transparent transition-all duration-200"
                placeholder="Your feedback..."
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-[#076653] text-white rounded-xl hover:bg-[#076653]/90 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
            >
              Send Feedback
            </button>
          </form>
        </div>
      )}

      {/* About Tab */}
      {activeTab === 'about' && (
        <div className="rounded-2xl bg-white/80 dark:bg-gray-800/60 p-5 sm:p-6 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">About Expense Tracker</h2>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Expense Tracker is a modern financial management application designed to help you take control of your personal finances. 
              Our mission is to make financial management simple, intuitive, and accessible to everyone.
            </p>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Features</h3>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-4 space-y-1">
              <li>Real-time expense tracking</li>
              <li>Budget planning and monitoring</li>
              <li>Financial goal setting</li>
              <li>Detailed analytics and reports</li>
              <li>Cross-device synchronization</li>
              <li>Bank account integration</li>
            </ul>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Our Team</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We are a passionate team of developers, designers, and financial experts committed to creating the best personal finance tools.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span>Version 1.0.0</span>
              <span>•</span>
              <span>© 2023 Expense Tracker</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Support;