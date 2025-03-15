'use client'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Tooltip, Cell } from "recharts";
import { Card, CardContent } from "../../ui/card";

export function Dashboard() {

    const COLORS = ["#4f46e5", "#10b981", "#f59e0b"];
    const salesData = [
        { stage: "New Leads", count: 120 },
        { stage: "Contacted", count: 80 },
        { stage: "Qualified", count: 60 },
        { stage: "Proposal Sent", count: 30 },
        { stage: "Closed Deals", count: 15 },
    ];

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold text-black">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardContent>
                        <h2 className="text-lg font-semibold text-black">Total Leads</h2>
                        <p className="text-3xl font-bold text-black">305</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <h2 className="text-lg font-semibold text-black">Converted Leads</h2>
                        <p className="text-3xl font-bold text-black">45</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <h2 className="text-lg font-semibold text-black">Conversion Rate</h2>
                        <p className="text-3xl font-bold text-black">14.8%</p>
                    </CardContent>
                </Card>
            </div>
            <div className="bg-white p-6 shadow rounded-lg">
                <h2 className="text-lg font-semibold mb-4 text-black">Sales Funnel Overview</h2>
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
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}