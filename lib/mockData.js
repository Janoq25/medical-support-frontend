// Mock data for charts and patient lists

export const diagnosticsChartData = [
    { month: 'Ene', diagnosticos: 45 },
    { month: 'Feb', diagnosticos: 52 },
    { month: 'Mar', diagnosticos: 48 },
    { month: 'Abr', diagnosticos: 61 },
    { month: 'May', diagnosticos: 55 },
    { month: 'Jun', diagnosticos: 67 },
];

export const aiAssistanceChartData = [
    { month: 'Ene', gpt: 38, deepseek: 35 },
    { month: 'Feb', gpt: 42, deepseek: 40 },
    { month: 'Mar', gpt: 40, deepseek: 38 },
    { month: 'Abr', gpt: 50, deepseek: 48 },
    { month: 'May', gpt: 45, deepseek: 46 },
    { month: 'Jun', gpt: 55, deepseek: 53 },
];

export const recentPatients = [
    { id: 1, name: 'Erwin Rodríguez', role: 'Paciente TCA', status: 'critical', avatar: 'ER' },
    { id: 2, name: 'Joao Silva', role: 'Seguimiento', status: 'stable', avatar: 'JS' },
    { id: 3, name: 'María González', role: 'Evaluación inicial', status: 'stable', avatar: 'MG' },
    { id: 4, name: 'Carlos Mendoza', role: 'Paciente TCA', status: 'critical', avatar: 'CM' },
];

export const allPatients = [
    { id: 1, name: 'Erwin Rodríguez', role: 'Anorexia nerviosa', status: 'critical', avatar: 'ER', category: 'critical' },
    { id: 2, name: 'Joao Silva', role: 'Bulimia nerviosa', status: 'stable', avatar: 'JS', category: 'stable' },
    { id: 3, name: 'María González', role: 'Trastorno por atracón', status: 'stable', avatar: 'MG', category: 'treatment' },
    { id: 4, name: 'Carlos Mendoza', role: 'Anorexia nerviosa', status: 'critical', avatar: 'CM', category: 'critical' },
    { id: 5, name: 'Ana Martínez', role: 'Evaluación inicial', status: 'stable', avatar: 'AM', category: 'stable' },
    { id: 6, name: 'Luis Fernández', role: 'Bulimia nerviosa', status: 'stable', avatar: 'LF', category: 'treatment' },
    { id: 7, name: 'Sofia Torres', role: 'Trastorno por atracón', status: 'critical', avatar: 'ST', category: 'critical' },
    { id: 8, name: 'Diego Ramírez', role: 'Anorexia nerviosa', status: 'stable', avatar: 'DR', category: 'treatment' },
];

export const mockIndicators = {
    physical: {
        imc: 16.5,
        weight: 45,
        height: 165,
        heartRate: 55,
    },
    psychological: {
        anxiety: 7,
        depression: 6,
        bodyImage: 8,
        selfEsteem: 3,
    },
    behavioral: {
        foodRestriction: 9,
        bingeing: 2,
        purging: 1,
        exercise: 8,
    },
};
