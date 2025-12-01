'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';

export default function BMIChart({ data }) {
    // Healthy BMI range (18.5 - 24.9)
    const healthyBMIMin = 18.5;
    const healthyBMIMax = 24.9;

    return (
        <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis
                        dataKey="date"
                        stroke="#6B7280"
                        style={{ fontSize: '12px' }}
                    />
                    <YAxis
                        stroke="#6B7280"
                        style={{ fontSize: '12px' }}
                        domain={[14, 26]}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            padding: '12px'
                        }}
                        formatter={(value, name) => {
                            if (name === 'bmi') return [value.toFixed(1), 'IMC'];
                            if (name === 'weight') return [value + ' kg', 'Peso'];
                            return value;
                        }}
                    />
                    <Legend
                        wrapperStyle={{ paddingTop: '20px' }}
                        formatter={(value) => {
                            if (value === 'bmi') return 'IMC';
                            if (value === 'weight') return 'Peso (kg)';
                            return value;
                        }}
                    />

                    {/* Healthy BMI Zone */}
                    <ReferenceLine
                        y={healthyBMIMin}
                        stroke="#10B981"
                        strokeDasharray="5 5"
                        label={{ value: 'Zona Saludable Min', position: 'right', fill: '#10B981', fontSize: 11 }}
                    />
                    <ReferenceLine
                        y={healthyBMIMax}
                        stroke="#10B981"
                        strokeDasharray="5 5"
                        label={{ value: 'Zona Saludable Max', position: 'right', fill: '#10B981', fontSize: 11 }}
                    />

                    {/* BMI Line */}
                    <Line
                        type="monotone"
                        dataKey="bmi"
                        stroke="#2563EB"
                        strokeWidth={3}
                        dot={{ fill: '#2563EB', r: 5 }}
                        activeDot={{ r: 7 }}
                    />

                    {/* Weight Line (secondary) */}
                    <Line
                        type="monotone"
                        dataKey="weight"
                        stroke="#8B5CF6"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ fill: '#8B5CF6', r: 3 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
