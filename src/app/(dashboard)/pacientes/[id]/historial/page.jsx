'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Activity, TrendingUp, Brain, Eye } from 'lucide-react';
import Card, { CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { getPatientProfile } from '@/services/patientHistoryData';
import BMIChart from '@/components/features/charts/BMIChart';
import PsychologicalChart from '@/components/features/charts/PsychologicalChart';

export default function PatientHistoryPage({ params }) {
    const router = useRouter();
    const { id } = use(params);
    const patient = getPatientProfile(parseInt(id));

    if (!patient) {
        return (
            <div className="text-center py-12">
                <p className="text-clinical-gray-500">Paciente no encontrado</p>
            </div>
        );
    }

    const handleNewConsultation = () => {
        router.push(`/consulta/${id}`);
    };

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-clinical-gray-600 hover:text-clinical-gray-900 transition-colors"
            >
                <ArrowLeft size={20} />
                <span>Volver a Pacientes</span>
            </button>

            {/* Patient Header Card */}
            <Card>
                <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            {/* Large Avatar */}
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-clinical-blue-500 to-clinical-blue-700 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                                {patient.avatar}
                            </div>

                            {/* Patient Info */}
                            <div className="space-y-3">
                                <div>
                                    <h1 className="text-3xl font-bold text-clinical-gray-900">{patient.name}</h1>
                                    <p className="text-clinical-gray-600 mt-1">{patient.diagnosis}</p>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-4 gap-6 mt-4">
                                    <div>
                                        <p className="text-xs text-clinical-gray-500 uppercase">Edad</p>
                                        <p className="text-lg font-semibold text-clinical-gray-900">{patient.age} años</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-clinical-gray-500 uppercase">Peso Actual</p>
                                        <p className="text-lg font-semibold text-clinical-gray-900">{patient.weight} kg</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-clinical-gray-500 uppercase">Altura</p>
                                        <p className="text-lg font-semibold text-clinical-gray-900">{patient.height} cm</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-clinical-gray-500 uppercase">IMC Actual</p>
                                        <p className="text-lg font-semibold text-clinical-blue-600">{patient.bmiCurrent}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Button */}
                        <div className="w-full md:w-auto mt-4 md:mt-0">
                            <Button
                                variant="primary"
                                onClick={handleNewConsultation}
                                className="w-full md:w-auto px-6 py-3 shadow-lg hover:shadow-xl transition-shadow flex justify-center"
                            >
                                <Activity size={20} className="mr-2" />
                                Iniciar Nueva Consulta
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* BMI Evolution Chart */}
                <Card>
                    <CardContent className="p-4 md:p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="text-clinical-blue-600" size={24} />
                            <h2 className="text-xl font-bold text-clinical-gray-900">Evolución del IMC</h2>
                        </div>
                        <BMIChart data={patient.bmiHistory} />
                    </CardContent>
                </Card>

                {/* Psychological Indicators Chart */}
                <Card>
                    <CardContent className="p-4 md:p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Brain className="text-clinical-blue-600" size={24} />
                            <h2 className="text-xl font-bold text-clinical-gray-900">Indicadores Psicológicos</h2>
                        </div>
                        <PsychologicalChart
                            current={patient.psychologicalIndicators.current}
                            previous={patient.psychologicalIndicators.previous}
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Consultation History Timeline */}
            <Card>
                <CardContent className="p-4 md:p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Calendar className="text-clinical-blue-600" size={24} />
                        <h2 className="text-xl font-bold text-clinical-gray-900">Historial de Consultas</h2>
                    </div>

                    <div className="space-y-4">
                        {patient.consultationHistory.map((consultation, index) => (
                            <div key={consultation.id} className="relative">
                                {/* Timeline Line */}
                                {index !== patient.consultationHistory.length - 1 && (
                                    <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-clinical-gray-200"></div>
                                )}

                                <div className="flex gap-4">
                                    {/* Timeline Dot */}
                                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-clinical-blue-100 flex items-center justify-center border-4 border-white shadow-md">
                                        {consultation.aiModel === 'gpt' ? (
                                            <span className="text-xs font-bold text-clinical-blue-700">GPT</span>
                                        ) : (
                                            <span className="text-xs font-bold text-clinical-green-700">DS</span>
                                        )}
                                    </div>

                                    {/* Consultation Card */}
                                    <div className="flex-1 bg-clinical-gray-50 rounded-lg p-4 hover:bg-clinical-gray-100 transition-colors">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <p className="text-sm font-semibold text-clinical-gray-900">
                                                        {new Date(consultation.date).toLocaleDateString('es-ES', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </p>
                                                    <Badge variant={consultation.aiModel === 'gpt' ? 'info' : 'success'}>
                                                        {consultation.aiModel === 'gpt' ? 'GPT-4' : 'DeepSeek'}
                                                    </Badge>
                                                </div>
                                                <p className="text-clinical-gray-700 mb-2">{consultation.diagnosis}</p>
                                                <p className="text-sm text-clinical-gray-500">{consultation.notes}</p>
                                            </div>

                                            <div className="flex flex-col md:flex-row items-end md:items-center gap-2">
                                                <Button variant="outline" onClick={() => { }} className="hidden md:flex">
                                                    Ver Detalles
                                                </Button>
                                                <Button variant="outline" onClick={() => { }} className="md:hidden p-2">
                                                    <Eye size={20} />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
