import { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart2, Database, Table, Users, Activity } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

// Add these chart options
const chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        padding: 20,
        usePointStyle: true,
        pointStyle: 'circle',
      },
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      titleFont: {
        size: 14,
        weight: 'bold',
      },
      bodyFont: {
        size: 13,
      },
      callbacks: {
        label: function(context) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += context.parsed.y.toLocaleString();
          }
          return label;
        }
      }
    },
  },
}

const DatabaseVisualization = () => {
  const [selectedDatabase, setSelectedDatabase] = useState('')
  const [timeRange, setTimeRange] = useState('7d')

  // Demo data
  const databases = [
    { id: 1, name: 'Production DB', tables: 12, size: '2.5 GB', connections: 45 },
    { id: 2, name: 'Analytics DB', tables: 8, size: '1.8 GB', connections: 32 },
    { id: 3, name: 'Development DB', tables: 6, size: '950 MB', connections: 15 },
  ]

  const queryStats = [
    { date: '2024-03-01', count: 1250, avgTime: 0.8 },
    { date: '2024-03-02', count: 1420, avgTime: 0.7 },
    { date: '2024-03-03', count: 1380, avgTime: 0.9 },
    { date: '2024-03-04', count: 1560, avgTime: 0.6 },
    { date: '2024-03-05', count: 1680, avgTime: 0.8 },
    { date: '2024-03-06', count: 1450, avgTime: 0.7 },
    { date: '2024-03-07', count: 1320, avgTime: 0.8 },
  ]

  const tableStats = [
    { name: 'users', rows: 15000, size: '450 MB', lastUpdated: '2 hours ago' },
    { name: 'orders', rows: 8500, size: '280 MB', lastUpdated: '1 hour ago' },
    { name: 'products', rows: 3200, size: '120 MB', lastUpdated: '3 hours ago' },
    { name: 'categories', rows: 150, size: '2 MB', lastUpdated: '5 hours ago' },
  ]

  // Chart data
  const queryPerformanceData = {
    labels: queryStats.map(stat => stat.date),
    datasets: [
      {
        label: 'Query Count',
        data: queryStats.map(stat => stat.count),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4,
      },
      {
        label: 'Average Time (ms)',
        data: queryStats.map(stat => stat.avgTime * 1000),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        tension: 0.4,
        yAxisID: 'y1',
      },
    ],
  }

  // Enhanced Query Performance Chart
  const queryPerformanceOptions = {
    ...chartDefaults,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Query Count',
          font: {
            size: 12,
            weight: 'bold',
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Average Time (ms)',
          font: {
            size: 12,
            weight: 'bold',
          },
        },
        grid: {
          drawOnChartArea: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      ...chartDefaults.plugins,
      title: {
        display: true,
        text: 'Query Performance Over Time',
        font: {
          size: 16,
          weight: 'bold',
        },
        padding: {
          bottom: 20,
        },
      },
    },
  }

  const tableSizeData = {
    labels: tableStats.map(table => table.name),
    datasets: [
      {
        label: 'Table Size (MB)',
        data: tableStats.map(table => {
          const size = parseFloat(table.size)
          return size
        }),
        backgroundColor: [
          'rgba(59, 130, 246, 0.5)',
          'rgba(16, 185, 129, 0.5)',
          'rgba(245, 158, 11, 0.5)',
          'rgba(139, 92, 246, 0.5)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(139, 92, 246)',
        ],
        borderWidth: 1,
      },
    ],
  }

  // Enhanced Table Size Chart
  const tableSizeOptions = {
    ...chartDefaults,
    indexAxis: 'y',
    plugins: {
      ...chartDefaults.plugins,
      title: {
        display: true,
        text: 'Table Size Distribution',
        font: {
          size: 16,
          weight: 'bold',
        },
        padding: {
          bottom: 20,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: 'Size (MB)',
          font: {
            size: 12,
            weight: 'bold',
          },
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
  }

  const queryTypeData = {
    labels: ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'JOIN'],
    datasets: [
      {
        data: [45, 20, 15, 10, 10],
        backgroundColor: [
          'rgba(59, 130, 246, 0.5)',
          'rgba(16, 185, 129, 0.5)',
          'rgba(245, 158, 11, 0.5)',
          'rgba(239, 68, 68, 0.5)',
          'rgba(139, 92, 246, 0.5)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
          'rgb(139, 92, 246)',
        ],
        borderWidth: 1,
      },
    ],
  }

  // Enhanced Query Types Chart
  const queryTypeOptions = {
    ...chartDefaults,
    plugins: {
      ...chartDefaults.plugins,
      title: {
        display: true,
        text: 'Query Types Distribution',
        font: {
          size: 16,
          weight: 'bold',
        },
        padding: {
          bottom: 20,
        },
      },
    },
    cutout: '70%',
    rotation: -90,
    circumference: 180,
    layout: {
      padding: {
        top: 20,
      },
    },
  }

  // Add a new chart for Database Growth
  const growthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Database Size (GB)',
        data: [1.2, 1.5, 1.8, 2.1, 2.4, 2.5],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Row Count (K)',
        data: [15, 18, 22, 25, 28, 30],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  }

  const growthOptions = {
    ...chartDefaults,
    plugins: {
      ...chartDefaults.plugins,
      title: {
        display: true,
        text: 'Database Growth Trend',
        font: {
          size: 16,
          weight: 'bold',
        },
        padding: {
          bottom: 20,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        title: {
          display: true,
          text: 'Size (GB) / Row Count (K)',
          font: {
            size: 12,
            weight: 'bold',
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  }

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Database Visualization</h1>
              <p className="text-gray-600 dark:text-gray-400">Monitor and analyze your database performance</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedDatabase}
                onChange={(e) => setSelectedDatabase(e.target.value)}
                className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-[#00E5FF] focus:border-transparent"
              >
                <option value="">Select Database</option>
                {databases.map((db) => (
                  <option key={db.id} value={db.id}>
                    {db.name}
                  </option>
                ))}
              </select>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-[#00E5FF] focus:border-transparent"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/50 dark:bg-[#111113]/50 backdrop-blur-xl rounded-xl p-6 border border-gray-200/50 dark:border-gray-800/50"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900">
                  <Database className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Tables</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">12</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/50 dark:bg-[#111113]/50 backdrop-blur-xl rounded-xl p-6 border border-gray-200/50 dark:border-gray-800/50"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900">
                  <Table className="w-6 h-6 text-green-500 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Rows</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">26.7K</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/50 dark:bg-[#111113]/50 backdrop-blur-xl rounded-xl p-6 border border-gray-200/50 dark:border-gray-800/50"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900">
                  <Users className="w-6 h-6 text-purple-500 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Connections</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">45</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/50 dark:bg-[#111113]/50 backdrop-blur-xl rounded-xl p-6 border border-gray-200/50 dark:border-gray-800/50"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900">
                  <Activity className="w-6 h-6 text-orange-500 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Queries/sec</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">156</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Query Performance Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/50 dark:bg-[#111113]/50 backdrop-blur-xl rounded-xl p-6 border border-gray-200/50 dark:border-gray-800/50"
            >
              <div className="h-80">
                <Line options={queryPerformanceOptions} data={queryPerformanceData} />
              </div>
            </motion.div>

            {/* Database Growth Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/50 dark:bg-[#111113]/50 backdrop-blur-xl rounded-xl p-6 border border-gray-200/50 dark:border-gray-800/50"
            >
              <div className="h-80">
                <Line options={growthOptions} data={growthData} />
              </div>
            </motion.div>
          </div>

          {/* Additional Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Table Size Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white/50 dark:bg-[#111113]/50 backdrop-blur-xl rounded-xl p-6 border border-gray-200/50 dark:border-gray-800/50"
            >
              <div className="h-80">
                <Bar options={tableSizeOptions} data={tableSizeData} />
              </div>
            </motion.div>

            {/* Query Types Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white/50 dark:bg-[#111113]/50 backdrop-blur-xl rounded-xl p-6 border border-gray-200/50 dark:border-gray-800/50"
            >
              <div className="h-80">
                <Doughnut options={queryTypeOptions} data={queryTypeData} />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}

export default DatabaseVisualization 

