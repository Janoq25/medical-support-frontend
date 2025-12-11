'use client';

import { useState } from 'react';
import { Activity, Hash, Ruler } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card, { CardContent } from '@/components/ui/Card';

export default function IndicatorForm({ onSubmit, onCancel, mode = 'create', initialData = null }) {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        type: initialData?.type || '',
        unit: initialData?.unit || '',
        minRegularValue: initialData?.minRegularValue ?? '',
        maxRegularValue: initialData?.maxRegularValue ?? '',
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'El nombre es requerido';
        }

        // Type validation
        if (!formData.type.trim()) {
            newErrors.type = 'El tipo es requerido';
        }

        // Unit validation
        if (!formData.unit.trim()) {
            newErrors.unit = 'La unidad es requerida';
        }

        // Min value validation
        if (formData.minRegularValue === '' || formData.minRegularValue === null) {
            newErrors.minRegularValue = 'El valor mínimo es requerido';
        } else if (isNaN(formData.minRegularValue)) {
            newErrors.minRegularValue = 'Debe ser un número válido';
        }

        // Max value validation
        if (formData.maxRegularValue === '' || formData.maxRegularValue === null) {
            newErrors.maxRegularValue = 'El valor máximo es requerido';
        } else if (isNaN(formData.maxRegularValue)) {
            newErrors.maxRegularValue = 'Debe ser un número válido';
        }

        // Min < Max validation
        if (
            formData.minRegularValue !== '' &&
            formData.maxRegularValue !== '' &&
            !isNaN(formData.minRegularValue) &&
            !isNaN(formData.maxRegularValue) &&
            parseFloat(formData.minRegularValue) >= parseFloat(formData.maxRegularValue)
        ) {
            newErrors.minRegularValue = 'El valor mínimo debe ser menor que el máximo';
            newErrors.maxRegularValue = 'El valor máximo debe ser mayor que el mínimo';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const indicatorData = {
                ...formData,
                minRegularValue: parseFloat(formData.minRegularValue),
                maxRegularValue: parseFloat(formData.maxRegularValue),
            };

            await onSubmit(indicatorData);
        } catch (error) {
            console.error('Error submitting form:', error);
            setErrors({ submit: error.message || 'Error al guardar el indicador' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-clinical-gray-900 mb-4">
                            Información del Indicador
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Name */}
                            <div>
                                <Input
                                    label="Nombre"
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    placeholder="Ej: Presión Arterial"
                                    icon={Activity}
                                />
                                {errors.name && (
                                    <p className="text-sm text-clinical-red-600 mt-1">{errors.name}</p>
                                )}
                            </div>

                            {/* Type */}
                            <div>
                                <Input
                                    label="Tipo"
                                    type="text"
                                    value={formData.type}
                                    onChange={(e) => handleChange('type', e.target.value)}
                                    placeholder="Ej: Cardiovascular"
                                    icon={Hash}
                                />
                                {errors.type && (
                                    <p className="text-sm text-clinical-red-600 mt-1">{errors.type}</p>
                                )}
                            </div>

                            {/* Unit */}
                            <div>
                                <Input
                                    label="Unidad"
                                    type="text"
                                    value={formData.unit}
                                    onChange={(e) => handleChange('unit', e.target.value)}
                                    placeholder="Ej: mmHg, mg/dL, °C"
                                    icon={Ruler}
                                />
                                {errors.unit && (
                                    <p className="text-sm text-clinical-red-600 mt-1">{errors.unit}</p>
                                )}
                            </div>

                            {/* Min Regular Value */}
                            <div>
                                <Input
                                    label="Valor Mínimo Regular"
                                    type="number"
                                    step="0.01"
                                    value={formData.minRegularValue}
                                    onChange={(e) => handleChange('minRegularValue', e.target.value)}
                                    placeholder="Ej: 90"
                                    icon={Hash}
                                />
                                {errors.minRegularValue && (
                                    <p className="text-sm text-clinical-red-600 mt-1">{errors.minRegularValue}</p>
                                )}
                            </div>

                            {/* Max Regular Value */}
                            <div>
                                <Input
                                    label="Valor Máximo Regular"
                                    type="number"
                                    step="0.01"
                                    value={formData.maxRegularValue}
                                    onChange={(e) => handleChange('maxRegularValue', e.target.value)}
                                    placeholder="Ej: 120"
                                    icon={Hash}
                                />
                                {errors.maxRegularValue && (
                                    <p className="text-sm text-clinical-red-600 mt-1">{errors.maxRegularValue}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Submit Error */}
                    {errors.submit && (
                        <div className="bg-clinical-red-50 border border-clinical-red-200 text-clinical-red-700 px-4 py-3 rounded-lg text-sm">
                            {errors.submit}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            className="w-full sm:w-auto order-2 sm:order-1"
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full sm:w-auto order-1 sm:order-2"
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? (mode === 'edit' ? 'Actualizando...' : 'Guardando...')
                                : (mode === 'edit' ? 'Actualizar Indicador' : 'Crear Indicador')
                            }
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}
