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
                    <div className="flex flex-col gap-6">
                        {/* 1. Avatar and Name */}
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-clinical-blue-500 to-clinical-blue-700 flex items-center justify-center text-2xl md:text-3xl font-bold shadow-lg shrink-0">
                                {`${patient.name?.charAt(0) || ''}${patient.lastname?.charAt(0) || ''}`.toUpperCase() || 'P'}
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold text-clinical-gray-900">{patient.name} {patient.lastname}</h1>
                        </div>

                        {/* 2. Diagnosis */}
                        <div className="bg-clinical-gray-50 p-4 rounded-lg border border-clinical-gray-100">
                            <h3 className="text-sm font-bold text-clinical-gray-700 mb-1 uppercase tracking-wide">Diagnóstico Reciente</h3>
                            <p className="text-clinical-gray-800 text-lg leading-relaxed">
                                {latestInquiry?.diagnosis || 'Sin diagnóstico previo'}
                            </p>
                        </div>

                        {/* 3. Secondary Data */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-clinical-gray-600">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">Estado:</span>
                                <Badge variant={badgeVariant}>{badgeLabel}</Badge>
                            </div>
                            <div className="w-px h-4 bg-clinical-gray-300 hidden sm:block"></div>
                            <div>
                                <span className="font-semibold">DNI:</span> {patient.dni || 'No registrado'}
                            </div>
                        </div>

                        {/* 4. Button */}
                        <div className="pt-2">
                            <Button
                                variant="primary"
                                onClick={() => router.push(`/dashboard/consulta/${id}`)}
                                className="w-full md:w-auto px-8 py-3 shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                            >
                                <Activity size={20} />
                                Iniciar Nueva Consulta
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Charts Section (placeholder since no indicator history yet) */}
            {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            </div> */}

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
                            {inquiries.map((consultation) => (
                                <div key={consultation.id} className="bg-clinical-gray-50 rounded-lg p-4 hover:bg-clinical-gray-100 transition-colors border border-clinical-gray-100">
                                    <div className="flex flex-col gap-3">
                                        {/* Header: Icon, Date, Status, Button */}
                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-clinical-blue-100 flex items-center justify-center border-2 border-white shadow-sm">
                                                    <span className="text-xs font-bold text-clinical-blue-700">
                                                        {consultation.type_diagnosis === 'deepseek'
                                                            ? 'DS'
                                                            : consultation.type_diagnosis === 'chatgpt'
                                                                ? 'GPT'
                                                                : 'MD'}
                                                    </span>
                                                </div>
                                                <p className="text-sm font-bold text-clinical-gray-900">
                                                    {new Date(consultation.createdAt).toLocaleDateString('es-ES', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                                <Badge variant={
                                                    consultation.patient_state === 'critical' ? 'critical' :
                                                        consultation.patient_state === 'in_treatment' ? 'warning' : 'stable'
                                                }>
                                                    {consultation.patient_state === 'critical'
                                                        ? 'Crítico'
                                                        : consultation.patient_state === 'in_treatment'
                                                            ? 'En tratamiento'
                                                            : 'Estable'}
                                                </Badge>
                                            </div>

                                            {/* <div className="flex items-center">
                                                <Button variant="outline" onClick={() => { }} className="hidden md:flex text-xs h-8">
                                                    Ver Detalles
                                                </Button>
                                                <Button variant="outline" onClick={() => { }} className="md:hidden p-2 h-8 w-8 flex items-center justify-center">
                                                    <Eye size={16} />
                                                </Button>
                                            </div> */}
                                        </div>

                                        {/* Diagnosis */}
                                        <div className="rounded border border-clinical-gray-200">
                                            <p className="text-sm leading-relaxed">
                                                {consultation.diagnosis}
                                            </p>
                                        </div>

                                        {/* Feedback */}
                                        {consultation.feedback && (
                                            <p className="text-xs text-clinical-gray-500 italic">
                                                Nota: {consultation.feedback}
                                            </p>
                                        )}
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
