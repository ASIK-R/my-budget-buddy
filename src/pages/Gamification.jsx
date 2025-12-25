import { motion } from 'framer-motion';
import { Award, Calendar, Medal, Star, Target, TrendingUp, Trophy, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { getIconClass } from '../utils/iconUtils';

const Gamification = () => {
  const [activeTab, setActiveTab] = useState('achievements');

  // Sample achievements data
  const achievements = [
    {
      id: '1',
      title: 'First Transaction',
      description: 'Record your first expense',
      icon: Target,
      earned: true,
      date: '2023-01-15',
    },
    {
      id: '2',
      title: 'Budget Master',
      description: 'Create 5 budgets',
      icon: Medal,
      earned: true,
      date: '2023-02-20',
    },
    {
      id: '3',
      title: 'Savings Champion',
      description: 'Save $1000 in a month',
      icon: Trophy,
      earned: false,
      date: null,
    },
    {
      id: '4',
      title: 'Consistency King',
      description: 'Track expenses for 30 days straight',
      icon: Star,
      earned: true,
      date: '2023-03-10',
    },
    {
      id: '5',
      title: 'Investor',
      description: 'Add your first investment',
      icon: TrendingUp,
      earned: false,
      date: null,
    },
    {
      id: '6',
      title: 'Planner',
      description: 'Set up 3 recurring transactions',
      icon: Calendar,
      earned: true,
      date: '2023-04-05',
    },
  ];

  // Sample badges data
  const badges = [
    { id: '1', name: 'Starter', description: 'Just getting started', earned: true },
    { id: '2', name: 'Saver', description: 'Saved $500 total', earned: true },
    { id: '3', name: 'Budgeter', description: 'Created 3 budgets', earned: true },
    { id: '4', name: 'Pro', description: 'Used app for 90 days', earned: false },
    { id: '5', name: 'Master', description: 'Saved $5000 total', earned: false },
    { id: '6', name: 'Legend', description: 'Used app for 365 days', earned: false },
  ];

  // Sample stats
  const stats = [
    { name: 'Total Points', value: '1,250' },
    { name: 'Achievements', value: '4/6' },
    { name: 'Badges', value: '3/6' },
    { name: 'Current Streak', value: '12 days' },
  ];

  // Sample leaderboard data
  const leaderboard = [
    { id: '1', name: 'Alex Johnson', points: 2450, avatar: 'AJ' },
    { id: '2', name: 'Sam Wilson', points: 2100, avatar: 'SW' },
    { id: '3', name: 'You', points: 1850, avatar: 'ME', isYou: true },
    { id: '4', name: 'Taylor Kim', points: 1750, avatar: 'TK' },
    { id: '5', name: 'Jordan Lee', points: 1600, avatar: 'JL' },
  ];

  return (
    <div className="p-3 sm:p-4 md:p-5 lg:p-6 space-y-5 sm:space-y-6 md:space-y-7 lg:space-y-8 fade-in">
      {/* Mobile-specific spacing adjustments */}
      <div className="sm:hidden mt-16"></div>
      
      {/* Modern Header with Gradient Background */}
      <div className="rounded-2xl bg-gradient-to-r from-[#076653]/10 to-[#076653]/5 p-5 sm:p-6 md:p-7 backdrop-blur-sm border border-[#076653]/20 dark:border-[#076653]/10 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#076653]/5 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#076653]/5 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">Gamification</h1>
              <p className="text-gray-600 dark:text-gray-300">Track your progress, earn achievements, and level up your financial skills</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards with Modern Design */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            className="rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-5 shadow-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {stat.value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modern Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('achievements')}
          className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-all duration-300 ${
            activeTab === 'achievements'
              ? 'text-[#076653] border-b-2 border-[#076653] bg-[#076653]/5 dark:bg-[#076653]/10'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Achievements
        </button>
        <button
          onClick={() => setActiveTab('badges')}
          className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-all duration-300 ${
            activeTab === 'badges'
              ? 'text-[#076653] border-b-2 border-[#076653] bg-[#076653]/5 dark:bg-[#076653]/10'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Badges
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-all duration-300 ${
            activeTab === 'leaderboard'
              ? 'text-[#076653] border-b-2 border-[#076653] bg-[#076653]/5 dark:bg-[#076653]/10'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Leaderboard
        </button>
      </div>

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <motion.div
                key={achievement.id}
                className={`rounded-2xl p-5 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg transition-all duration-300 ${
                  achievement.earned
                    ? 'bg-gradient-to-br from-yellow-50/80 to-amber-50/80 dark:from-yellow-900/20 dark:to-amber-900/20 border-yellow-200 dark:border-yellow-800/50'
                    : 'bg-white/80 dark:bg-gray-800/60 opacity-90'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                {achievement.earned && (
                  <div className="absolute top-3 right-3">
                    <Award className="text-yellow-500" size={20} />
                  </div>
                )}
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-xl ${
                      achievement.earned
                        ? 'bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/20 text-yellow-600 dark:text-yellow-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                    }`}
                  >
                    <Icon size={24} className={`${getIconClass()}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                      {achievement.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {achievement.description}
                    </p>
                    {achievement.earned && achievement.date && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                        Earned on {new Date(achievement.date).toLocaleDateString()}
                      </p>
                    )}
                    {!achievement.earned && (
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div
                            className="bg-[#076653] h-2.5 rounded-full"
                            style={{ width: `${Math.random() * 100}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          {Math.floor(Math.random() * 100)}% complete
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Badges Tab */}
      {activeTab === 'badges' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {badges.map((badge, index) => (
            <motion.div
              key={badge.id}
              className={`rounded-2xl p-5 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg transition-all duration-300 ${
                badge.earned
                  ? 'bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800/50'
                  : 'bg-white/80 dark:bg-gray-800/60 opacity-90'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                  badge.earned 
                    ? 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                }`}>
                  {badge.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                    {badge.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {badge.description}
                  </p>
                  {badge.earned ? (
                    <span className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-green-600 dark:text-green-400">
                      <CheckCircle size={14} />
                      Earned
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                      Locked
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Leaderboard Tab */}
      {activeTab === 'leaderboard' && (
        <div className="rounded-2xl bg-white/80 dark:bg-gray-800/60 p-5 sm:p-6 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
          <div className="space-y-4">
            {leaderboard.map((user, index) => (
              <div 
                key={user.id}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                  user.isYou 
                    ? 'bg-[#076653]/10 dark:bg-[#076653]/20 border border-[#076653]/20 dark:border-[#076653]/30' 
                    : 'hover:bg-gray-100/50 dark:hover:bg-gray-700/30'
                }`}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#076653] to-teal-700 text-white font-bold">
                  {index + 1}
                </div>
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold">
                  {user.avatar}
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold ${
                    user.isYou 
                      ? 'text-[#076653] dark:text-[#076653]' 
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {user.name} {user.isYou && '(You)'}
                  </h3>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 dark:text-white">{user.points.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">points</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Gamification;