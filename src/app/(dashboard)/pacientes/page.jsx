'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Pencil, Trash2 } from 'lucide-react';
import Card, { CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { allPatients, deletePatient } from '@/services/mockData';

export default function PacientesPage() {
    const router = useRouter();
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, patientId: null, patientName: '' });
    const [isDeleting, setIsDeleting] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const filters = [
        { id: 'all', label: 'Todos' },
        { id: 'stable', label: 'Estable' },
        { id: 'treatment', label: 'En tratamiento' },
        { id: 'critical', label: 'Crítico' },
    ];

    // Filter by category
    const categoryFiltered = activeFilter === 'all'
        ? allPatients
        : allPatients.filter(p => p.category === activeFilter);

    // Filter by search query
    const filteredPatients = categoryFiltered.filter(patient =>
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDeleteClick = (patient) => {
        setDeleteDialog({
            isOpen: true,
            patientId: patient.id,
            patientName: patient.name,
        });
    };

    const handleDeleteConfirm = async () => {
        try {
            setIsDeleting(true);
            deletePatient(deleteDialog.patientId);
            console.log('Paciente eliminado:', deleteDialog.patientId);

            // Close dialog and refresh list
            setDeleteDialog({ isOpen: false, patientId: null, patientName: '' });
            setRefreshKey(prev => prev + 1);
        } catch (error) {
            console.error('Error deleting patient:', error);
            alert('Error al eliminar el paciente: ' + error.message);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialog({ isOpen: false, patientId: null, patientName: '' });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-clinical-gray-900">Pacientes</h1>
                    <p className="text-clinical-gray-600 mt-1">Gestión de pacientes y consultas</p>
                </div>
                <Button
                    variant="primary"
                    onClick={() => {
                        try {
                            router.push('/pacientes/nuevo');
                        } catch (err) {
                            window.location.href = '/pacientes/nuevo';
                        }
                    }}
                    className="w-full sm:w-auto"
                >
                    Nuevo Paciente
                </Button>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-clinical-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Buscar paciente por nombre o diagnóstico..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-clinical-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinical-blue-500 focus:border-transparent transition-all"
                />
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 border-b border-clinical-gray-200 overflow-x-auto pb-1">
                {filters.map((filter) => (
                    <button
                        key={filter.id}
                        onClick={() => setActiveFilter(filter.id)}
                        className={`px-6 py-3 font-medium transition-all border-b-2 cursor-pointer whitespace-nowrap ${activeFilter === filter.id
                            ? 'border-clinical-blue-600 text-clinical-blue-600'
                            : 'border-transparent text-clinical-gray-600 hover:text-clinical-gray-900'
                            }`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            {/* Patient Cards */}
            <div className="grid grid-cols-1 gap-4">
                {filteredPatients.map((patient) => (
                    <Card key={patient.id} hover>
                        <CardContent className="py-4">
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                                {/* Avatar */}
                                <div className="w-12 h-12 rounded-full bg-clinical-blue-100 flex items-center justify-center text-clinical-blue-700 font-semibold shrink-0">
                                    {patient.avatar}
                                </div>

                                {/* Patient Info */}
                                <div className="flex-1 w-full md:w-auto">
                                    <h3 className="font-semibold text-clinical-gray-900">{patient.name}</h3>
                                    <p className="text-sm text-clinical-gray-600">{patient.role}</p>
                                </div>

                                {/* Status Badge */}
                                <div className="self-start md:self-center">
                                    <Badge variant={patient.status}>
                                        {patient.status === 'critical' ? 'Crítico' : 'Estable'}
                                    </Badge>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto mt-2 md:mt-0">
                                    <Button
                                        variant="outline"
                                        className="w-full sm:w-auto justify-center"
                                        onClick={() => {
                                            try {
                                                router.push(`/pacientes/${patient.id}/editar`);
                                            } catch (err) {
                                                window.location.href = `/pacientes/${patient.id}/editar`;
                                            }
                                        }}
                                    >
                                        <Pencil size={16} className="mr-2" />
                                        Editar
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full sm:w-auto justify-center text-clinical-red-600 hover:bg-clinical-red-50 border-clinical-red-300"
                                        onClick={() => handleDeleteClick(patient)}
                                    >
                                        <Trash2 size={16} className="mr-2" />
                                        Eliminar
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full sm:w-auto justify-center"
                                        onClick={() => {
                                            try {
                                                router.push(`/pacientes/${patient.id}/historial`);
                                            } catch (err) {
                                                window.location.href = `/pacientes/${patient.id}/historial`;
                                            }
                                        }}
                                    >
                                        Ver Historial
                                    </Button>
                                    <Button
                                        variant="primary"
                                        className="w-full sm:w-auto justify-center"
                                        onClick={() => {
                                            try {
                                                router.push(`/consulta/${patient.id}`);
                                            } catch (err) {
                                                window.location.href = `/consulta/${patient.id}`;
                                            }
                                        }}
                                    >
                                        Nueva Consulta
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredPatients.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-clinical-gray-500">
                        {searchQuery
                            ? `No se encontraron pacientes que coincidan con "${searchQuery}"`
                            : 'No se encontraron pacientes en esta categoría'
                        }
                    </p>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={deleteDialog.isOpen}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                title="Eliminar Paciente"
                message={`¿Está seguro que desea eliminar al paciente "${deleteDialog.patientName}"? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                cancelText="Cancelar"
                variant="danger"
                isLoading={isDeleting}
            />
        </div>
    );
}
