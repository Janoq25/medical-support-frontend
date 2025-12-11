'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { RefreshCw } from 'lucide-react';
import IndicatorForm from '@/components/features/indicators/IndicatorForm';
import { getIndicator, updateIndicator } from '@/services/indicatorsApi';
import Card, { CardContent } from '@/components/ui/Card';

export default function EditarIndicadorPage() {
    const router = useRouter();
    const params = useParams();
    const [indicator, setIndicator] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchIndicator = async () => {
            try {
                setIsLoading(true);
                const data = await getIndicator(params.id);
                setIndicator(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching indicator:', err);
                setError(err.message || 'No se pudo cargar el indicador');
            } finally {
                setIsLoading(false);
            }
        };

        if (params.id) {
            fetchIndicator();
        }
    }, [params.id]);

    const handleSubmit = async (indicatorData) => {
        try {
            const updatedIndicator = await updateIndicator(params.id, indicatorData);
            console.log('Indicador actualizado:', updatedIndicator);

            // Redirect to indicators list
            router.push('/dashboard/indicadores');
        } catch (error) {
            console.error('Error updating indicator:', error);
            throw error; // Re-throw to be handled by the form
        }
    };

    const handleCancel = () => {
        router.push('/dashboard/indicadores');
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-clinical-gray-900">Editar Indicador</h1>
                    <p className="text-clinical-gray-600 mt-1">
                        Actualice la información del indicador
                    </p>
                </div>
                <Card>
                    <CardContent className="py-12 flex items-center justify-center gap-3 text-clinical-gray-600">
                        <RefreshCw className="animate-spin" size={18} />
                        <span>Cargando indicador...</span>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-clinical-gray-900">Editar Indicador</h1>
                    <p className="text-clinical-gray-600 mt-1">
                        Actualice la información del indicador
                    </p>
                </div>
                <Card>
                    <CardContent className="py-4 text-clinical-red-700">
                        {error}
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-clinical-gray-900">Editar Indicador</h1>
                <p className="text-clinical-gray-600 mt-1">
                    Actualice la información del indicador
                </p>
            </div>

            <IndicatorForm
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                mode="edit"
                initialData={indicator}
            />
        </div>
    );
}
