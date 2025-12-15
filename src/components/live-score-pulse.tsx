"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { TrendingUp, Medal, Zap, ChevronRight, Trophy } from "lucide-react";
import type { Team } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { getTeamColors } from "@/lib/team-colors";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface LiveScorePulseProps {
  teams: Team[];
  liveScores: Map<string, number>;
}

function getMedalColor(index: number): string {
  switch (index) {
    case 0:
      return "#FFD700";
    case 1:
      return "#C0C0C0";
    case 2:
      return "#CD7F32";
    default:
      return "transparent";
  }
}

interface TeamCardProps {
  team: Team & { totalPoints: number; colors: { primary: string; gradient: string; light: string } };
  index: number;
  maxPoints: number;
}

function TeamCard({ team, index, maxPoints }: TeamCardProps) {
  const percentage = maxPoints > 0 ? (team.totalPoints / maxPoints) * 100 : 0;
  const isTopThree = index < 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="relative group"
    >
      <div
        className={`rounded-2xl shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl transform-gpu p-[3px] ${isTopThree ? 'ring-2 ring-offset-2 ring-offset-[#fffcf5]' : ''
          }`}
        style={{
          background: `linear-gradient(to bottom right, ${team.colors.primary}, ${team.colors.gradient})`,
          ...(isTopThree ? {
            boxShadow: `0 0 0 2px ${getMedalColor(index)}40, 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)`
          } : {})
        }}
      >
        <div className="bg-white rounded-2xl p-3 sm:p-4 md:p-5 backdrop-blur-sm relative overflow-hidden">
          <div
            className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 opacity-5 rounded-full blur-3xl"
            style={{ backgroundColor: team.colors.primary }}
          />

          <div className="relative z-10">
            <div className="flex items-start sm:items-center justify-between mb-3 sm:mb-4 gap-2">
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center rounded-xl sm:rounded-2xl font-bold text-lg sm:text-xl md:text-2xl shadow-md sm:shadow-lg transition-transform group-hover:scale-110 shrink-0"
                  style={{
                    backgroundColor: team.colors.light,
                    border: `2px solid ${team.colors.primary}20`,
                    borderRadius: '1rem'
                  }}
                >
                  <span style={{ color: team.colors.primary }}>{team.name.charAt(0)}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1 sm:gap-2 mb-1">
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base md:text-lg truncate">{team.name}</h3>
                    {isTopThree && (
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        className="shrink-0"
                      >
                        <Medal className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" style={{ color: getMedalColor(index) }} />
                      </motion.div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                      Rank #{index + 1}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="font-bold text-xl sm:text-2xl md:text-3xl text-gray-900 block leading-none">
                  {formatNumber(team.totalPoints)}
                </span>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">points</p>
              </div>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <div className="w-full bg-gray-100 rounded-full h-2.5 sm:h-3 md:h-3.5 overflow-hidden shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 + 0.3, ease: "easeOut" }}
                  className="h-full rounded-full transition-all duration-500 shadow-sm relative overflow-hidden"
                  style={{
                    backgroundColor: team.colors.primary,
                    borderRadius: '9999px'
                  }}
                >
                  <motion.div
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full"
                  />
                </motion.div>
              </div>
              <div className="flex justify-between items-center text-[10px] sm:text-xs">
                <span className="text-gray-600 font-medium">Progress</span>
                <span className="font-bold text-gray-900">{percentage.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-xl border border-gray-100">
        <p className="font-bold text-gray-900">{data.name}</p>
        <p className="text-sm font-semibold" style={{ color: data.colors.primary }}>
          {formatNumber(data.totalPoints)} points
        </p>
      </div>
    );
  }
  return null;
};

interface DistributionChartProps {
  teams: Array<Team & { totalPoints: number; colors: { primary: string; stroke: string } }>;
}

function DesktopDistributionChart({ teams }: DistributionChartProps) {
  const maxPoints = Math.max(...teams.map(t => t.totalPoints), 1);
  
  return (
    <div className="hidden md:flex flex-col h-full min-h-[400px] p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50 shadow-2xl">
      <div className="mb-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-3">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-wide">Leaderboard</span>
        </div>
        <h4 className="text-xl font-bold text-white">Points Distribution</h4>
        <p className="text-sm text-slate-400 mt-1">Live team rankings</p>
      </div>
      
      <div className="flex-1 space-y-4">
        {teams.map((team, index) => {
          const percentage = maxPoints > 0 ? (team.totalPoints / maxPoints) * 100 : 0;
          const isTopThree = index < 3;
          
          return (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.08 }}
              className="group"
            >
              <div 
                className={`relative flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
                  isTopThree 
                    ? 'bg-gradient-to-r from-slate-800/80 to-slate-700/50 border border-slate-600/50' 
                    : 'bg-slate-800/40 border border-slate-700/30'
                }`}
              >
                <div 
                  className={`flex items-center justify-center w-10 h-10 rounded-xl font-bold text-base shadow-lg transition-transform group-hover:scale-110 ${
                    index === 0 ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-amber-900' :
                    index === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-slate-700' :
                    index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-orange-900' :
                    'bg-slate-700 text-slate-400'
                  }`}
                >
                  {index + 1}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-white text-base">{team.name}</span>
                      {isTopThree && (
                        <Medal 
                          className="w-5 h-5" 
                          style={{ color: getMedalColor(index) }} 
                        />
                      )}
                    </div>
                    <span 
                      className="font-bold text-lg"
                      style={{ color: team.colors.primary }}
                    >
                      {formatNumber(team.totalPoints)} pts
                    </span>
                  </div>
                  
                  <div className="relative h-3 bg-slate-700/50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{ 
                        background: `linear-gradient(90deg, ${team.colors.primary}, ${team.colors.primary}cc)`,
                        boxShadow: `0 0 15px ${team.colors.primary}50`
                      }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      <div className="mt-6 pt-4 border-t border-slate-700/50">
        <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <span>1st Place</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-400" />
            <span>2nd Place</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-400" />
            <span>3rd Place</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileDistributionChart({ teams }: DistributionChartProps) {
  const maxPoints = Math.max(...teams.map(t => t.totalPoints), 1);
  
  return (
    <div className="md:hidden flex flex-col p-4 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50 shadow-2xl">
      <div className="mb-5 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-3">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-wide">Leaderboard</span>
        </div>
        <h4 className="text-lg font-bold text-white">Points Distribution</h4>
        <p className="text-xs text-slate-400 mt-1">Live team rankings</p>
      </div>
      
      <div className="space-y-3">
        {teams.map((team, index) => {
          const percentage = maxPoints > 0 ? (team.totalPoints / maxPoints) * 100 : 0;
          const isTopThree = index < 3;
          
          return (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.08 }}
              className="relative"
            >
              <div 
                className={`relative flex items-center gap-3 p-3 rounded-2xl transition-all duration-300 ${
                  isTopThree 
                    ? 'bg-gradient-to-r from-slate-800/80 to-slate-700/50 border border-slate-600/50' 
                    : 'bg-slate-800/40 border border-slate-700/30'
                }`}
              >
                <div 
                  className={`flex items-center justify-center w-8 h-8 rounded-xl font-bold text-sm shadow-lg ${
                    index === 0 ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-amber-900' :
                    index === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-slate-700' :
                    index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-orange-900' :
                    'bg-slate-700 text-slate-400'
                  }`}
                >
                  {index + 1}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-sm truncate">{team.name}</span>
                      {isTopThree && (
                        <Medal 
                          className="w-4 h-4 shrink-0" 
                          style={{ color: getMedalColor(index) }} 
                        />
                      )}
                    </div>
                    <span 
                      className="font-bold text-sm shrink-0 ml-2"
                      style={{ color: team.colors.primary }}
                    >
                      {formatNumber(team.totalPoints)}
                    </span>
                  </div>
                  
                  <div className="relative h-2 bg-slate-700/50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{ 
                        background: `linear-gradient(90deg, ${team.colors.primary}, ${team.colors.primary}dd)`,
                        boxShadow: `0 0 10px ${team.colors.primary}40`
                      }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      <div className="mt-4 pt-3 border-t border-slate-700/50">
        <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <span>1st</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-slate-400" />
            <span>2nd</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-orange-400" />
            <span>3rd</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LiveScorePulse({ teams, liveScores }: LiveScorePulseProps) {
  const teamsWithScores = teams.map((team) => {
    const totalPoints = liveScores.get(team.id) ?? team.total_points;
    const colors = getTeamColors(team);
    return { ...team, totalPoints, colors };
  });

  const sortedTeams = [...teamsWithScores].sort((a, b) => b.totalPoints - a.totalPoints);
  const maxPoints = Math.max(...sortedTeams.map((t) => t.totalPoints), 1);

  return (
    <section className="space-y-6 sm:space-y-8 md:space-y-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <div className="flex flex-col items-center justify-center text-center px-4">
          <div className="relative inline-flex items-center justify-center mb-5">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 rounded-full blur-2xl scale-150" />
            <div className="relative flex items-center gap-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/50 rounded-full px-5 py-2.5 shadow-sm">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-emerald-700">Live Updates Active</span>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 mb-3">
            <div className="hidden sm:block h-px w-12 bg-gradient-to-r from-transparent to-gray-300" />
            <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500" />
            <div className="hidden sm:block h-px w-12 bg-gradient-to-l from-transparent to-gray-300" />
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-gray-900">
            Live Score Pulse
          </h2>
          <p className="text-gray-500 text-sm sm:text-base max-w-md">
            Track real-time team rankings and performance as the competition unfolds
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
        <div className="lg:col-span-2 order-2 lg:order-1">
          <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
            {sortedTeams.map((team, index) => (
              <TeamCard key={team.id} team={team} index={index} maxPoints={maxPoints} />
            ))}
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <DesktopDistributionChart teams={sortedTeams} />
          <MobileDistributionChart teams={sortedTeams} />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 pt-4 sm:pt-6 px-4"
      >
        <Link
          href="/scoreboard"
          className="group relative bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 transition-all py-3.5 sm:py-4 px-8 sm:px-10 rounded-2xl text-sm sm:text-base font-semibold text-white shadow-xl hover:shadow-2xl transform-gpu transition-all duration-300 hover:scale-105 overflow-hidden w-full sm:w-auto text-center flex items-center justify-center gap-2"
        >
          <Trophy className="w-5 h-5" />
          <span>View Full Scoreboard</span>
          <ChevronRight className="w-4 h-4 opacity-60 group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link
          href="/results"
          className="group relative bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 transition-all py-3.5 sm:py-4 px-8 sm:px-10 rounded-2xl text-sm sm:text-base font-semibold text-gray-700 shadow-sm hover:shadow-md transform-gpu transition-all duration-300 hover:scale-105 w-full sm:w-auto text-center flex items-center justify-center gap-2"
        >
          <span>Browse Results</span>
          <ChevronRight className="w-4 h-4 opacity-60 group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>
    </section>
  );
}
