import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AlertTriangle, TrendingUp, Users, FileCheck } from "lucide-react";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

const AdminHome = () => {
  const [dashboardData, setDashboardData] = useState({
    total_policies: 0,
    policy_distribution: { active: 0, pending: 0 },
    claims_distribution: { approved: 0, pending: 0, rejected: 0 },
    total_users: 0,
    fraud_detection_rate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(
          "https://hack-ai-thon-project-d8qt.onrender.com/admin/dashboard"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="p-6">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">Error: {error}</div>;
  }

  // Transform data for charts
  const policyData = [
    { name: "Active", value: dashboardData.policy_distribution.active },
    { name: "Pending", value: dashboardData.policy_distribution.pending },
  ];

  const claimData = [
    { name: "Approved", value: dashboardData.claims_distribution.approved },
    { name: "Pending", value: dashboardData.claims_distribution.pending },
    { name: "Rejected", value: dashboardData.claims_distribution.rejected },
  ];

  const fraudData = [
    { name: "Non-Fraudulent", cases: 100 - dashboardData.fraud_detection_rate },
    { name: "Fraudulent", cases: dashboardData.fraud_detection_rate },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Dashboard Overview
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Total Policies</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {dashboardData.total_policies.toLocaleString()}
              </h3>
            </div>
            <FileCheck className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Active Claims</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {(
                  dashboardData.claims_distribution.approved +
                  dashboardData.claims_distribution.pending
                ).toLocaleString()}
              </h3>
            </div>
            <AlertTriangle className="text-yellow-500" size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Total Users</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {dashboardData.total_users.toLocaleString()}
              </h3>
            </div>
            <Users className="text-green-500" size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Fraud Detection Rate</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {dashboardData.fraud_detection_rate}%
              </h3>
            </div>
            <TrendingUp className="text-red-500" size={24} />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Policy Status Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Policy Status Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={policyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {policyData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Claims Distribution Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Claims Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={claimData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {claimData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fraud Cases Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 col-span-2">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Fraud Detection Overview
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={fraudData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Bar dataKey="cases" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
