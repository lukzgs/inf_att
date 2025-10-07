import { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { FiTrendingUp, FiUsers, FiCalendar, FiAward, FiAlertCircle } from 'react-icons/fi';

// Mock data - TODO: Substituir por dados reais da API
const attendanceTrendData = [
  { month: 'Jan', frequency: 85 },
  { month: 'Fev', frequency: 88 },
  { month: 'Mar', frequency: 82 },
  { month: 'Abr', frequency: 90 },
  { month: 'Mai', frequency: 87 },
  { month: 'Jun', frequency: 92 },
  { month: 'Jul', frequency: 89 },
  { month: 'Ago', frequency: 91 },
  { month: 'Set', frequency: 88 },
  { month: 'Out', frequency: 94 },
];

const classSizeData = [
  { name: 'INF101', students: 35 },
  { name: 'INF102', students: 28 },
  { name: 'INF201', students: 42 },
  { name: 'INF202', students: 31 },
  { name: 'INF301', students: 25 },
  { name: 'INF302', students: 38 },
];

const frequencyDistributionData = [
  { range: '90-100%', count: 45, color: '#10b981' },
  { range: '80-89%', count: 32, color: '#3b82f6' },
  { range: '70-79%', count: 18, color: '#f59e0b' },
  { range: 'Abaixo 70%', count: 8, color: '#ef4444' },
];

const departmentStatsData = [
  { department: 'Algoritmos', classes: 12, students: 420, avgFrequency: 88 },
  { department: 'Banco de Dados', classes: 8, students: 280, avgFrequency: 92 },
  { department: 'Redes', classes: 6, students: 210, avgFrequency: 85 },
  { department: 'Engenharia SW', classes: 10, students: 350, avgFrequency: 90 },
];

export default function StatisticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'semester'>('month');

  // Stats cards data
  const statsCards = [
    {
      title: 'Frequência Média',
      value: '89.5%',
      change: '+2.3%',
      changeType: 'positive' as 'positive' | 'negative' | 'neutral',
      icon: FiTrendingUp,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Total de Alunos',
      value: '1,260',
      change: '+45',
      changeType: 'positive' as 'positive' | 'negative' | 'neutral',
      icon: FiUsers,
      color: 'text-info',
      bgColor: 'bg-info/10',
    },
    {
      title: 'Turmas Ativas',
      value: '36',
      change: '0',
      changeType: 'neutral' as 'positive' | 'negative' | 'neutral',
      icon: FiCalendar,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Alunos em Risco',
      value: '8',
      change: '-3',
      changeType: 'positive' as 'positive' | 'negative' | 'neutral',
      icon: FiAlertCircle,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-base-content">Estatísticas</h1>
          <p className="text-base-content/70 mt-2">
            Visão geral do desempenho acadêmico
          </p>
        </div>

        {/* Period Filter */}
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedPeriod('week')}
            className={`btn btn-sm ${selectedPeriod === 'week' ? 'btn-accent' : 'btn-outline'}`}
          >
            Semana
          </button>
          <button
            onClick={() => setSelectedPeriod('month')}
            className={`btn btn-sm ${selectedPeriod === 'month' ? 'btn-accent' : 'btn-outline'}`}
          >
            Mês
          </button>
          <button
            onClick={() => setSelectedPeriod('semester')}
            className={`btn btn-sm ${selectedPeriod === 'semester' ? 'btn-accent' : 'btn-outline'}`}
          >
            Semestre
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <div key={index} className="premium-card p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-base-content/70 text-sm font-medium">{stat.title}</p>
                <p className="text-3xl font-bold text-base-content mt-2">{stat.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  <span
                    className={`text-sm font-semibold ${
                      stat.changeType === 'positive'
                        ? 'text-success'
                        : stat.changeType === 'negative'
                        ? 'text-error'
                        : 'text-base-content/50'
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-xs text-base-content/50">vs período anterior</span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={stat.color} size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trend Chart */}
        <div className="premium-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FiTrendingUp className="text-primary" />
              Tendência de Frequência
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={attendanceTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--bc) / 0.1)" />
              <XAxis
                dataKey="month"
                stroke="hsl(var(--bc) / 0.5)"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="hsl(var(--bc) / 0.5)"
                style={{ fontSize: '12px' }}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--b1))',
                  border: '1px solid hsl(var(--bc) / 0.2)',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="frequency"
                name="Frequência (%)"
                stroke="hsl(var(--p))"
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--p))', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Class Size Chart */}
        <div className="premium-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FiUsers className="text-info" />
              Alunos por Turma
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={classSizeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--bc) / 0.1)" />
              <XAxis
                dataKey="name"
                stroke="hsl(var(--bc) / 0.5)"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="hsl(var(--bc) / 0.5)"
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--b1))',
                  border: '1px solid hsl(var(--bc) / 0.2)',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar
                dataKey="students"
                name="Alunos"
                fill="hsl(var(--in))"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Frequency Distribution Pie Chart */}
        <div className="premium-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FiAward className="text-success" />
              Distribuição de Frequência
            </h2>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={frequencyDistributionData}
                  dataKey="count"
                  nameKey="range"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(entry) => `${entry.range}: ${entry.count}`}
                  labelLine={false}
                >
                  {frequencyDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--b1))',
                    border: '1px solid hsl(var(--bc) / 0.2)',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {frequencyDistributionData.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">
                    {item.range}: <strong>{item.count} alunos</strong>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Department Stats Table */}
        <div className="premium-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FiCalendar className="text-accent" />
              Estatísticas por Área
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="table table-xs">
              <thead>
                <tr>
                  <th>Área</th>
                  <th className="text-center">Turmas</th>
                  <th className="text-center">Alunos</th>
                  <th className="text-center">Freq. Média</th>
                </tr>
              </thead>
              <tbody>
                {departmentStatsData.map((dept, index) => (
                  <tr key={index} className="hover">
                    <td className="font-semibold">{dept.department}</td>
                    <td className="text-center">{dept.classes}</td>
                    <td className="text-center">{dept.students}</td>
                    <td className="text-center">
                      <span
                        className={`badge badge-sm ${
                          dept.avgFrequency >= 90
                            ? 'badge-success'
                            : dept.avgFrequency >= 80
                            ? 'badge-info'
                            : dept.avgFrequency >= 70
                            ? 'badge-warning'
                            : 'badge-error'
                        }`}
                      >
                        {dept.avgFrequency}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-bold">
                  <td>Total</td>
                  <td className="text-center">
                    {departmentStatsData.reduce((sum, d) => sum + d.classes, 0)}
                  </td>
                  <td className="text-center">
                    {departmentStatsData.reduce((sum, d) => sum + d.students, 0)}
                  </td>
                  <td className="text-center">
                    {(
                      departmentStatsData.reduce((sum, d) => sum + d.avgFrequency, 0) /
                      departmentStatsData.length
                    ).toFixed(1)}
                    %
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="premium-card p-4 border-l-4 border-success">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <FiTrendingUp className="text-success" size={20} />
            </div>
            <div>
              <p className="text-sm text-base-content/70">Melhor Desempenho</p>
              <p className="font-bold">Banco de Dados - 92%</p>
            </div>
          </div>
        </div>

        <div className="premium-card p-4 border-l-4 border-info">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
              <FiUsers className="text-info" size={20} />
            </div>
            <div>
              <p className="text-sm text-base-content/70">Maior Turma</p>
              <p className="font-bold">INF201 - 42 alunos</p>
            </div>
          </div>
        </div>

        <div className="premium-card p-4 border-l-4 border-warning">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <FiAlertCircle className="text-warning" size={20} />
            </div>
            <div>
              <p className="text-sm text-base-content/70">Necessita Atenção</p>
              <p className="font-bold">8 alunos abaixo 70%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
