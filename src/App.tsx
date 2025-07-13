import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Calendar,
  Award,
  Building2,
  Clock
} from 'lucide-react';
import { ArrowUpRight, ArrowDownLeft, AlertTriangle } from 'lucide-react';

import BurndownChart from './components/BurndownChart';

interface BoardHealth {
  velocity: number;
  blockers: number;
  overdue: number;
  completed: number;
  status: 'healthy' | 'warning' | 'critical';
  sprintGoal: string;
  sprintUnderstanding: 'A' | 'B' | 'C';
  estimationAccuracy: number;
  documentation: number;
  umlDiagrams: number;
  defectRemovalRate: number;
  defectRemovalSprint: number;
  defectRemovalFuture: number;
  devCount: number;
  sprintDates: string;
  backlogItems: number;
  doneRatio: number;
  doneGoals: number;
  pendingDeployment: number;
  productionLive: number;
  scopeAdded: number;
  scopeRemoved: number;
  scopeModified: number;
  burndownData: Array<{
    date: string;
    guideline: number;
    remaining: number;
    isWeekend?: boolean;
  }>;
}

interface Board {
  id: string;
  name: string;
  project: string;
  sprint: string;
  projectManager: string;
  totalIssues: number;
  remainingIssues: number;
  health: BoardHealth;
}

interface EngineeringManager {
  id: string;
  name: string;
  title: string;
  avatar: string;
  experience: string;
  understandingLevel: 'A' | 'B' | 'C';
  understandingTargetDate: string;
  department: string;
  teamsCount: number;
  boards: Board[];
}

