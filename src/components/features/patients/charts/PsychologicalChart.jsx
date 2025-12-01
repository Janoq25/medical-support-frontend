'use client';

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export default function PsychologicalChart({ current, previous }) {
    // Transform data for radar chart
    const data = [
        {
            indicator: 'Ansiedad',
            'Sesión Actual': current.ansiedad,
            'Sesión Anterior': previous.ansiedad,
        },
        {
            indicator: 'Depresión',
            'Sesión Actual': current.depresion,
            'Sesión Anterior': previous.depresion,
        },
        {
            indicator: 'Autoestima',
            'Sesión Actual': current.autoestima,
            'Sesión Anterior': previous.autoestima,
        },
        {
            indicator: 'Imagen Corporal',
            'Sesión Actual': current.imagenCorporal,
            'Sesión Anterior': previous.imagenCorporal,
        },
        {
            indicator: 'Control Alimentario',
            'Sesión Actual': current.controlAlimentario,
            'Sesión Anterior': previous.controlAlimentario,
        },
    ];

    return (
        <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={data}>
                    <PolarGrid stroke="#E5E7EB" />
                    <PolarAngleAxis
                        dataKey="indicator"
                        tick={{ fill: '#6B7280', fontSize: 12 }}
                    />
                    <PolarRadiusAxis
                        angle={90}
                        domain={[0, 10]}
                        tick={{ fill: '#6B7280', fontSize: 11 }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            padding: '12px'
                        }}
                    />
                    <Legend
                        wrapperStyle={{ paddingTop: '20px' }}
                    />
                    <Radar
                        name="Sesión Anterior"
                        dataKey="Sesión Anterior"
                        stroke="#94A3B8"
                        fill="#94A3B8"
                        fillOpacity={0.3}
                        strokeWidth={2}
                    />
                    <Radar
                        name="Sesión Actual"
                        dataKey="Sesión Actual"
                        stroke="#2563EB"
                        fill="#2563EB"
                        fillOpacity={0.5}
                        strokeWidth={2}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
}
