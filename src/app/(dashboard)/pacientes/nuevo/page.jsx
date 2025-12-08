'use client';

import { useRouter } from 'next/navigation';
import PatientForm from '@/components/features/patients/PatientForm';
import { addPatient } from '@/services/mockData';

export default function NuevoPacientePage() {
    const router = useRouter();

    const handleSubmit = async (patientData) => {
        try {
            const newPatient = addPatient(patientData);
            console.log('Paciente creado:', newPatient);

            // Redirect to patients list
            router.push('/pacientes');
        } catch (error) {
            console.error('Error creating patient:', error);
            throw error; // Re-throw to be handled by the form
        }
    };

    const handleCancel = () => {
        router.push('/pacientes');
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-clinical-gray-900">Nuevo Paciente</h1>
                <p className="text-clinical-gray-600 mt-1">
                    Registre un nuevo paciente en el sistema
                </p>
            </div>

            <PatientForm onSubmit={handleSubmit} onCancel={handleCancel} />
        </div>
    );
}
