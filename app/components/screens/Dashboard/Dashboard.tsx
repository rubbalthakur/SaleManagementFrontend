"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/app/store/store";
import {
  fetchLeadsForAdmin,
  fetchLeadsForUser,
} from "@/app/store/features/leads/leadSlice";
import { Lead } from "@/types/Lead";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Cell,
} from "recharts";
import { Card, CardContent } from "../../ui/card";

export function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const roleId = useSelector((state: RootState) => state.auth.roleId);
  const allLeads = useSelector((state: RootState) => state.leads.leads);
  const loading = useSelector((state: RootState) => state.leads.loading);

  const [countTotal, setCountTotal] = useState<number>(0);
  const [countNew, setCountNew] = useState<number>(0);
  const [countDiscussion, setCountDiscussion] = useState<number>(0);
  const [countHot, setCountHot] = useState<number>(0);
  const [countHold, setCountHold] = useState<number>(0);
  const [countClosed, setCountClosed] = useState<number>(0);

  const COLORS = ["#4f46e5", "#10b981", "#f59e0b"];
  const salesData = [
    { stage: "New", count: countNew },
    { stage: "Discussion", count: countDiscussion },
    { stage: "Hot", count: countHot },
    { stage: "Hold", count: countHold },
    { stage: "Closed", count: countClosed },
  ];

  useEffect(() => {
    setCountTotal(allLeads.length);

    const newCount = allLeads.filter(
      (lead: Lead) => lead.status === "New"
    ).length;
    const discussionCount = allLeads.filter(
      (lead: Lead) => lead.status === "Discussion"
    ).length;
    const hotCount = allLeads.filter(
      (lead: Lead) => lead.status === "Hot"
    ).length;
    const holdCount = allLeads.filter(
      (lead: Lead) => lead.status === "Hold"
    ).length;
    const closedCount = allLeads.filter(
      (lead: Lead) => lead.status === "Closed"
    ).length;

    setCountNew(newCount);
    setCountDiscussion(discussionCount);
    setCountHot(hotCount);
    setCountHold(holdCount);
    setCountClosed(closedCount);
  }, [allLeads]);

  useEffect(() => {
    if (roleId === 1) {
      dispatch(fetchLeadsForAdmin());
    } else {
      dispatch(fetchLeadsForUser());
    }
  }, [roleId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-black">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold text-black">Total Leads</h2>
            <p className="text-3xl font-bold text-black">{countTotal}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold text-black">
              Converted Leads
            </h2>
            <p className="text-3xl font-bold text-black">{countClosed}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold text-black">
              Conversion Rate
            </h2>
            <p className="text-3xl font-bold text-black">
              {((countClosed * 100) / countTotal).toFixed(2)}%
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="bg-white p-6 shadow rounded-lg">
        <h2 className="text-lg font-semibold mb-4 text-black">
          Sales Funnel Overview
        </h2>
        <ResponsiveContainer width="70%" height={300}>
          <BarChart data={salesData}>
            <XAxis dataKey="stage" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
        <ResponsiveContainer width="50%" height={300}>
          <PieChart width={400} height={400}>
            <Pie
              data={salesData}
              dataKey="count"
              nameKey="stage"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {salesData.map((_, index) => (
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
  );
}
