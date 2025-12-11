'use client';

import Card, { CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Users, FileText } from 'lucide-react';
import { diagnosticsChartData, aiAssistanceChartData } from '@/services/mockData';
import { getRecentPatients, getPatientMonthlyResume, getInquiryMonthlyResume, getInquiryMonthlyChart } from '@/services/dashboardApi';
import { useState, useEffect } from 'react';
import { FullScreenLoader } from '@/components/ui/Loader';

export default function DashboardPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [recentPatients, setRecentPatients] = useState([]);
    const [monthlyPatientResume, setMonthlyPatientResume] = useState({total: 0, previous: 0, changePercent: 0});
    const [monthlyInquiryResume, setMonthlyInquiryResume] = useState({total: 0, previous: 0, changePercent: 0});
    const [monthlyInquiryChart, setMonthlyInquiryChart] = useState([]);
    const [isChartLoading, setIsChartLoading] = useState(false);
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const years = [currentYear, currentYear - 1, currentYear - 2, currentYear - 3, currentYear - 4];

    // Obtener toda la data para el dashboard
    useEffect(() => {
        const getDashboardData = async () => {
            setIsLoading(true);
            try {
                const patientsData = await getRecentPatients();
                setRecentPatients(patientsData);

                const monthlyPatientData = await getPatientMonthlyResume();
                setMonthlyPatientResume(monthlyPatientData);
                
                const monthlyInquiryData = await getInquiryMonthlyResume();
                setMonthlyInquiryResume(monthlyInquiryData);

            } finally {
                setIsLoading(false);
            }
        }
        getDashboardData();
    }, []);

    useEffect(() => {
        let active = true;
        const fetchChart = async () => {
            setIsChartLoading(true);
            try {
                const data = await getInquiryMonthlyChart(selectedYear);
                if (active) setMonthlyInquiryChart(data);
            } finally {
                if (active) setIsChartLoading(false);
            }
        };
        fetchChart();
        return () => { active = false };
    }, [selectedYear]);

    if(isLoading) {
        return <FullScreenLoader />;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-clinical-gray-900">Dashboard</h1>
                <p className="text-clinical-gray-600 mt-1">Resumen general del sistema</p>
            </div>

            {/* Row 1: Chart + Recent Patients */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Diagnostics Chart */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <div className="flex items-center justify-between gap-4">
                            <CardTitle>Diagnósticos Realizados</CardTitle>
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(Number(e.target.value))}
                                className="px-3 py-2 border rounded-lg text-sm text-clinical-gray-700 bg-white"
                            >
                                {years.map((y) => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px] lg:h-[300px] w-full">
                            {isChartLoading ? (
                                <div className="h-full w-full bg-white border border-clinical-gray-200 rounded-lg overflow-hidden p-4 animate-pulse">
                                    {/* <div className="h-4 w-1/4 bg-clinical-gray-200 rounded mb-4" /> */}
                                    <div className="h-full bg-clinical-gray-200 rounded-xl" />
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={monthlyInquiryChart} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="month" stroke="#6b7280" fontSize={12} tickMargin={10} />
                                        <YAxis stroke="#6b7280" fontSize={12} domain={[0, 'dataMax']} allowDecimals={false} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'white',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '12px'
                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="total"
                                            stroke="#2563eb"
                                            strokeWidth={2}
                                            dot={{ fill: '#2563eb', r: 4 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Patients */}
                <Card>
                    <CardHeader>
                        <CardTitle>Últimos Pacientes</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {recentPatients.map((patient, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-clinical-blue-100 flex items-center justify-center text-clinical-blue-700 font-semibold text-sm">
                                    {patient.initials}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-clinical-gray-900 truncate">
                                        {`${patient.name} ${patient.lastname}`}
                                    </p>
                                    <p className="text-xs text-clinical-gray-500 truncate">
                                        {patient.lastState === 'critical'
                                            ? 'Paciente TCA'
                                            : 'Seguimiento'}
                                    </p>
                                </div>
                                <Badge variant={patient.lastState === 'critical' ? 'critical' : 'stable'}>
                                    {patient.lastState === 'critical'
                                            ? 'Crítico'
                                            : patient.lastState === 'stable'
                                            ? 'Estable'
                                            : patient.lastState === 'in_treatment'
                                            ? 'En tratamiento'
                                            : ''}
                                </Badge>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Row 2: AI Assistance Chart + Statistics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* AI Assistance Chart */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Asistencia por IA Exitosa</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px] lg:h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={aiAssistanceChartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="month" stroke="#6b7280" fontSize={12} tickMargin={10} />
                                    <YAxis stroke="#6b7280" fontSize={12} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'white',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '12px'
                                        }}
                                    />
                                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                                    <Line
                                        type="monotone"
                                        dataKey="gpt"
                                        stroke="#22c55e"
                                        strokeWidth={2}
                                        name="GPT"
                                        dot={{ fill: '#22c55e', r: 4 }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="deepseek"
                                        stroke="#2563eb"
                                        strokeWidth={2}
                                        name="DeepSeek"
                                        dot={{ fill: '#2563eb', r: 4 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Statistics Cards */}
                <div className="space-y-6">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-clinical-gray-600">Pacientes</p>
                                    <p className="text-3xl font-bold text-clinical-gray-900 mt-1">{monthlyPatientResume.total}</p>
                                </div>
                                <div className="w-12 h-12 bg-clinical-blue-100 rounded-lg flex items-center justify-center">
                                    <Users className="text-clinical-blue-600" size={24} />
                                </div>
                            </div>
                            {monthlyPatientResume.changePercent > 0 ? (
                                <div className="flex items-center gap-1 mt-4">
                                <TrendingUp size={16} className="text-clinical-green-600" />
                                <span className="text-sm text-clinical-green-600 font-medium">{monthlyPatientResume.changePercent}%</span>
                                <span className="text-sm text-clinical-gray-500">vs mes anterior</span>
                            </div>
                            ) : (
                                <div className="flex items-center gap-1 mt-4">
                                    <TrendingDown size={16} className="text-clinical-red-600" />
                                    <span className="text-sm text-clinical-red-600 font-medium">{monthlyPatientResume.changePercent}%</span>
                                    <span className="text-sm text-clinical-gray-500">vs mes anterior</span>
                                </div>
                            )}
                            
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-clinical-gray-600">Diagnósticos</p>
                                    <p className="text-3xl font-bold text-clinical-gray-900 mt-1">{monthlyInquiryResume.total}</p>
                                </div>
                                <div className="w-12 h-12 bg-clinical-green-100 rounded-lg flex items-center justify-center">
                                    <FileText className="text-clinical-green-600" size={24} />
                                </div>
                            </div>
                            {monthlyInquiryResume.changePercent > 0 ? (
                                <div className="flex items-center gap-1 mt-4">
                                    <TrendingUp size={16} className="text-clinical-green-600" />
                                    <span className="text-sm text-clinical-green-600 font-medium">{monthlyInquiryResume.changePercent}%</span>
                                    <span className="text-sm text-clinical-gray-500">vs mes anterior</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1 mt-4">
                                    <TrendingDown size={16} className="text-clinical-red-600" />
                                    <span className="text-sm text-clinical-red-600 font-medium">{monthlyInquiryResume.changePercent}%</span>
                                    <span className="text-sm text-clinical-gray-500">vs mes anterior</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
