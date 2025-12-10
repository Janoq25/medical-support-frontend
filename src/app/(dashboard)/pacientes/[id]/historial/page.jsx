'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Activity, TrendingUp, Brain, Eye } from 'lucide-react';
import Card, { CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { getPatient } from '@/services/patientApi';
import { getInquiriesByPatient } from '@/services/inquiriesApi';

export default function PatientHistoryPage({ params }) {
    const router = useRouter();
    const { id } = use(params);

    const [patient, setPatient] = useState(null);
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [patientData, inquiryData] = await Promise.all([
                    getPatient(id),
                    getInquiriesByPatient(id),
                ]);
                setPatient(patientData);
                setInquiries(Array.isArray(inquiryData) ? inquiryData : []);
                setError(null);
            } catch (err) {
                console.error('Error loading history:', err);
                setError(err.message || 'No se pudo cargar el historial del paciente');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-clinical-blue-600 mx-auto"></div>
                    <p className="text-clinical-gray-600 mt-4">Cargando historial...</p>
                </div>
            </div>
        );
    }

    if (error || !patient) {
        return (
            <div className="space-y-4">
                <h1 className="text-2xl font-bold text-clinical-gray-900">Historial</h1>
                <Card>
                    <CardContent className="text-clinical-red-700">
                        {error || 'Paciente no encontrado'}
                    </CardContent>
                </Card>
            </div>
        );
    }

    const latestInquiry = inquiries[0] || null;
    const badgeVariant = latestInquiry?.patient_state === 'critical'
        ? 'critical'
        : latestInquiry?.patient_state === 'in_treatment'
            ? 'warning'
            : 'stable';
    const badgeLabel = latestInquiry?.patient_state === 'critical'
        ? 'Crítico'
        : latestInquiry?.patient_state === 'in_treatment'
            ? 'En tratamiento'
            : 'Estable';

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
                                {`${patient.name?.charAt(0) || ''}${patient.lastname?.charAt(0) || ''}`.toUpperCase() || 'P'}
                            </div>

                            {/* Patient Info */}
                            <div className="space-y-3">
                                <div>
                                    <h1 className="text-3xl font-bold text-clinical-gray-900">{patient.name} {patient.lastname}</h1>
                                    <p className="text-clinical-gray-600 mt-1">{latestInquiry?.diagnosis || 'Sin diagnóstico previo'}</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Badge variant={badgeVariant}>{badgeLabel}</Badge>
                                    <span className="text-sm text-clinical-gray-600">DNI: {patient.dni || 'No registrado'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Button */}
                        <div className="w-full md:w-auto mt-4 md:mt-0">
                            <Button
                                variant="primary"
                                onClick={() => router.push(`/consulta/${id}`)}
                                className="w-full md:w-auto px-6 py-3 shadow-lg hover:shadow-xl transition-shadow flex justify-center"
                            >
                                <Activity size={20} className="mr-2" />
                                Iniciar Nueva Consulta
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Charts Section (placeholder since no indicator history yet) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardContent className="p-4 md:p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="text-clinical-blue-600" size={24} />
                            <h2 className="text-xl font-bold text-clinical-gray-900">Evolución del IMC</h2>
                        </div>
                        <div className="text-sm text-clinical-gray-500">
                            Aún no hay datos de indicadores para graficar.
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 md:p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Brain className="text-clinical-blue-600" size={24} />
                            <h2 className="text-xl font-bold text-clinical-gray-900">Indicadores Psicológicos</h2>
                        </div>
                        <div className="text-sm text-clinical-gray-500">
                            Aún no hay datos de indicadores para graficar.
                        </div>
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

                    {inquiries.length === 0 ? (
                        <div className="text-clinical-gray-500 py-6">
                            Aún no hay consultas registradas para este paciente.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {inquiries.map((consultation, index) => (
                                <div key={consultation.id} className="relative">
                                    {index !== inquiries.length - 1 && (
                                        <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-clinical-gray-200"></div>
                                    )}

                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-clinical-blue-100 flex items-center justify-center border-4 border-white shadow-md">
                                            <span className="text-xs font-bold text-clinical-blue-700">
                                                {consultation.type_diagnosis === 'deepseek'
                                                    ? 'DS'
                                                    : consultation.type_diagnosis === 'chatgpt'
                                                        ? 'GPT'
                                                        : 'MD'}
                                            </span>
                                        </div>

                                        <div className="flex-1 bg-clinical-gray-50 rounded-lg p-4 hover:bg-clinical-gray-100 transition-colors">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <p className="text-sm font-semibold text-clinical-gray-900">
                                                            {new Date(consultation.createdAt).toLocaleDateString('es-ES', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
                                                        </p>
                                                        <Badge variant={badgeVariant}>
                                                            {consultation.patient_state === 'critical'
                                                                ? 'Crítico'
                                                                : consultation.patient_state === 'in_treatment'
                                                                    ? 'En tratamiento'
                                                                    : 'Estable'}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-clinical-gray-700 mb-2">{consultation.diagnosis}</p>
                                                    {consultation.feedback && (
                                                        <p className="text-sm text-clinical-gray-500">{consultation.feedback}</p>
                                                    )}
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
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
