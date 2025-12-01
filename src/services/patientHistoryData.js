// Mock data for patient history, BMI evolution, and psychological indicators

export const patientProfiles = {
    1: {
        id: 1,
        name: "Erwin Rodríguez",
        age: 22,
        weight: 48,
        height: 170,
        avatar: "ER",
        diagnosis: "Anorexia Nerviosa",
        bmiCurrent: 16.6,
        bmiHistory: [
            { date: "2024-01", bmi: 14.8, weight: 43 },
            { date: "2024-02", bmi: 15.2, weight: 44 },
            { date: "2024-03", bmi: 15.6, weight: 45 },
            { date: "2024-04", bmi: 16.0, weight: 46 },
            { date: "2024-05", bmi: 16.2, weight: 46.5 },
            { date: "2024-06", bmi: 16.4, weight: 47 },
            { date: "2024-07", bmi: 16.5, weight: 47.5 },
            { date: "2024-08", bmi: 16.6, weight: 48 },
        ],
        psychologicalIndicators: {
            current: {
                ansiedad: 8,
                depresion: 7,
                autoestima: 4,
                imagenCorporal: 3,
                controlAlimentario: 5,
            },
            previous: {
                ansiedad: 9,
                depresion: 8,
                autoestima: 3,
                imagenCorporal: 2,
                controlAlimentario: 4,
            }
        },
        consultationHistory: [
            {
                id: 1,
                date: "2024-08-15",
                diagnosis: "Leve mejora en peso, persiste resistencia alimentaria",
                aiModel: "gpt",
                status: "completed",
                notes: "Requiere seguimiento intensivo"
            },
            {
                id: 2,
                date: "2024-07-20",
                diagnosis: "Estabilización del peso, ansiedad elevada",
                aiModel: "deepseek",
                status: "completed",
                notes: "Continuar terapia nutricional"
            },
            {
                id: 3,
                date: "2024-06-10",
                diagnosis: "Diagnóstico inicial - Anorexia Nerviosa severa",
                aiModel: "gpt",
                status: "completed",
                notes: "Inicio de tratamiento multidisciplinario"
            }
        ]
    },
    2: {
        id: 2,
        name: "Joao Silva",
        age: 25,
        weight: 72,
        height: 178,
        avatar: "JS",
        diagnosis: "Bulimia Nerviosa",
        bmiCurrent: 22.7,
        bmiHistory: [
            { date: "2024-01", bmi: 24.2, weight: 77 },
            { date: "2024-02", bmi: 23.8, weight: 75.5 },
            { date: "2024-03", bmi: 23.5, weight: 74.5 },
            { date: "2024-04", bmi: 23.2, weight: 73.5 },
            { date: "2024-05", bmi: 23.0, weight: 73 },
            { date: "2024-06", bmi: 22.9, weight: 72.5 },
            { date: "2024-07", bmi: 22.8, weight: 72.2 },
            { date: "2024-08", bmi: 22.7, weight: 72 },
        ],
        psychologicalIndicators: {
            current: {
                ansiedad: 5,
                depresion: 4,
                autoestima: 7,
                imagenCorporal: 6,
                controlAlimentario: 8,
            },
            previous: {
                ansiedad: 7,
                depresion: 6,
                autoestima: 5,
                imagenCorporal: 4,
                controlAlimentario: 6,
            }
        },
        consultationHistory: [
            {
                id: 1,
                date: "2024-08-10",
                diagnosis: "Reducción significativa de episodios de purga",
                aiModel: "deepseek",
                status: "completed",
                notes: "Excelente progreso"
            },
            {
                id: 2,
                date: "2024-07-15",
                diagnosis: "Control de atracones mejorado",
                aiModel: "gpt",
                status: "completed",
                notes: "Continuar con plan actual"
            },
            {
                id: 3,
                date: "2024-06-05",
                diagnosis: "Evaluación inicial - Bulimia Nerviosa moderada",
                aiModel: "gpt",
                status: "completed",
                notes: "Inicio de tratamiento"
            }
        ]
    },
    3: {
        id: 3,
        name: "María González",
        age: 28,
        weight: 85,
        height: 162,
        avatar: "MG",
        diagnosis: "Trastorno por Atracón",
        bmiCurrent: 32.4,
        bmiHistory: [
            { date: "2024-01", bmi: 35.2, weight: 92 },
            { date: "2024-02", bmi: 34.8, weight: 91 },
            { date: "2024-03", bmi: 34.2, weight: 90 },
            { date: "2024-04", bmi: 33.6, weight: 88 },
            { date: "2024-05", bmi: 33.1, weight: 87 },
            { date: "2024-06", bmi: 32.8, weight: 86 },
            { date: "2024-07", bmi: 32.6, weight: 85.5 },
            { date: "2024-08", bmi: 32.4, weight: 85 },
        ],
        psychologicalIndicators: {
            current: {
                ansiedad: 6,
                depresion: 5,
                autoestima: 6,
                imagenCorporal: 5,
                controlAlimentario: 7,
            },
            previous: {
                ansiedad: 8,
                depresion: 7,
                autoestima: 4,
                imagenCorporal: 3,
                controlAlimentario: 4,
            }
        },
        consultationHistory: [
            {
                id: 1,
                date: "2024-08-12",
                diagnosis: "Reducción de frecuencia de atracones",
                aiModel: "gpt",
                status: "completed",
                notes: "Progreso sostenido"
            },
            {
                id: 2,
                date: "2024-07-18",
                diagnosis: "Mejora en control de impulsos alimentarios",
                aiModel: "deepseek",
                status: "completed",
                notes: "Buena adherencia al tratamiento"
            }
        ]
    },
    4: {
        id: 4,
        name: "Carlos Mendoza",
        age: 19,
        weight: 52,
        height: 175,
        avatar: "CM",
        diagnosis: "Anorexia Nerviosa",
        bmiCurrent: 17.0,
        bmiHistory: [
            { date: "2024-01", bmi: 15.5, weight: 47.5 },
            { date: "2024-02", bmi: 15.8, weight: 48.5 },
            { date: "2024-03", bmi: 16.1, weight: 49.5 },
            { date: "2024-04", bmi: 16.4, weight: 50.2 },
            { date: "2024-05", bmi: 16.6, weight: 50.8 },
            { date: "2024-06", bmi: 16.8, weight: 51.5 },
            { date: "2024-07", bmi: 16.9, weight: 51.8 },
            { date: "2024-08", bmi: 17.0, weight: 52 },
        ],
        psychologicalIndicators: {
            current: {
                ansiedad: 7,
                depresion: 6,
                autoestima: 5,
                imagenCorporal: 4,
                controlAlimentario: 6,
            },
            previous: {
                ansiedad: 9,
                depresion: 8,
                autoestima: 3,
                imagenCorporal: 2,
                controlAlimentario: 4,
            }
        },
        consultationHistory: [
            {
                id: 1,
                date: "2024-08-08",
                diagnosis: "Progreso gradual en ganancia de peso",
                aiModel: "gpt",
                status: "completed",
                notes: "Mejoría en actitud hacia alimentación"
            },
            {
                id: 2,
                date: "2024-07-10",
                diagnosis: "Resistencia inicial al tratamiento",
                aiModel: "deepseek",
                status: "completed",
                notes: "Requiere apoyo psicológico intensivo"
            }
        ]
    },
    5: {
        id: 5,
        name: "Ana Martínez",
        age: 21,
        weight: 58,
        height: 165,
        avatar: "AM",
        diagnosis: "Evaluación Inicial",
        bmiCurrent: 21.3,
        bmiHistory: [
            { date: "2024-07", bmi: 21.5, weight: 58.5 },
            { date: "2024-08", bmi: 21.3, weight: 58 },
        ],
        psychologicalIndicators: {
            current: {
                ansiedad: 6,
                depresion: 5,
                autoestima: 6,
                imagenCorporal: 6,
                controlAlimentario: 7,
            },
            previous: {
                ansiedad: 6,
                depresion: 5,
                autoestima: 6,
                imagenCorporal: 6,
                controlAlimentario: 7,
            }
        },
        consultationHistory: [
            {
                id: 1,
                date: "2024-08-05",
                diagnosis: "Evaluación inicial - Sin diagnóstico definitivo",
                aiModel: "gpt",
                status: "completed",
                notes: "Requiere seguimiento para confirmar diagnóstico"
            }
        ]
    },
    6: {
        id: 6,
        name: "Luis Fernández",
        age: 26,
        weight: 68,
        height: 172,
        avatar: "LF",
        diagnosis: "Bulimia Nerviosa",
        bmiCurrent: 23.0,
        bmiHistory: [
            { date: "2024-01", bmi: 24.5, weight: 72.5 },
            { date: "2024-02", bmi: 24.2, weight: 71.5 },
            { date: "2024-03", bmi: 23.9, weight: 70.8 },
            { date: "2024-04", bmi: 23.6, weight: 70 },
            { date: "2024-05", bmi: 23.4, weight: 69.2 },
            { date: "2024-06", bmi: 23.2, weight: 68.7 },
            { date: "2024-07", bmi: 23.1, weight: 68.3 },
            { date: "2024-08", bmi: 23.0, weight: 68 },
        ],
        psychologicalIndicators: {
            current: {
                ansiedad: 5,
                depresion: 4,
                autoestima: 7,
                imagenCorporal: 7,
                controlAlimentario: 8,
            },
            previous: {
                ansiedad: 7,
                depresion: 6,
                autoestima: 5,
                imagenCorporal: 5,
                controlAlimentario: 6,
            }
        },
        consultationHistory: [
            {
                id: 1,
                date: "2024-08-14",
                diagnosis: "Control exitoso de episodios bulímicos",
                aiModel: "deepseek",
                status: "completed",
                notes: "Excelente evolución"
            },
            {
                id: 2,
                date: "2024-07-12",
                diagnosis: "Reducción de conductas compensatorias",
                aiModel: "gpt",
                status: "completed",
                notes: "Progreso notable"
            }
        ]
    },
    7: {
        id: 7,
        name: "Sofia Torres",
        age: 24,
        weight: 92,
        height: 168,
        avatar: "ST",
        diagnosis: "Trastorno por Atracón",
        bmiCurrent: 32.6,
        bmiHistory: [
            { date: "2024-01", bmi: 36.2, weight: 102 },
            { date: "2024-02", bmi: 35.5, weight: 100 },
            { date: "2024-03", bmi: 34.8, weight: 98 },
            { date: "2024-04", bmi: 34.2, weight: 96.5 },
            { date: "2024-05", bmi: 33.6, weight: 95 },
            { date: "2024-06", bmi: 33.2, weight: 93.5 },
            { date: "2024-07", bmi: 32.9, weight: 92.8 },
            { date: "2024-08", bmi: 32.6, weight: 92 },
        ],
        psychologicalIndicators: {
            current: {
                ansiedad: 7,
                depresion: 6,
                autoestima: 5,
                imagenCorporal: 4,
                controlAlimentario: 6,
            },
            previous: {
                ansiedad: 9,
                depresion: 8,
                autoestima: 3,
                imagenCorporal: 2,
                controlAlimentario: 3,
            }
        },
        consultationHistory: [
            {
                id: 1,
                date: "2024-08-16",
                diagnosis: "Pérdida de peso sostenida, mejora en control",
                aiModel: "gpt",
                status: "completed",
                notes: "Continuar con plan nutricional"
            },
            {
                id: 2,
                date: "2024-07-22",
                diagnosis: "Reducción de episodios de atracón",
                aiModel: "deepseek",
                status: "completed",
                notes: "Buena respuesta al tratamiento"
            },
            {
                id: 3,
                date: "2024-06-15",
                diagnosis: "Diagnóstico inicial - Trastorno por atracón severo",
                aiModel: "gpt",
                status: "completed",
                notes: "Inicio de intervención multidisciplinaria"
            }
        ]
    },
    8: {
        id: 8,
        name: "Diego Ramírez",
        age: 20,
        weight: 55,
        height: 173,
        avatar: "DR",
        diagnosis: "Anorexia Nerviosa",
        bmiCurrent: 18.4,
        bmiHistory: [
            { date: "2024-01", bmi: 16.2, weight: 48.5 },
            { date: "2024-02", bmi: 16.6, weight: 49.8 },
            { date: "2024-03", bmi: 17.0, weight: 50.9 },
            { date: "2024-04", bmi: 17.4, weight: 52 },
            { date: "2024-05", bmi: 17.7, weight: 53 },
            { date: "2024-06", bmi: 18.0, weight: 53.9 },
            { date: "2024-07", bmi: 18.2, weight: 54.5 },
            { date: "2024-08", bmi: 18.4, weight: 55 },
        ],
        psychologicalIndicators: {
            current: {
                ansiedad: 5,
                depresion: 4,
                autoestima: 7,
                imagenCorporal: 7,
                controlAlimentario: 8,
            },
            previous: {
                ansiedad: 8,
                depresion: 7,
                autoestima: 4,
                imagenCorporal: 3,
                controlAlimentario: 5,
            }
        },
        consultationHistory: [
            {
                id: 1,
                date: "2024-08-18",
                diagnosis: "Recuperación exitosa, peso casi normalizado",
                aiModel: "deepseek",
                status: "completed",
                notes: "Excelente evolución clínica"
            },
            {
                id: 2,
                date: "2024-07-25",
                diagnosis: "Progreso significativo en ganancia de peso",
                aiModel: "gpt",
                status: "completed",
                notes: "Mejoría notable en todos los indicadores"
            },
            {
                id: 3,
                date: "2024-06-20",
                diagnosis: "Inicio de tratamiento - Anorexia Nerviosa",
                aiModel: "gpt",
                status: "completed",
                notes: "Buena disposición al tratamiento"
            }
        ]
    }
};

export const getPatientProfile = (id) => {
    return patientProfiles[id] || null;
};