const mockData: EngineeringManager[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    title: 'Senior Engineering Manager',
    avatar:
      'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    experience: '8+ years',
    understandingLevel: 'A',
    understandingTargetDate: '2024-06-15',
    department: 'Platform Engineering',
    teamsCount: 3,
    boards: [
      {
        id: 'board-1',
        name: 'Platform Core',
        project: 'PLAT',
        sprint: 'Sprint 23',
        projectManager: 'John Smith',
        totalIssues: 45,
        remainingIssues: 13,
        health: {
          velocity: 85,
          blockers: 2,
          overdue: 1,
          completed: 32,
          status: 'healthy',
          sprintGoal: 'Implement new authentication system',
          sprintUnderstanding: 'A',
          estimationAccuracy: 92.5,
          documentation: 8,
          umlDiagrams: 3,
          defectRemovalRate: 2,
          defectRemovalSprint: 1,
          defectRemovalFuture: 0,
          devCount: 8,
          sprintDates: 'Jul 7th - Jul 21st',
          backlogItems: 15,
          doneRatio: 8,
          doneGoals: 12,
          pendingDeployment: 3,
          productionLive: 9,
          scopeAdded: 5,
          scopeRemoved: 2,
          scopeModified: 3,
          burndownData: [
            { date: 'Jul 7', guideline: 45, remaining: 45 },
            { date: 'Jul 8', guideline: 42, remaining: 40 },
            { date: 'Jul 9', guideline: 39, remaining: 38 },
            { date: 'Jul 10', guideline: 36, remaining: 35 },
            { date: 'Jul 11', guideline: 33, remaining: 32 },
            { date: 'Jul 12', guideline: 30, remaining: 30, isWeekend: true },
            { date: 'Jul 13', guideline: 30, remaining: 30, isWeekend: true },
            { date: 'Jul 14', guideline: 27, remaining: 25 },
            { date: 'Jul 15', guideline: 24, remaining: 22 },
            { date: 'Jul 16', guideline: 21, remaining: 20 },
            { date: 'Jul 17', guideline: 18, remaining: 17 },
            { date: 'Jul 18', guideline: 15, remaining: 15 },
            { date: 'Jul 19', guideline: 12, remaining: 13, isWeekend: true },
            { date: 'Jul 20', guideline: 12, remaining: 13, isWeekend: true },
            { date: 'Jul 21', guideline: 0, remaining: 13 }
          ]
        }
      },
      {
        id: 'board-2',
        name: 'API Gateway',
        project: 'API',
        sprint: 'Sprint 15',
        projectManager: 'Lisa Chen',
        totalIssues: 28,
        remainingIssues: 11,
        health: {
          velocity: 72,
          blockers: 4,
          overdue: 3,
          completed: 17,
          status: 'warning',
          sprintGoal: 'Optimize API response times',
          sprintUnderstanding: 'B',
          estimationAccuracy: 78.3,
          documentation: 5,
          umlDiagrams: 2,
          defectRemovalRate: 3,
          defectRemovalSprint: 2,
          defectRemovalFuture: 1,
          devCount: 6,
          sprintDates: 'Jul 1st - Jul 15th',
          backlogItems: 12,
          doneRatio: 6,
          doneGoals: 8,
          pendingDeployment: 2,
          productionLive: 6,
          scopeAdded: 8,
          scopeRemoved: 4,
          scopeModified: 6,
          burndownData: [
            { date: 'Jul 1', guideline: 28, remaining: 28 },
            { date: 'Jul 2', guideline: 26, remaining: 27 },
            { date: 'Jul 3', guideline: 24, remaining: 25 },
            { date: 'Jul 4', guideline: 22, remaining: 24 },
            { date: 'Jul 5', guideline: 20, remaining: 22 },
            { date: 'Jul 6', guideline: 18, remaining: 22, isWeekend: true },
            { date: 'Jul 7', guideline: 18, remaining: 22, isWeekend: true },
            { date: 'Jul 8', guideline: 16, remaining: 20 },
            { date: 'Jul 9', guideline: 14, remaining: 18 },
            { date: 'Jul 10', guideline: 12, remaining: 16 },
            { date: 'Jul 11', guideline: 10, remaining: 14 },
            { date: 'Jul 12', guideline: 8, remaining: 13 },
            { date: 'Jul 13', guideline: 6, remaining: 13, isWeekend: true },
            { date: 'Jul 14', guideline: 6, remaining: 13, isWeekend: true },
            { date: 'Jul 15', guideline: 0, remaining: 11 }
          ]
        }
      }
    ]
  },
  {
    id: '2',
    name: 'Marcus Chen',
    title: 'Engineering Manager',
    avatar:
      'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    experience: '6+ years',
    understandingLevel: 'B',
    understandingTargetDate: '2024-09-30',
    department: 'Mobile Development',
    teamsCount: 2,
    boards: [
      {
        id: 'board-3',
        name: 'Mobile App',
        project: 'MOB',
        sprint: 'Sprint 31',
        projectManager: 'David Kim',
        totalIssues: 62,
        remainingIssues: 19,
        health: {
          velocity: 90,
          blockers: 1,
          overdue: 0,
          completed: 43,
          status: 'healthy',
          sprintGoal: 'Launch new user onboarding flow',
          sprintUnderstanding: 'A',
          estimationAccuracy: 95.2,
          documentation: 12,
          umlDiagrams: 5,
          defectRemovalRate: 1,
          defectRemovalSprint: 0,
          defectRemovalFuture: 1,
          devCount: 10,
          sprintDates: 'Jul 5th - Jul 19th',
          backlogItems: 20,
          doneRatio: 15,
          doneGoals: 18,
          pendingDeployment: 2,
          productionLive: 16,
          scopeAdded: 3,
          scopeRemoved: 1,
          scopeModified: 2,
          burndownData: [
            { date: 'Jul 5', guideline: 62, remaining: 62 },
            { date: 'Jul 6', guideline: 58, remaining: 60 },
            { date: 'Jul 7', guideline: 54, remaining: 55 },
            { date: 'Jul 8', guideline: 50, remaining: 50 },
            { date: 'Jul 9', guideline: 46, remaining: 45 },
            { date: 'Jul 10', guideline: 42, remaining: 40 },
            { date: 'Jul 11', guideline: 38, remaining: 35 },
            { date: 'Jul 12', guideline: 34, remaining: 30, isWeekend: true },
            { date: 'Jul 13', guideline: 34, remaining: 30, isWeekend: true },
            { date: 'Jul 14', guideline: 30, remaining: 25 },
            { date: 'Jul 15', guideline: 26, remaining: 22 },
            { date: 'Jul 16', guideline: 22, remaining: 20 },
            { date: 'Jul 17', guideline: 18, remaining: 19 },
            { date: 'Jul 18', guideline: 14, remaining: 19 },
            { date: 'Jul 19', guideline: 0, remaining: 19 }
          ]
        }
      },
      {
        id: 'board-4',
        name: 'User Experience',
        project: 'UX',
        sprint: 'Sprint 12',
        projectManager: 'Emma Wilson',
        totalIssues: 35,
        remainingIssues: 22,
        health: {
          velocity: 45,
          blockers: 8,
          overdue: 7,
          completed: 13,
          status: 'critical',
          sprintGoal: 'No Goals Defined',
          sprintUnderstanding: 'C',
          estimationAccuracy: 45.8,
          documentation: 2,
          umlDiagrams: 0,
          defectRemovalRate: 6,
          defectRemovalSprint: 4,
          defectRemovalFuture: 2,
          devCount: 5,
          sprintDates: 'Jun 28th - Jul 12th',
          backlogItems: 8,
          doneRatio: 3,
          doneGoals: 5,
          pendingDeployment: 7,
          productionLive: 3,
          scopeAdded: 12,
          scopeRemoved: 8,
          scopeModified: 15,
          burndownData: [
            { date: 'Jun 28', guideline: 35, remaining: 35 },
            { date: 'Jun 29', guideline: 32, remaining: 35 },
            { date: 'Jun 30', guideline: 29, remaining: 34 },
            { date: 'Jul 1', guideline: 26, remaining: 33, isWeekend: true },
            { date: 'Jul 2', guideline: 26, remaining: 33, isWeekend: true },
            { date: 'Jul 3', guideline: 23, remaining: 32 },
            { date: 'Jul 4', guideline: 20, remaining: 30 },
            { date: 'Jul 5', guideline: 17, remaining: 28 },
            { date: 'Jul 6', guideline: 14, remaining: 26 },
            { date: 'Jul 7', guideline: 11, remaining: 25 },
            { date: 'Jul 8', guideline: 8, remaining: 24, isWeekend: true },
            { date: 'Jul 9', guideline: 8, remaining: 24, isWeekend: true },
            { date: 'Jul 10', guideline: 5, remaining: 23 },
            { date: 'Jul 11', guideline: 2, remaining: 22 },
            { date: 'Jul 12', guideline: 0, remaining: 22 }
          ]
        }
      }
    ]
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    title: 'Principal Engineering Manager',
    avatar:
      'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    experience: '12+ years',
    understandingLevel: 'A',
    understandingTargetDate: '2024-03-20',
    department: 'Data & Analytics',
    teamsCount: 4,
    boards: [
      {
        id: 'board-5',
        name: 'Data Pipeline',
        project: 'DATA',
        sprint: 'Sprint 8',
        projectManager: 'Michael Brown',
        totalIssues: 52,
        remainingIssues: 16,
        health: {
          velocity: 78,
          blockers: 3,
          overdue: 2,
          completed: 36,
          status: 'healthy',
          sprintGoal: 'Implement real-time data processing',
          sprintUnderstanding: 'B',
          estimationAccuracy: 88.7,
          documentation: 10,
          umlDiagrams: 4,
          defectRemovalRate: 2,
          defectRemovalSprint: 1,
          defectRemovalFuture: 1,
          devCount: 12,
          sprintDates: 'Jul 3rd - Jul 17th',
          backlogItems: 18,
          doneRatio: 12,
          doneGoals: 15,
          pendingDeployment: 3,
          productionLive: 12,
          scopeAdded: 4,
          scopeRemoved: 1,
          scopeModified: 3,
          burndownData: [
            { date: 'Jul 3', guideline: 52, remaining: 52 },
            { date: 'Jul 4', guideline: 49, remaining: 50 },
            { date: 'Jul 5', guideline: 46, remaining: 47 },
            { date: 'Jul 6', guideline: 43, remaining: 44, isWeekend: true },
            { date: 'Jul 7', guideline: 43, remaining: 44, isWeekend: true },
            { date: 'Jul 8', guideline: 40, remaining: 40 },
            { date: 'Jul 9', guideline: 37, remaining: 36 },
            { date: 'Jul 10', guideline: 34, remaining: 32 },
            { date: 'Jul 11', guideline: 31, remaining: 28 },
            { date: 'Jul 12', guideline: 28, remaining: 24 },
            { date: 'Jul 13', guideline: 25, remaining: 20, isWeekend: true },
            { date: 'Jul 14', guideline: 25, remaining: 20, isWeekend: true },
            { date: 'Jul 15', guideline: 22, remaining: 18 },
            { date: 'Jul 16', guideline: 19, remaining: 17 },
            { date: 'Jul 17', guideline: 0, remaining: 16 }
          ]
        }
      }
    ]
  }
];

