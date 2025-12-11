'use client';

import { useEffect, useState, use } from 'react';
import Card, { CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input, { Textarea } from '@/components/ui/Input';
import { ChevronRight, Sparkles, Loader2, Copy, Check, Save } from 'lucide-react';
import { mockIndicators } from '@/services/mockData';
import { requestAIOpinion } from '@/services/aiSimulation';
import { getPatient } from '@/services/patientApi';
import { createInquiry } from '@/services/inquiriesApi';

export default function ConsultaPage({ params }) {
    const resolvedParams = use(params);
    const patientId = resolvedParams.patientId;

    const [patient, setPatient] = useState(null);
    const [loadingPatient, setLoadingPatient] = useState(true);
    const [patientError, setPatientError] = useState(null);

    const [indicators, setIndicators] = useState(mockIndicators);
    const [aiResponses, setAiResponses] = useState(null);
    const [loadingAI, setLoadingAI] = useState(false);
    const [saving, setSaving] = useState(false);
    const [diagnosis, setDiagnosis] = useState('');
    const [feedback, setFeedback] = useState('');
    const [patientState, setPatientState] = useState('stable'); // stable | in_treatment | critical
    const [selectedModel, setSelectedModel] = useState(null);
    const [showPrompt, setShowPrompt] = useState({ gpt: false, deepseek: false });
    const [saveError, setSaveError] = useState(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                setLoadingPatient(true);
                const data = await getPatient(patientId);
                setPatient(data);
                setPatientError(null);
            } catch (err) {
                console.error('Error fetching patient:', err);
                setPatientError(err.message || 'No se pudo cargar el paciente');
            } finally {
                setLoadingPatient(false);
            }
        };

        if (patientId) {
            fetchPatient();
        }
    }, [patientId]);

    const handleRequestAI = async () => {
        setLoadingAI(true);
        setAiResponses(null);
        setSelectedModel(null);
        setSaveError(null);
        setSaveSuccess(false);

        const responses = await requestAIOpinion(indicators);
        setAiResponses(responses);
        setLoadingAI(false);
    };

    const handleSelectDiagnosis = (model, diagnosisText) => {
        setDiagnosis(diagnosisText);
        setSelectedModel(model);
    };

    const updateIndicator = (category, field, value) => {
        setIndicators(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [field]: parseFloat(value) || 0,
            },
        }));
    };

    const handleSaveInquiry = async () => {
        try {
            setSaving(true);
            setSaveError(null);
            setSaveSuccess(false);

            if (!diagnosis.trim()) {
                throw new Error('Ingrese un diagnóstico antes de guardar la consulta');
            }

            const type_diagnosis = selectedModel === 'gpt'
                ? 'chatgpt'
                : selectedModel === 'deepseek'
                    ? 'deepseek'
                    : 'normal';

            const modelData = selectedModel && aiResponses ? aiResponses[selectedModel] : null;

            const payload = {
                patientId,
                diagnosis,
                patient_state: patientState,
                type_diagnosis,
                feedback,
                risk_level: null,
                ai_prompt: modelData?.prompt || null,
                ai_response: modelData?.diagnosis || null,
                ai_confidence: modelData?.confidence || null,
                indicators: [], // Sin indicadores reales en backend aún
            };

            await createInquiry(payload);
            setSaveSuccess(true);
        } catch (err) {
            console.error('Error saving inquiry:', err);
            setSaveError(err.message || 'No se pudo guardar la consulta');
        } finally {
            setSaving(false);
        }
    };

    if (loadingPatient) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-clinical-blue-600 mx-auto"></div>
                    <p className="text-clinical-gray-600 mt-4">Cargando paciente...</p>
                </div>
            </div>
        );
    }

    if (patientError || !patient) {
        return (
            <div className="space-y-4">
                <h1 className="text-2xl font-bold text-clinical-gray-900">Consulta</h1>
                <Card>
                    <CardContent className="text-clinical-red-700">
                        {patientError || 'Paciente no encontrado'}
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-[1600px]">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-clinical-gray-600">
                <span>Nueva Consulta</span>
                <ChevronRight size={16} />
                <span className="text-clinical-gray-900 font-medium">{patient.name} {patient.lastname}</span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                <div>
                    <h1 className="text-3xl font-bold text-clinical-gray-900">Nueva Consulta</h1>
                    <p className="text-clinical-gray-600 mt-1">Paciente: {patient.name} {patient.lastname}</p>
                </div>
                <div className="flex items-center gap-3">
                    <label className="text-sm text-clinical-gray-700">Estado del paciente</label>
                    <select
                        value={patientState}
                        onChange={(e) => setPatientState(e.target.value)}
                        className="border border-clinical-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-clinical-blue-500 focus:outline-none"
                    >
                        <option value="stable">Estable</option>
                        <option value="in_treatment">En tratamiento</option>
                        <option value="critical">Crítico</option>
                    </select>
                </div>
            </div>

            {/* Split Screen Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* LEFT COLUMN - Inputs */}
                <div className="space-y-6">
                    {/* Indicators Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Indicadores del Paciente</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Physical Indicators */}
                            <div>
                                <h4 className="font-semibold text-clinical-gray-900 mb-3">Indicadores Físicos</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="IMC"
                                        type="number"
                                        step="0.1"
                                        value={indicators.physical.imc}
                                        onChange={(e) => updateIndicator('physical', 'imc', e.target.value)}
                                    />
                                    <Input
                                        label="Peso (kg)"
                                        type="number"
                                        value={indicators.physical.weight}
                                        onChange={(e) => updateIndicator('physical', 'weight', e.target.value)}
                                    />
                                    <Input
                                        label="Altura (cm)"
                                        type="number"
                                        value={indicators.physical.height}
                                        onChange={(e) => updateIndicator('physical', 'height', e.target.value)}
                                    />
                                    <Input
                                        label="FC (lpm)"
                                        type="number"
                                        value={indicators.physical.heartRate}
                                        onChange={(e) => updateIndicator('physical', 'heartRate', e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Psychological Indicators */}
                            <div>
                                <h4 className="font-semibold text-clinical-gray-900 mb-3">Indicadores Psicológicos</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    {Object.entries(indicators.psychological).map(([key, value]) => (
                                        <div key={key}>
                                            <Input
                                                label={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                                                type="range"
                                                min="0"
                                                max="10"
                                                value={value}
                                                onChange={(e) => updateIndicator('psychological', key, e.target.value)}
                                            />
                                            <div className="flex justify-between text-xs text-clinical-gray-500 mt-1">
                                                <span>0</span>
                                                <span className="font-medium text-clinical-blue-600">{value}/10</span>
                                                <span>10</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Behavioral Indicators */}
                            <div>
                                <h4 className="font-semibold text-clinical-gray-900 mb-3">Indicadores Conductuales</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    {Object.entries(indicators.behavioral).map(([key, value]) => (
                                        <div key={key}>
                                            <Input
                                                label={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                                                type="range"
                                                min="0"
                                                max="10"
                                                value={value}
                                                onChange={(e) => updateIndicator('behavioral', key, e.target.value)}
                                            />
                                            <div className="flex justify-between text-xs text-clinical-gray-500 mt-1">
                                                <span>0</span>
                                                <span className="font-medium text-clinical-blue-600">{value}/10</span>
                                                <span>10</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Request AI Button */}
                    <Button
                        variant="primary"
                        className="w-full py-4 text-lg flex items-center justify-center gap-2"
                        onClick={handleRequestAI}
                        disabled={loadingAI}
                    >
                        {loadingAI ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Consultando IA...
                            </>
                        ) : (
                            <>
                                <Sparkles size={20} />
                                Solicitar Segunda Opinión IA
                            </>
                        )}
                    </Button>

                    {/* Diagnosis Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Diagnóstico Final</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Textarea
                                label="Diagnóstico"
                                value={diagnosis}
                                onChange={(e) => setDiagnosis(e.target.value)}
                                rows={8}
                                placeholder="Escriba el diagnóstico final aquí o seleccione una respuesta de IA..."
                            />

                            <div className="space-y-2">
                                <label className="text-sm text-clinical-gray-700">Feedback / Notas</label>
                                <Textarea
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    rows={4}
                                    placeholder="Observaciones, plan de acción, motivos de la selección..."
                                />
                            </div>

                            {saveError && (
                                <div className="bg-clinical-red-50 border border-clinical-red-200 text-clinical-red-700 px-4 py-3 rounded-lg text-sm">
                                    {saveError}
                                </div>
                            )}
                            {saveSuccess && (
                                <div className="bg-clinical-green-50 border border-clinical-green-200 text-clinical-green-700 px-4 py-3 rounded-lg text-sm">
                                    Consulta guardada correctamente.
                                </div>
                            )}

                            <div className="flex gap-3">
                                <Button
                                    variant="primary"
                                    className="flex-1 flex items-center justify-center gap-2"
                                    onClick={handleSaveInquiry}
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="animate-spin" size={16} />
                                            Guardando...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={16} />
                                            Guardar Consulta
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* RIGHT COLUMN - AI Responses */}
                <div className="space-y-6">
                    {loadingAI && (
                        <div className="space-y-4">
                            {[1, 2].map((i) => (
                                <Card key={i} className="animate-pulse">
                                    <CardContent className="py-6">
                                        <div className="h-4 bg-clinical-gray-200 rounded w-1/3 mb-4"></div>
                                        <div className="space-y-2">
                                            <div className="h-3 bg-clinical-gray-200 rounded"></div>
                                            <div className="h-3 bg-clinical-gray-200 rounded"></div>
                                            <div className="h-3 bg-clinical-gray-200 rounded w-5/6"></div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {aiResponses && !loadingAI && (
                        <>
                            {/* GPT Response */}
                            <Card
                                hover
                                className={`group relative cursor-pointer transition-all ${selectedModel === 'gpt' ? 'ring-2 ring-clinical-green-500' : ''
                                    }`}
                            >
                                <CardHeader className="bg-clinical-green-50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-clinical-green-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                                AI
                                            </div>
                                            <CardTitle className="text-clinical-green-700">Respuesta de GPT</CardTitle>
                                        </div>
                                        <span className="text-xs text-clinical-gray-600">
                                            Confianza: {(aiResponses.gpt.confidence * 100).toFixed(0)}%
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <p className="text-sm text-clinical-gray-700 leading-relaxed">
                                        {aiResponses.gpt.diagnosis}
                                    </p>

                                    <button
                                        onClick={() => setShowPrompt(prev => ({ ...prev, gpt: !prev.gpt }))}
                                        className="text-xs text-clinical-blue-600 hover:text-clinical-blue-700 cursor-pointer"
                                    >
                                        {showPrompt.gpt ? 'Ocultar' : 'Ver'} prompt enviado
                                    </button>

                                    {showPrompt.gpt && (
                                        <div className="bg-clinical-gray-50 p-3 rounded-lg text-xs text-clinical-gray-600 font-mono">
                                            {aiResponses.gpt.prompt}
                                        </div>
                                    )}

                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity pt-2">
                                        <Button
                                            variant="success"
                                            className="w-full flex items-center justify-center gap-2"
                                            onClick={() => handleSelectDiagnosis('gpt', aiResponses.gpt.diagnosis)}
                                        >
                                            {selectedModel === 'gpt' ? (
                                                <>
                                                    <Check size={16} />
                                                    Diagnóstico Seleccionado
                                                </>
                                            ) : (
                                                <>
                                                    <Copy size={16} />
                                                    Usar este diagnóstico como base
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* DeepSeek Response */}
                            <Card
                                hover
                                className={`group relative cursor-pointer transition-all ${selectedModel === 'deepseek' ? 'ring-2 ring-clinical-blue-500' : ''
                                    }`}
                            >
                                <CardHeader className="bg-clinical-blue-50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-clinical-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                                DS
                                            </div>
                                            <CardTitle className="text-clinical-blue-700">Respuesta de DeepSeek</CardTitle>
                                        </div>
                                        <span className="text-xs text-clinical-gray-600">
                                            Confianza: {(aiResponses.deepseek.confidence * 100).toFixed(0)}%
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <p className="text-sm text-clinical-gray-700 leading-relaxed">
                                        {aiResponses.deepseek.diagnosis}
                                    </p>

                                    <button
                                        onClick={() => setShowPrompt(prev => ({ ...prev, deepseek: !prev.deepseek }))}
                                        className="text-xs text-clinical-blue-600 hover:text-clinical-blue-700 cursor-pointer"
                                    >
                                        {showPrompt.deepseek ? 'Ocultar' : 'Ver'} prompt enviado
                                    </button>

                                    {showPrompt.deepseek && (
                                        <div className="bg-clinical-gray-50 p-3 rounded-lg text-xs text-clinical-gray-600 font-mono">
                                            {aiResponses.deepseek.prompt}
                                        </div>
                                    )}

                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity pt-2">
                                        <Button
                                            variant="primary"
                                            className="w-full flex items-center justify-center gap-2"
                                            onClick={() => handleSelectDiagnosis('deepseek', aiResponses.deepseek.diagnosis)}
                                        >
                                            {selectedModel === 'deepseek' ? (
                                                <>
                                                    <Check size={16} />
                                                    Diagnóstico Seleccionado
                                                </>
                                            ) : (
                                                <>
                                                    <Copy size={16} />
                                                    Usar este diagnóstico como base
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Feedback Section */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Feedback de Selección</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-sm text-clinical-gray-600">
                                        Justifica por qué elegiste {selectedModel === 'gpt' ? 'GPT' : selectedModel === 'deepseek' ? 'DeepSeek' : 'un modelo de IA'}
                                    </p>
                                    <Textarea
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        rows={4}
                                        placeholder="Ej: Seleccioné DeepSeek porque proporcionó un análisis más detallado..."
                                    />
                                </CardContent>
                            </Card>
                        </>
                    )}

                    {!aiResponses && !loadingAI && (
                        <Card className="border-dashed">
                            <CardContent className="py-12 text-center">
                                <Sparkles className="mx-auto text-clinical-gray-400 mb-4" size={48} />
                                <p className="text-clinical-gray-600">
                                    Haz clic en &quot;Solicitar Segunda Opinión IA&quot; para obtener diagnósticos de GPT y DeepSeek
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
