'use client';

import { useRouter } from 'next/navigation';
import IndicatorForm from '@/components/features/indicators/IndicatorForm';
import { createIndicator } from '@/services/indicatorsApi';

export default function NuevoIndicadorPage() {
    const router = useRouter();

    const handleSubmit = async (indicatorData) => {
        try {
            const newIndicator = await createIndicator(indicatorData);
            console.log('Indicador creado:', newIndicator);

            // Redirect to indicators list
            router.push('/dashboard/indicadores');
        } catch (error) {
            console.error('Error creating indicator:', error);
            throw error; // Re-throw to be handled by the form
        }
    };

    const handleCancel = () => {
        router.push('/dashboard/indicadores');
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-clinical-gray-900">Nuevo Indicador</h1>
                <p className="text-clinical-gray-600 mt-1">
                    Registre un nuevo indicador clínico en el sistema
                </p>
            </div>

            <IndicatorForm onSubmit={handleSubmit} onCancel={handleCancel} />
        </div>
    );
}
