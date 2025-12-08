'use client';

import { useState } from 'react';
import { User, Hash, Calendar, Phone } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card, { CardContent } from '@/components/ui/Card';

export default function PatientForm({ onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        name: '',
        lastname: '',
        dni: '',
        birthdate: '',
        gender: true, // true = Masculino, false = Femenino
        phone: '',
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

        // Lastname validation
        if (!formData.lastname.trim()) {
            newErrors.lastname = 'El apellido es requerido';
        }

        // DNI validation
        if (!formData.dni.trim()) {
            newErrors.dni = 'El DNI es requerido';
        } else if (!/^\d{8}$/.test(formData.dni)) {
            newErrors.dni = 'El DNI debe tener 8 dígitos';
        }

        // Birthdate validation
        if (!formData.birthdate) {
            newErrors.birthdate = 'La fecha de nacimiento es requerida';
        } else {
            const birthDate = new Date(formData.birthdate);
            const today = new Date();
            if (birthDate >= today) {
                newErrors.birthdate = 'La fecha de nacimiento debe ser anterior a hoy';
            }
        }

        // Phone validation
        if (!formData.phone.trim()) {
            newErrors.phone = 'El teléfono es requerido';
        } else if (!/^\d{9}$/.test(formData.phone)) {
            newErrors.phone = 'El teléfono debe tener 9 dígitos';
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
            // Generate avatar URL
            const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}+${encodeURIComponent(formData.lastname)}&background=random&size=128`;

            const patientData = {
                ...formData,
                avatar: avatarUrl,
            };

            await onSubmit(patientData);
        } catch (error) {
            console.error('Error submitting form:', error);
            setErrors({ submit: error.message || 'Error al crear el paciente' });
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
                            Información Personal
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Name */}
                            <div>
                                <Input
                                    label="Nombre"
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    placeholder="Ingrese el nombre"
                                    icon={User}
                                />
                                {errors.name && (
                                    <p className="text-sm text-clinical-red-600 mt-1">{errors.name}</p>
                                )}
                            </div>

                            {/* Lastname */}
                            <div>
                                <Input
                                    label="Apellido"
                                    type="text"
                                    value={formData.lastname}
                                    onChange={(e) => handleChange('lastname', e.target.value)}
                                    placeholder="Ingrese el apellido"
                                    icon={User}
                                />
                                {errors.lastname && (
                                    <p className="text-sm text-clinical-red-600 mt-1">{errors.lastname}</p>
                                )}
                            </div>

                            {/* DNI */}
                            <div>
                                <Input
                                    label="DNI"
                                    type="text"
                                    value={formData.dni}
                                    onChange={(e) => handleChange('dni', e.target.value.replace(/\D/g, ''))}
                                    placeholder="12345678"
                                    icon={Hash}
                                    maxLength={8}
                                />
                                {errors.dni && (
                                    <p className="text-sm text-clinical-red-600 mt-1">{errors.dni}</p>
                                )}
                            </div>

                            {/* Phone */}
                            <div>
                                <Input
                                    label="Teléfono"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => handleChange('phone', e.target.value.replace(/\D/g, ''))}
                                    placeholder="987654321"
                                    icon={Phone}
                                    maxLength={9}
                                />
                                {errors.phone && (
                                    <p className="text-sm text-clinical-red-600 mt-1">{errors.phone}</p>
                                )}
                            </div>

                            {/* Birthdate */}
                            <div>
                                <Input
                                    label="Fecha de Nacimiento"
                                    type="date"
                                    value={formData.birthdate}
                                    onChange={(e) => handleChange('birthdate', e.target.value)}
                                    icon={Calendar}
                                />
                                {errors.birthdate && (
                                    <p className="text-sm text-clinical-red-600 mt-1">{errors.birthdate}</p>
                                )}
                            </div>

                            {/* Gender */}
                            <div>
                                <label className="text-sm font-medium text-clinical-gray-700 mb-2 block">
                                    Género
                                </label>
                                <div className="flex gap-6 mt-3">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="gender"
                                            checked={formData.gender === true}
                                            onChange={() => handleChange('gender', true)}
                                            className="w-4 h-4 text-clinical-blue-600 focus:ring-clinical-blue-500"
                                        />
                                        <span className="text-sm text-clinical-gray-700">Masculino</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="gender"
                                            checked={formData.gender === false}
                                            onChange={() => handleChange('gender', false)}
                                            className="w-4 h-4 text-clinical-blue-600 focus:ring-clinical-blue-500"
                                        />
                                        <span className="text-sm text-clinical-gray-700">Femenino</span>
                                    </label>
                                </div>
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
                            {isSubmitting ? 'Guardando...' : 'Crear Paciente'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}
