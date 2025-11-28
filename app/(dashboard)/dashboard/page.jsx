'use client';

import Card, { CardHeader, CardContent, CardTitle } from '@/components/Card';
import Badge from '@/components/Badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, FileText } from 'lucide-react';
import { diagnosticsChartData, aiAssistanceChartData, recentPatients } from '@/lib/mockData';

export default function DashboardPage() {
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
                        <CardTitle>Diagnósticos Realizados</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={diagnosticsChartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="month" stroke="#6b7280" />
                                    <YAxis stroke="#6b7280" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'white',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="diagnosticos"
                                        stroke="#2563eb"
                                        strokeWidth={2}
                                        dot={{ fill: '#2563eb', r: 4 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Patients */}
                <Card>
                    <CardHeader>
                        <CardTitle>Últimos Pacientes</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {recentPatients.map((patient) => (
                            <div key={patient.id} className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-clinical-blue-100 flex items-center justify-center text-clinical-blue-700 font-semibold text-sm">
                                    {patient.avatar}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-clinical-gray-900 truncate">
                                        {patient.name}
                                    </p>
                                    <p className="text-xs text-clinical-gray-500 truncate">
                                        {patient.role}
                                    </p>
                                </div>
                                <Badge variant={patient.status}>
                                    {patient.status === 'critical' ? 'Crítico' : 'Estable'}
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
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={aiAssistanceChartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="month" stroke="#6b7280" />
                                    <YAxis stroke="#6b7280" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'white',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <Legend />
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
                                    <p className="text-3xl font-bold text-clinical-gray-900 mt-1">3,552</p>
                                </div>
                                <div className="w-12 h-12 bg-clinical-blue-100 rounded-lg flex items-center justify-center">
                                    <Users className="text-clinical-blue-600" size={24} />
                                </div>
                            </div>
                            <div className="flex items-center gap-1 mt-4">
                                <TrendingUp size={16} className="text-clinical-green-600" />
                                <span className="text-sm text-clinical-green-600 font-medium">+12.5%</span>
                                <span className="text-sm text-clinical-gray-500">vs mes anterior</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-clinical-gray-600">Diagnósticos</p>
                                    <p className="text-3xl font-bold text-clinical-gray-900 mt-1">5,321</p>
                                </div>
                                <div className="w-12 h-12 bg-clinical-green-100 rounded-lg flex items-center justify-center">
                                    <FileText className="text-clinical-green-600" size={24} />
                                </div>
                            </div>
                            <div className="flex items-center gap-1 mt-4">
                                <TrendingUp size={16} className="text-clinical-green-600" />
                                <span className="text-sm text-clinical-green-600 font-medium">+8.2%</span>
                                <span className="text-sm text-clinical-gray-500">vs mes anterior</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