interface ScopeTileProps {
  label: string;
  value: number;
  workItemCount: number;
  variant: 'added' | 'removed' | 'modified';
}

const getTextColor = (variant: 'added' | 'removed' | 'modified') => {
  switch (variant) {
    case 'added':
      return 'text-emerald-700';
    case 'removed':
      return 'text-rose-700';
    case 'modified':
      return 'text-amber-700';
    default:
      return 'text-slate-700';
  }
};

const getBackgroundColor = (variant: 'added' | 'removed' | 'modified') => {
  switch (variant) {
    case 'added':
      return 'bg-gradient-to-br from-emerald-50 to-green-100 hover:from-emerald-100 hover:to-green-200 border-emerald-200';
    case 'removed':
      return 'bg-gradient-to-br from-rose-50 to-red-100 hover:from-rose-100 hover:to-red-200 border-rose-200';
    case 'modified':
      return 'bg-gradient-to-br from-amber-50 to-yellow-100 hover:from-amber-100 hover:to-yellow-200 border-amber-200';
    default:
      return 'bg-gradient-to-br from-slate-50 to-gray-100 hover:from-slate-100 hover:to-gray-200 border-slate-200';
  }
};

const getIcon = (variant: 'added' | 'removed' | 'modified') => {
  switch (variant) {
    case 'added':
      return <ArrowUpRight className="w-4 h-4 text-emerald-600" />;
    case 'removed':
      return <ArrowDownLeft className="w-4 h-4 text-rose-600" />;
    case 'modified':
      return <AlertTriangle className="w-4 h-4 text-amber-600" />;
    default:
      return null;
  }
};

