'use client';

import { useState, use } from 'react';
import Card, { CardHeader, CardContent, CardTitle } from '@/components/Card';
import Button from '@/components/Button';
import Input, { Textarea } from '@/components/Input';
import { ChevronRight, Sparkles, Loader2, Copy, Check } from 'lucide-react';
import { allPatients, mockIndicators } from '@/lib/mockData';
import { requestAIOpinion } from '@/lib/aiSimulation';

export default function ConsultaPage({ params }) {
    // Unwrap params using React.use() for Next.js 15+ compatibility
    const resolvedParams = use(params);
    const patient = allPatients.find(p => p.id === parseInt(resolvedParams.patientId)) || allPatients[0];

    const [indicators, setIndicators] = useState(mockIndicators);
    const [aiResponses, setAiResponses] = useState(null);
    const [loading, setLoading] = useState(false);
    const [diagnosis, setDiagnosis] = useState('');
    const [feedback, setFeedback] = useState('');
    const [selectedModel, setSelectedModel] = useState(null);
    const [showPrompt, setShowPrompt] = useState({ gpt: false, deepseek: false });

    const handleRequestAI = async () => {
        setLoading(true);
        setAiResponses(null);
        setSelectedModel(null);

        const responses = await requestAIOpinion(indicators);
        setAiResponses(responses);
        setLoading(false);
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
                [field]: parseFloat(value) || 0
            }
        }));
    };

    return (
        <div className="space-y-6 max-w-[1600px]">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-clinical-gray-600">
                <span>Nueva Consulta</span>
                <ChevronRight size={16} />
                <span className="text-clinical-gray-900 font-medium">{patient.name}</span>
            </div>

            <div>
                <h1 className="text-3xl font-bold text-clinical-gray-900">Nueva Consulta</h1>
                <p className="text-clinical-gray-600 mt-1">Paciente: {patient.name}</p>
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
                        disabled={loading}
                    >
                        {loading ? (
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
                            <Input
                                label="Avance de la enfermedad / Riesgo inicial"
                                type="text"
                                placeholder="Ej: Moderado, Alto riesgo..."
                            />

                            <Textarea
                                label="Diagnóstico"
                                value={diagnosis}
                                onChange={(e) => setDiagnosis(e.target.value)}
                                rows={8}
                                placeholder="Escriba el diagnóstico final aquí o seleccione una respuesta de IA..."
                            />

                            <div className="flex gap-3">
                                <Button variant="success" className="flex-1">
                                    Posee TCA
                                </Button>
                                <Button variant="outline" className="flex-1">
                                    No posee TCA
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* RIGHT COLUMN - AI Responses */}
                <div className="space-y-6">
                    {loading && (
                        <div className="space-y-4">
                            {/* Skeleton Loading */}
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

                    {aiResponses && !loading && (
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
                                        Justifica por qué eligió {selectedModel === 'gpt' ? 'GPT' : selectedModel === 'deepseek' ? 'DeepSeek' : 'un modelo de IA'}
                                    </p>
                                    <Textarea
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        rows={4}
                                        placeholder="Ej: Seleccioné DeepSeek porque proporcionó un análisis más detallado de los criterios DSM-5..."
                                    />
                                    <Button variant="primary" className="w-full">
                                        Guardar Feedback
                                    </Button>
                                </CardContent>
                            </Card>
                        </>
                    )}

                    {!aiResponses && !loading && (
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
