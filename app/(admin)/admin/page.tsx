"use client";

import {
  DollarSign,
  ShoppingCart,
  Users,
  AlertTriangle,
  TrendingUp,
  Package,
} from "lucide-react";

function KPICard({
  title,
  value,
  change,
  icon: Icon,
}: {
  title: string;
  value: string;
  change?: string;
  icon: React.ElementType;
}) {
  return (
    <div className="p-5 rounded-2xl bg-[#1a1a1e] border border-[#2a2a2e]">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-[#8b8b8b] uppercase tracking-wider">
          {title}
        </span>
        <Icon className="w-4 h-4 text-amber-400" />
      </div>
      <p className="text-2xl font-semibold">{value}</p>
      {change && (
        <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          {change}
        </p>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils/currency";

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch("/api/v1/admin/analytics");
        if (res.ok) {
          setData(await res.json());
        }
      } catch (e) {
        console.error("Failed to fetch analytics");
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);
  const summary = data?.summary || { totalRevenue: 0, totalOrders: 0, totalCustomers: 0, pendingOrders: 0 };

  const kpis = [
    {
      title: "Total Revenue",
      value: formatCurrency(summary.totalRevenue || 0),
      icon: DollarSign,
    },
    {
      title: "Total Orders",
      value: summary.totalOrders?.toString() || "0",
      icon: ShoppingCart,
    },
    {
      title: "Customers",
      value: summary.totalCustomers?.toString() || "0",
      icon: Users,
    },
    {
      title: "Pending Orders",
      value: summary.pendingOrders?.toString() || "0",
      icon: AlertTriangle,
    },
  ];

  if (loading) {
    return <div className="p-8 text-center text-[#8b8b8b]">Loading dashboard...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-[#8b8b8b] mt-1">
            Welcome back. Here&apos;s what&apos;s happening with your store.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map((kpi) => (
          <KPICard key={kpi.title} {...kpi} />
        ))}
      </div>

      {/* Charts placeholder + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        {/* Revenue Chart */}
        <div className="p-6 rounded-2xl bg-[#1a1a1e] border border-[#2a2a2e]">
          <h2 className="text-sm font-medium mb-6">Revenue (Last 30 Days)</h2>
          <div className="h-[240px] flex items-center justify-center text-sm text-[#8b8b8b]">
            Chart will render when connected to analytics data.
          </div>
        </div>

        {/* Recent Orders */}
        <div className="p-6 rounded-2xl bg-[#1a1a1e] border border-[#2a2a2e] overflow-auto hover:border-[#3a3a3e] transition-colors">
          <h2 className="text-sm font-medium mb-6 flex justify-between items-center">
            Recent Orders
            <span className="text-[#8b8b8b] text-xs font-normal">Last 5 orders</span>
          </h2>
          
          {data?.recentOrders?.length > 0 ? (
            <div className="space-y-4">
              {data.recentOrders.map((order: any) => (
                <div key={order.id} className="flex justify-between items-center p-3 rounded-lg hover:bg-[#2a2a2e] transition-colors">
                  <div>
                    <p className="font-mono text-xs text-amber-400 mb-1">{order.orderNumber}</p>
                    <p className="text-sm">{order.user?.name || order.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{formatCurrency(order.total)}</p>
                    <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full mt-1 inline-block ${
                      order.status === 'confirmed' ? 'bg-blue-500/10 text-blue-400' :
                      order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                      'bg-gray-500/10 text-gray-400'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-sm text-[#8b8b8b]">
              <Package className="w-8 h-8 mx-auto mb-3 opacity-50" />
              No orders yet
            </div>
          )}
        </div>
      </div>

      {/* Top Products */}
      <div className="mt-6 p-6 rounded-2xl bg-[#1a1a1e] border border-[#2a2a2e]">
        <h2 className="text-sm font-medium mb-6">Top Products (By Quantity Sold)</h2>
        {data?.topProducts?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-[#8b8b8b] border-b border-[#2a2a2e]">
                  <th className="pb-3 font-medium">Product Name</th>
                  <th className="pb-3 font-medium text-right">Units Sold</th>
                  <th className="pb-3 font-medium text-right">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {data.topProducts.map((p: any, i: number) => (
                  <tr key={i} className="border-b border-[#2a2a2e] last:border-0 hover:bg-[#2a2a2e]/50 transition-colors">
                    <td className="py-3">{p.productName}</td>
                    <td className="py-3 text-right">{p.totalQuantity}</td>
                    <td className="py-3 text-right text-emerald-400">{formatCurrency(p.totalRevenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-sm text-[#8b8b8b]">
            No sales data available yet.
          </div>
        )}
      </div>
    </div>
  );
}
