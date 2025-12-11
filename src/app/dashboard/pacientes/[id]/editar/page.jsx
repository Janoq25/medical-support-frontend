'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import PatientForm from '@/components/features/patients/PatientForm';
import { getPatient, updatePatient } from '@/services/patientApi';

export default function EditarPacientePage() {
    const router = useRouter();
    const params = useParams();
    const [patient, setPatient] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadPatient = async () => {
            try {
                setIsLoading(true);
                const patientData = await getPatient(params.id);
                // Normalizamos fecha a formato YYYY-MM-DD para el input date
                const normalizedPatient = {
                    ...patientData,
                    birthdate: patientData.birthdate
                        ? String(patientData.birthdate).split('T')[0]
                        : '',
                };
                setPatient(normalizedPatient);
            } catch (err) {
                console.error('Error loading patient:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (params.id) {
            loadPatient();
        }
    }, [params.id]);

    const handleSubmit = async (patientData) => {
        try {
            const updatedPatient = await updatePatient(params.id, patientData);
            console.log('Paciente actualizado:', updatedPatient);

            // Redirect to patients list
            router.push('/dashboard/pacientes');
        } catch (error) {
            console.error('Error updating patient:', error);
            throw error; // Re-throw to be handled by the form
        }
    };

    const handleCancel = () => {
        router.push('/dashboard/pacientes');
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-clinical-blue-600 mx-auto"></div>
                    <p className="text-clinical-gray-600 mt-4">Cargando paciente...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-clinical-gray-900">Error</h1>
                </div>
                <div className="bg-clinical-red-50 border border-clinical-red-200 text-clinical-red-700 px-6 py-4 rounded-lg">
                    <p className="font-semibold">No se pudo cargar el paciente</p>
                    <p className="text-sm mt-1">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-clinical-gray-900">Editar Paciente</h1>
                <p className="text-clinical-gray-600 mt-1">
                    Actualice la información del paciente
                </p>
            </div>

            <PatientForm
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                mode="edit"
                initialData={patient}
            />
        </div>
    );
}