export const ScopeTile: React.FC<ScopeTileProps> = ({
  label,
  value,
  workItemCount,
  variant,
}) => {
  const sign = value > 0 ? '+' : value < 0 ? '−' : '±';
  const absValue = Math.abs(value);

  return (
    <div
      className={`aspect-square min-w-[100px] rounded-xl border-2 p-4 flex flex-col justify-between items-center text-center shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 ${getBackgroundColor(
        variant
      )}`}
    >
      <div className="flex items-center gap-1.5 text-sm font-semibold">
        {getIcon(variant)}
        <span className={getTextColor(variant)}>{label}</span>
      </div>

      <div className={`text-lg font-bold ${getTextColor(variant)}`}>
        {sign}
        {absValue} pts
      </div>

      <div className={`text-xs font-medium ${getTextColor(variant)} opacity-80`}>
        {workItemCount} items
      </div>
    </div>
  );
};

const BoardRow: React.FC<{ board: Board }> = ({ board }) => {
  const { scopeAdded, scopeRemoved, scopeModified } = board.health;
  const net = scopeAdded + scopeModified - scopeRemoved;

  const getStatusColor = (s: string) => {
    if (s === 'healthy') return 'bg-emerald-500 shadow-emerald-200';
    if (s === 'warning') return 'bg-amber-500 shadow-amber-200';
    if (s === 'critical') return 'bg-rose-500 shadow-rose-200';
    return 'bg-slate-500 shadow-slate-200';
  };
  
  const getUnderstandingColor = (lvl: string) => {
    if (lvl === 'A') return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (lvl === 'B') return 'bg-blue-100 text-blue-800 border-blue-300';
    if (lvl === 'C') return 'bg-amber-100 text-amber-800 border-amber-300';
    return 'bg-slate-100 text-slate-800 border-slate-300';
  };

  return (
    <div className="mb-6 lg:mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Board Info Card */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-lg border border-slate-200 p-6 flex flex-col hover:shadow-xl hover:border-slate-300 transition-all duration-300 h-80">
          <div className="flex items-start space-x-4">
            <div className={`w-3 h-3 rounded-full shadow-md ${getStatusColor(board.health.status)} mt-1.5`}></div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-slate-900 truncate">{board.name}</h3>
              <div className="mt-2">
                <span className="text-sm font-semibold bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200">
                  {board.project}
                </span>
              </div>
              <div className="text-sm text-slate-600 mt-3 font-medium">{board.projectManager}</div>
              <div
                className={`inline-flex items-center px-3 py-1.5 text-sm font-bold mt-3 rounded-lg border-2 ${getUnderstandingColor(
                  board.health.sprintUnderstanding
                )}`}
              >
                Level {board.health.sprintUnderstanding}
              </div>
            </div>
          </div>
          <div className="mt-auto pt-6 border-t border-slate-200 grid grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{board.totalIssues}</div>
              <div className="text-xs uppercase text-slate-500 font-semibold tracking-wide">Total Issues</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">{board.remainingIssues}</div>
              <div className="text-xs uppercase text-slate-500 font-semibold tracking-wide">Remaining</div>
            </div>
          </div>
        </div>

        {/* Burndown Chart */}
        <div className="lg:col-span-4 h-80">
          <BurndownChart data={board.health.burndownData} sprintDates={board.health.sprintDates} />
        </div>

        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Scope Summary */}
          {net !== 0 && (
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-4">
              <div className="text-sm font-semibold text-slate-800">
                Sprint scope has{' '}
                <span className={`font-bold ${net > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {net > 0 ? 'increased' : 'decreased'} by {Math.abs(net)} points
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            <ScopeTile label="Added" value={scopeAdded} workItemCount={scopeAdded} variant="added" />
            <ScopeTile label="Removed" value={-scopeRemoved} workItemCount={scopeRemoved} variant="removed" />
            <ScopeTile label="Modified" value={scopeModified} workItemCount={scopeModified} variant="modified" />
          </div>
        </div>
      </div>
    </div>
  );
};

const EMCard: React.FC<{ em: EngineeringManager }> = ({ em }) => {
  const getRatingColor = (r: string) => {
    if (r === 'A') return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (r === 'B') return 'bg-blue-100 text-blue-800 border-blue-300';
    if (r === 'C') return 'bg-amber-100 text-amber-800 border-amber-300';
    return 'bg-slate-100 text-slate-800 border-slate-300';
  };
  
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 h-full flex flex-col hover:shadow-xl hover:border-slate-300 transition-all duration-300">
      <div className="flex items-start space-x-4 mb-6">
        <div className="relative">
          <img
            src={em.avatar}
            alt={em.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-200 shadow-md"
          />
          <div
            className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 border-white text-sm shadow-md ${getRatingColor(
              em.understandingLevel
            )}`}
          >
            {em.understandingLevel}
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-bold text-slate-900 truncate">{em.name}</h3>
          <p className="text-sm text-slate-600 truncate font-medium">{em.title}</p>
          <div className="flex items-center space-x-2 mt-2">
            <Building2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span className="text-sm text-slate-600 truncate">{em.department}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4 flex-1 flex flex-col justify-between">
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all duration-200">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-semibold uppercase text-slate-700 tracking-wide">
                Experience
              </span>
            </div>
            <div className="text-lg font-bold text-slate-800">{em.experience}</div>
          </div>
          <div className="bg-gradient-to-r from-slate-50 to-purple-50 border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all duration-200">
            <div className="flex items-center space-x-2 mb-2">
              <Award className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-semibold uppercase text-slate-700 tracking-wide">
                Understanding Level
              </span>
            </div>
            <div className="text-lg font-bold text-slate-800">
              Level {em.understandingLevel}
            </div>
          </div>
          <div className="bg-gradient-to-r from-slate-50 to-amber-50 border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all duration-200">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-semibold uppercase text-slate-700 tracking-wide">
                Target Date to A
              </span>
            </div>
            <div className="text-sm font-bold text-slate-700">{formatDate(em.understandingTargetDate)}</div>
          </div>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-semibold text-slate-700">{em.teamsCount} Teams</span>
          </div>
          <span className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-lg text-sm font-bold border border-blue-200">
            {em.boards.length} Boards
          </span>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredData = useMemo(() => {
    if (!searchTerm) return mockData;
    return mockData.filter(em =>
      em.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      em.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      em.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      em.boards.some(b =>
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.project.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-slate-200 backdrop-blur-sm">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
            <div className="min-w-0">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
                Engineering Dashboard
              </h1>
              <p className="text-slate-600 mt-2 text-base lg:text-lg font-medium">
                Board of Boards Overview • Real-time Engineering Metrics
              </p>
            </div>
            <div className="relative w-full lg:w-auto lg:min-w-[28rem]">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search managers, teams, or boards..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full lg:w-96 pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl bg-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base shadow-sm hover:shadow-md"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {filteredData.length === 0 ? (
          <div className="text-center text-slate-500 py-20">
            <div className="text-lg font-medium">No results found for "{searchTerm}"</div>
            <div className="text-sm mt-2">Try adjusting your search criteria</div>
          </div>
        ) : (
          filteredData.map(em => (
            <div
              key={em.id}
              className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8 lg:p-10 hover:shadow-2xl hover:border-slate-300 transition-all duration-300"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-3">
                  <EMCard em={em} />
                </div>
                <div className="lg:col-span-9 space-y-8">
                  {em.boards.map(b => (
                    <BoardRow key={b.id} board={b} />
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;