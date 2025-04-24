"use client";
import { useState, useEffect } from "react";
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
import api from "@/app/middleware/authMiddleware";
import { API_CONFIG } from "@/config/api";

interface Props {
  roleId: number | null;
}

interface Lead {
  id: number;
  userId: number;
  organisationId: number;
  leadTypeId: number;
  leadSourceId: number;
  firstName: string;
  lastName: string;
  emailId: string;
  description: string;
  status: string;
  leadTypeName: string;
  leadSourceName: string;
}

export function Dashboard({ roleId }: Props) {
  const [countTotal, setCountTotal] = useState<number>(0);
  const [countNew, setCountNew] = useState<number>(0);
  const [countDiscussion, setCountDiscussion] = useState<number>(0);
  const [countHot, setCountHot] = useState<number>(0);
  const [countHold, setCountHold] = useState<number>(0);
  const [countClosed, setCountClosed] = useState<number>(0);

  const [loading, setLoading] = useState(true);

  const COLORS = ["#4f46e5", "#10b981", "#f59e0b"];
  const salesData = [
    { stage: "New", count: countNew },
    { stage: "Discussion", count: countDiscussion },
    { stage: "Hot", count: countHot },
    { stage: "Hold", count: countHold },
    { stage: "Closed", count: countClosed },
  ];

  //---------------------------------fetch all leads By Organisation-----------------------------------
  const fetchLeadsByOrganisation = async () => {
    try {
      setLoading(true);
      const response = await api.post(
        API_CONFIG.GET_ALL_LEAD_BY_ORGANISATION,
        {}
      );
      if (
        response?.data?.Leads &&
        Object.keys(response.data.Leads).length > 0
      ) {
        const leadData: Lead[] = response.data.Leads.map((leadUser: Lead) => ({
          id: leadUser.id,
          userId: leadUser.userId,
          organisationId: leadUser.organisationId,
          leadSourceId: leadUser.leadSourceId,
          leadTypeId: leadUser.leadTypeId,
          status: leadUser.status,
          description: leadUser.description,
        }));

        setCountTotal(leadData.length);

        const newCount = leadData.filter(
          (lead: Lead) => lead.status === "New"
        ).length;
        const discussionCount = leadData.filter(
          (lead: Lead) => lead.status === "Discussion"
        ).length;
        const hotCount = leadData.filter(
          (lead: Lead) => lead.status === "Hot"
        ).length;
        const holdCount = leadData.filter(
          (lead: Lead) => lead.status === "Hold"
        ).length;
        const closedCount = leadData.filter(
          (lead: Lead) => lead.status === "Closed"
        ).length;

        setCountNew(newCount);
        setCountDiscussion(discussionCount);
        setCountHot(hotCount);
        setCountHold(holdCount);
        setCountClosed(closedCount);
      }
    } catch (error) {
      console.log("error in fetching leads", error);
    } finally {
      setLoading(false);
    }
  };

  //---------------------------------get allLeads for user-----------------------------------
  const fetchLeadsForUser = async () => {
    try {
      setLoading(true);
      const response = await api.post(API_CONFIG.GET_LEAD_BY_USER, {});
      if (response.data && response.data.length > 0) {
        const leadData = response.data.map((leadUser: Lead) => ({
          id: leadUser.id,
          userId: leadUser.userId,
          organisationId: leadUser.organisationId,
          leadSourceId: leadUser.leadSourceId,
          leadTypeId: leadUser.leadTypeId,
          status: leadUser.status,
          description: leadUser.description,
        }));
        setCountTotal(leadData.length);

        const newCount = leadData.filter(
          (lead: Lead) => lead.status === "New"
        ).length;
        const discussionCount = leadData.filter(
          (lead: Lead) => lead.status === "Discussion"
        ).length;
        const hotCount = leadData.filter(
          (lead: Lead) => lead.status === "Hot"
        ).length;
        const holdCount = leadData.filter(
          (lead: Lead) => lead.status === "Hold"
        ).length;
        const closedCount = leadData.filter(
          (lead: Lead) => lead.status === "Closed"
        ).length;

        setCountNew(newCount);
        setCountDiscussion(discussionCount);
        setCountHot(hotCount);
        setCountHold(holdCount);
        setCountClosed(closedCount);
      }
    } catch (error) {
      console.log("error in fetching leads", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (roleId === 1) {
      fetchLeadsByOrganisation();
    } else {
      fetchLeadsForUser();
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
