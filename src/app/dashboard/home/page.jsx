'use client';

import { useRouter } from 'next/navigation';
import Card, { CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Users, FileText, History, Activity } from 'lucide-react';
import { diagnosticsChartData, aiAssistanceChartData } from '@/services/mockData';
import { getRecentPatients, getPatientMonthlyResume, getInquiryMonthlyResume, getInquiryMonthlyChart, getAiMonthlyChart } from '@/services/dashboardApi';
import { useState, useEffect } from 'react';

export default function DashboardPage() {
    const router = useRouter();
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const [recentPatients, setRecentPatients] = useState([]);
    const [monthlyPatientResume, setMonthlyPatientResume] = useState({ total: 0, previous: 0, changePercent: 0 });
    const [monthlyInquiryResume, setMonthlyInquiryResume] = useState({ total: 0, previous: 0, changePercent: 0 });
    const [monthlyInquiryChart, setMonthlyInquiryChart] = useState([]);
    const [isChartLoading, setIsChartLoading] = useState(false);
    const [isRecentLoading, setIsRecentLoading] = useState(true);
    const [isMonthlyPatientLoading, setIsMonthlyPatientLoading] = useState(true);
    const [isMonthlyInquiryLoading, setIsMonthlyInquiryLoading] = useState(true);
    const [recentVisible, setRecentVisible] = useState(false);
    const [recentRevealCount, setRecentRevealCount] = useState(0);
    const [monthlyPatientVisible, setMonthlyPatientVisible] = useState(false);
    const [monthlyInquiryVisible, setMonthlyInquiryVisible] = useState(false);
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedAiYear, setSelectedAiYear] = useState(currentYear);
    const [aiMonthlyChart, setAiMonthlyChart] = useState([]);
    const [isAiChartLoading, setIsAiChartLoading] = useState(false);
    const years = [currentYear, currentYear - 1, currentYear - 2, currentYear - 3, currentYear - 4];

    // Obtener toda la data para el dashboard (por sección)
    useEffect(() => {
        const getDashboardData = async () => {
            try {
                setIsRecentLoading(true);
                const patientsData = await getRecentPatients();
                setRecentPatients(patientsData);
            } finally {
                setIsRecentLoading(false);
            }

            try {
                setIsMonthlyPatientLoading(true);
                const monthlyPatientData = await getPatientMonthlyResume();
                setMonthlyPatientResume(monthlyPatientData);
            } finally {
                setIsMonthlyPatientLoading(false);
            }

            try {
                setIsMonthlyInquiryLoading(true);
                const monthlyInquiryData = await getInquiryMonthlyResume();
                setMonthlyInquiryResume(monthlyInquiryData);
            } finally {
                setIsMonthlyInquiryLoading(false);
            }
        };
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

    useEffect(() => {
        let active = true;
        const fetchAiChart = async () => {
            setIsAiChartLoading(true);
            try {
                const data = await getAiMonthlyChart(selectedAiYear);
                if (active) setAiMonthlyChart(data);
            } finally {
                if (active) setIsAiChartLoading(false);
            }
        };
        fetchAiChart();
        return () => { active = false };
    }, [selectedAiYear]);

    useEffect(() => {
        if (!isRecentLoading) {
            setRecentVisible(false);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => setRecentVisible(true));
            });

            setRecentRevealCount(0);
            let i = 0;
            const intervalId = setInterval(() => {
                i += 1;
                setRecentRevealCount(i);
                if (i >= recentPatients.length) {
                    clearInterval(intervalId);
                }
            }, 100);
            return () => clearInterval(intervalId);
        } else {
            setRecentVisible(false);
            setRecentRevealCount(0);
        }
    }, [isRecentLoading, recentPatients]);

    useEffect(() => {
        if (!isMonthlyPatientLoading) {
            setMonthlyPatientVisible(false);
            setTimeout(() => setMonthlyPatientVisible(true), 0);
        }
    }, [isMonthlyPatientLoading]);

    useEffect(() => {
        if (!isMonthlyInquiryLoading) {
            setMonthlyInquiryVisible(false);
            setTimeout(() => setMonthlyInquiryVisible(true), 0);
        }
    }, [isMonthlyInquiryLoading]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-sage-900 tracking-tight">Dashboard</h1>
                <p className="text-sage-500 mt-1 font-medium">Resumen general del sistema</p>
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
                                className="px-4 py-2 border-none rounded-full text-sm text-sage-700 bg-sage-50 hover:bg-sage-100 cursor-pointer focus:ring-2 focus:ring-sage-200"
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
                                <div className="h-full w-full bg-white/50 rounded-3xl overflow-hidden p-4 animate-pulse">
                                    <div className="h-full bg-sage-50 rounded-2xl" />
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={monthlyInquiryChart} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                        <XAxis
                                            dataKey="month"
                                            stroke="var(--color-primary)"
                                            fontSize={12}
                                            tickMargin={10}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            stroke="var(--color-primary)"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            domain={[0, 'auto']}
                                            allowDecimals={false}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'var(--color-background-muted)',
                                                border: '1px solid var(--color-sand-200)',
                                                borderRadius: '16px',
                                                boxShadow: 'var(--shadow-soft)',
                                                fontSize: '12px',
                                                color: 'var(--color-text-main)'
                                            }}
                                        />
                                        <Line
                                            type="natural"
                                            dataKey="total"
                                            stroke="var(--color-primary)"
                                            strokeWidth={3}
                                            dot={{ fill: 'var(--color-primary)', r: 4, strokeWidth: 0 }}
                                            activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--color-primary)' }}
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
                    <CardContent>
                        {isRecentLoading ? (
                            <div className="space-y-4">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-3 animate-pulse">
                                        <div className="w-10 h-10 rounded-full bg-sage-100" />
                                        <div className="flex-1 min-w-0">
                                            <div className="h-4 w-1/3 bg-sage-100 rounded mb-2" />
                                            <div className="h-3 w-1/4 bg-sage-50 rounded" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={`space-y-4 transition-opacity duration-700 ${recentVisible ? 'opacity-100' : 'opacity-0'}`}>
                                {recentPatients.map((patient, index) => (
                                    <a key={index} className={`flex items-center gap-4 p-2 hover:bg-white/50 rounded-2xl transition-all duration-300 ease-out ${index < recentRevealCount ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`} href={`pacientes/${patient.id}/historial`}>
                                        <div className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center text-sage-700 font-bold text-sm shadow-sm">
                                            {patient.initials}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-sage-900 truncate">
                                                {`${patient.name} ${patient.lastname}`}
                                            </p>
                                            <p className="text-xs text-sage-500 truncate font-medium">
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
                                        
                                    </a>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Row 2: AI Assistance Chart + Statistics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* AI Assistance Chart */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <div className="flex items-center justify-between gap-4">
                            <CardTitle>Asistencia por IA Exitosa</CardTitle>
                            <select
                                value={selectedAiYear}
                                onChange={(e) => setSelectedAiYear(Number(e.target.value))}
                                className="px-4 py-2 border-none rounded-full text-sm text-sage-700 bg-sage-50 hover:bg-sage-100 cursor-pointer focus:ring-2 focus:ring-sage-200"
                            >
                                {years.map((y) => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px] lg:h-[300px] w-full">
                            {isAiChartLoading ? (
                                <div className="h-full w-full bg-white/50 rounded-3xl overflow-hidden p-4 animate-pulse">
                                    <div className="h-full bg-sage-50 rounded-2xl" />
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={aiMonthlyChart} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                        <XAxis dataKey="month" stroke="var(--color-primary)" fontSize={12} tickMargin={10} tickLine={false} axisLine={false} />
                                        <YAxis stroke="var(--color-primary)" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'var(--color-background-muted)',
                                                border: '1px solid var(--color-sand-200)',
                                                borderRadius: '16px',
                                                boxShadow: 'var(--shadow-soft)',
                                                fontSize: '12px',
                                                color: 'var(--color-text-main)'
                                            }}
                                        />
                                        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} iconType="circle" />
                                        <Line
                                            type="natural"
                                            dataKey="gpt"
                                            stroke="var(--color-primary)"
                                            strokeWidth={3}
                                            name="GPT"
                                            dot={{ fill: 'var(--color-primary)', r: 4, strokeWidth: 0 }}
                                            activeDot={{ r: 6, fill: 'var(--color-primary)' }}
                                        />
                                        <Line
                                            type="natural"
                                            dataKey="deepseek"
                                            stroke="var(--color-accent)"
                                            strokeWidth={3}
                                            name="DeepSeek"
                                            dot={{ fill: 'var(--color-accent)', r: 4, strokeWidth: 0 }}
                                            activeDot={{ r: 6, fill: 'var(--color-accent)' }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Statistics Cards */}
                <div className="space-y-6">
                    <Card>
                        <CardContent className="pt-6">
                            {isMonthlyPatientLoading ? (
                                <div className="animate-pulse">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="h-4 w-24 bg-sage-100 rounded" />
                                            <div className="h-8 w-20 bg-sage-100 rounded mt-2" />
                                        </div>
                                        <div className="w-12 h-12 bg-sage-100 rounded-2xl" />
                                    </div>
                                    <div className="h-3 w-40 bg-sage-100 rounded mt-4" />
                                </div>
                            ) : (
                                <div className={`transition-opacity duration-700 ${monthlyPatientVisible ? 'opacity-100' : 'opacity-0'}`}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-sage-500 font-medium">Pacientes</p>
                                            <p className="text-3xl font-bold text-sage-900 mt-1">{monthlyPatientResume.total}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-sage-100 rounded-2xl flex items-center justify-center shadow-sm">
                                            <Users className="text-sage-600" size={24} />
                                        </div>
                                    </div>
                                    {monthlyPatientResume.changePercent > 0 ? (
                                        <div className="flex items-center gap-1 mt-4">
                                            <TrendingUp size={16} className="text-clinical-green-600" />
                                            <span className="text-sm text-clinical-green-600 font-medium">{monthlyPatientResume.changePercent}%</span>
                                            <span className="text-sm text-sage-400 font-medium ml-1">vs mes anterior</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1 mt-4">
                                            <TrendingDown size={16} className="text-status-error" />
                                            <span className="text-sm text-status-error font-medium">{monthlyPatientResume.changePercent}%</span>
                                            <span className="text-sm text-sage-400 font-medium ml-1">vs mes anterior</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            {isMonthlyInquiryLoading ? (
                                <div className="animate-pulse">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="h-4 w-28 bg-sage-100 rounded" />
                                            <div className="h-8 w-24 bg-sage-100 rounded mt-2" />
                                        </div>
                                        <div className="w-12 h-12 bg-sage-100 rounded-2xl" />
                                    </div>
                                    <div className="h-3 w-44 bg-sage-100 rounded mt-4" />
                                </div>
                            ) : (
                                <div className={`transition-opacity duration-700 ${monthlyInquiryVisible ? 'opacity-100' : 'opacity-0'}`}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-sage-500 font-medium">Diagnósticos</p>
                                            <p className="text-3xl font-bold text-sage-900 mt-1">{monthlyInquiryResume.total}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-terracotta-100 rounded-2xl flex items-center justify-center shadow-sm">
                                            <FileText className="text-terracotta-600" size={24} />
                                        </div>
                                    </div>
                                    {monthlyInquiryResume.changePercent > 0 ? (
                                        <div className="flex items-center gap-1 mt-4">
                                            <TrendingUp size={16} className="text-clinical-green-600" />
                                            <span className="text-sm text-clinical-green-600 font-medium">{monthlyInquiryResume.changePercent}%</span>
                                            <span className="text-sm text-sage-400 font-medium ml-1">vs mes anterior</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1 mt-4">
                                            <TrendingDown size={16} className="text-status-error" />
                                            <span className="text-sm text-status-error font-medium">{monthlyInquiryResume.changePercent}%</span>
                                            <span className="text-sm text-sage-400 font-medium ml-1">vs mes anterior</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
