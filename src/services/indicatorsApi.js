'use client';

// Mock data for indicators
const MOCK_INDICATORS = [
    {
        id: '1',
        name: 'Índice de Masa Corporal (IMC)',
        type: 'fisico',
        inputType: 'numerical',
        unit: 'Peso(kg)/Altura(m)²',
        minRegularValue: 18.5,
        maxRegularValue: 40.0,
    },
    {
        id: '2',
        name: 'Variación de Peso Reciente (3 meses)',
        type: 'fisico',
        inputType: 'percentage',
        unit: '(Peso actual−Peso inicial)/Peso inicial×100',
        minRegularValue: -5.01,
        maxRegularValue: 100.0,
    },
    {
        id: '3',
        name: 'Frecuencia Ingesta Sustancias No Nutritivas',
        type: 'conductual',
        inputType: 'numerical',
        unit: 'Días/semana (0–7)',
        minRegularValue: 0,
        maxRegularValue: 0,
    },
    {
        id: '4',
        name: 'Frecuencia Regurgitación Espontánea',
        type: 'conductual',
        inputType: 'numerical',
        unit: 'Promedio de episodios/día',
        minRegularValue: 0,
        maxRegularValue: 0,
    },
    {
        id: '5',
        name: 'Frecuencia de Atracones',
        type: 'conductual',
        inputType: 'numerical',
        unit: 'Nº medio de episodios semanales',
        minRegularValue: 0,
        maxRegularValue: 0.99,
    },
    {
        id: '6',
        name: 'Frecuencia Conductas Compensatorias',
        type: 'conductual',
        inputType: 'numerical',
        unit: 'Promedio semanal',
        minRegularValue: 0,
        maxRegularValue: 0,
    },
    {
        id: '7',
        name: 'Nivel de Miedo a Ganar Peso (0–10)',
        type: 'psicologico',
        inputType: 'scale_0_10',
        unit: 'Escala psicométrica (0-10)',
        minRegularValue: 0,
        maxRegularValue: 6.99,
    },
    {
        id: '8',
        name: 'Nivel de Distorsión de Imagen Corporal (0–10)',
        type: 'psicologico',
        inputType: 'scale_0_10',
        unit: 'Escala psicométrica (0-10)',
        minRegularValue: 0,
        maxRegularValue: 6.99,
    },
    {
        id: '9',
        name: 'Nivel de Miedo a Consecuencias Aversivas (atragantarse, vomitar, dolor) (0–10)',
        type: 'psicologico',
        inputType: 'scale_0_10',
        unit: 'Escala de miedo/fobia (0-10)',
        minRegularValue: 0,
        maxRegularValue: 6.99,
    },
    {
        id: '10',
        name: 'Variedad de Alimentos Aceptados',
        type: 'conductual',
        inputType: 'numerical',
        unit: 'Conteo simple de alimentos distintos',
        minRegularValue: 10,
        maxRegularValue: 100,
    },
];

// Storage key - changed to v3 to force reload with updated types
const STORAGE_KEY = 'medical_indicators_v3';

// Helper to get indicators from localStorage or use defaults
const getStoredIndicators = () => {
    if (typeof window === 'undefined') return MOCK_INDICATORS;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error('Error parsing stored indicators:', e);
            return MOCK_INDICATORS;
        }
    }
    // Initialize with mock data
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_INDICATORS));
    return MOCK_INDICATORS;
};

// Helper to save indicators to localStorage
const saveIndicators = (indicators) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(indicators));
    }
};

// Simulate async delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const getIndicators = async () => {
    await delay();
    return getStoredIndicators();
};

export const getIndicator = async (id) => {
    await delay();
    const indicators = getStoredIndicators();
    const indicator = indicators.find(i => String(i.id) === String(id));

    if (!indicator) {
        throw new Error('Indicador no encontrado');
    }

    return indicator;
};

export const createIndicator = async (payload) => {
    await delay();
    const indicators = getStoredIndicators();

    // Generate new ID
    const maxId = indicators.reduce((max, i) => {
        const numId = parseInt(i.id);
        return numId > max ? numId : max;
    }, 0);

    const newIndicator = {
        ...payload,
        id: String(maxId + 1),
    };

    const updatedIndicators = [...indicators, newIndicator];
    saveIndicators(updatedIndicators);

    return newIndicator;
};

export const updateIndicator = async (id, payload) => {
    await delay();
    const indicators = getStoredIndicators();
    const index = indicators.findIndex(i => String(i.id) === String(id));

    if (index === -1) {
        throw new Error('Indicador no encontrado');
    }

    const updatedIndicator = {
        ...indicators[index],
        ...payload,
        id: indicators[index].id, // Preserve ID
    };

    const updatedIndicators = [...indicators];
    updatedIndicators[index] = updatedIndicator;
    saveIndicators(updatedIndicators);

    return updatedIndicator;
};

export const removeIndicator = async (id) => {
    await delay();
    const indicators = getStoredIndicators();
    const filteredIndicators = indicators.filter(i => String(i.id) !== String(id));

    if (filteredIndicators.length === indicators.length) {
        throw new Error('Indicador no encontrado');
    }

    saveIndicators(filteredIndicators);
    return { success: true };
};
