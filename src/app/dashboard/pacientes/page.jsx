'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Pencil, Trash2, RefreshCw } from 'lucide-react';
import Card, { CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { getPatients, removePatient } from '@/services/patientApi';
import { getLatestInquiryByPatient } from '@/services/inquiriesApi';

export default function PacientesPage() {
    const router = useRouter();
    const [patients, setPatients] = useState([]);
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, patientId: null, patientName: '' });
    const [isDeleting, setIsDeleting] = useState(false);

    const filters = [
        { id: 'all', label: 'Todos' },
        { id: 'stable', label: 'Estable' },
        { id: 'in_treatment', label: 'En tratamiento' },
        { id: 'critical', label: 'Crítico' },
    ];

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                setIsLoading(true);
                const data = await getPatients();
                const patientList = Array.isArray(data) ? data : [];

                // Traer el último inquiry de cada paciente para mostrar estado y diagnóstico
                const withInquiry = await Promise.all(
                    patientList.map(async (p) => {
                        try {
                            const latestInquiry = await getLatestInquiryByPatient(p.id);
                            return { ...p, latestInquiry };
                        } catch (inquiryErr) {
                            console.warn('Inquiry fetch failed for patient', p.id, inquiryErr);
                            return { ...p, latestInquiry: null };
                        }
                    })
                );

                setPatients(withInquiry);
                setError(null);
            } catch (err) {
                console.error('Error fetching patients:', err);
                setError(err.message || 'No se pudieron cargar los pacientes');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPatients();
    }, []);

    const filteredByStatus = activeFilter === 'all'
        ? patients
        : patients.filter((p) => (p.latestInquiry?.patient_state || 'stable') === activeFilter);

    const filteredPatients = filteredByStatus.filter(patient =>
        `${patient.name} ${patient.lastname}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (patient.latestInquiry?.diagnosis || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (patient.dni || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDeleteClick = (patient) => {
        setDeleteDialog({
            isOpen: true,
            patientId: patient.id,
            patientName: `${patient.name} ${patient.lastname}`.trim() || patient.name,
        });
    };

    const handleDeleteConfirm = async () => {
        try {
            setIsDeleting(true);
            await removePatient(deleteDialog.patientId);
            console.log('Paciente eliminado:', deleteDialog.patientId);

            setPatients(prev => prev.filter(p => String(p.id) !== String(deleteDialog.patientId)));
            setDeleteDialog({ isOpen: false, patientId: null, patientName: '' });
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
                            router.push('/dashboard/pacientes/nuevo');
                        } catch (err) {
                            window.location.href = '/dashboard/pacientes/nuevo';
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
                {isLoading && (
                    <Card>
                        <CardContent className="py-6 flex items-center justify-center gap-3 text-clinical-gray-600">
                            <RefreshCw className="animate-spin" size={18} />
                            <span>Cargando pacientes...</span>
                        </CardContent>
                    </Card>
                )}

                {error && !isLoading && (
                    <Card>
                        <CardContent className="py-4 text-clinical-red-700">
                            {error}
                        </CardContent>
                    </Card>
                )}

                {!isLoading && !error && filteredPatients.map((patient) => {
                    const initials = `${patient.name?.charAt(0) || ''}${patient.lastname?.charAt(0) || ''}`.toUpperCase();
                    const fullName = `${patient.name} ${patient.lastname}`.trim();
                    const latestState = patient.latestInquiry?.patient_state || 'stable';
                    const diagnosis = patient.latestInquiry?.diagnosis || 'Sin diagnóstico';

                    const badgeVariant = latestState === 'critical'
                        ? 'critical'
                        : latestState === 'in_treatment'
                            ? 'warning'
                            : 'stable';

                    const badgeLabel = latestState === 'critical'
                        ? 'Crítico'
                        : latestState === 'in_treatment'
                            ? 'En tratamiento'
                            : 'Estable';

                    return (
                        <Card key={patient.id} hover>
                            <CardContent className="py-4">
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                                    {/* Avatar */}
                                    <div className="w-12 h-12 rounded-full bg-clinical-blue-100 flex items-center justify-center text-clinical-blue-700 font-semibold shrink-0">
                                        {initials || 'P'}
                                    </div>

                                    {/* Patient Info */}
                                    <div className="flex-1 w-full md:w-auto">
                                        <h3 className="font-semibold text-clinical-gray-900">{fullName || 'Paciente sin nombre'}</h3>
                                        <p className="text-sm text-clinical-gray-600">{diagnosis}</p>
                                        <p className="text-xs text-clinical-gray-500 mt-1">DNI: {patient.dni || 'No registrado'} • Tel: {patient.phone || 'Sin teléfono'}</p>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="self-start md:self-center">
                                        <Badge variant={badgeVariant}>
                                            {badgeLabel}
                                        </Badge>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto mt-2 md:mt-0">
                                        <Button
                                            variant="outline"
                                            className="w-full sm:w-auto flex items-center justify-center"
                                            onClick={() => {
                                                try {
                                                    router.push(`/pacientes/${patient.id}/editar`);
                                                } catch (err) {
                                                    window.location.href = `/dashboard/pacientes/${patient.id}/editar`;
                                                }
                                            }}
                                        >
                                            <Pencil size={16} className="mr-2" />
                                            Editar
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="w-full sm:w-auto flex items-center justify-center text-clinical-red-600 hover:bg-clinical-red-50 border-clinical-red-300"
                                            onClick={() => handleDeleteClick(patient)}
                                        >
                                            <Trash2 size={16} className="mr-2" />
                                            Eliminar
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="w-full sm:w-auto flex items-center justify-center"
                                            onClick={() => {
                                                try {
                                                    router.push(`/pacientes/${patient.id}/historial`);
                                                } catch (err) {
                                                    window.location.href = `/dashboard/pacientes/${patient.id}/historial`;
                                                }
                                            }}
                                        >
                                            Ver Historial
                                        </Button>
                                        <Button
                                            variant="primary"
                                            className="w-full sm:w-auto flex items-center justify-center"
                                            onClick={() => {
                                                try {
                                                    router.push(`/consulta/${patient.id}`);
                                                } catch (err) {
                                                    window.location.href = `/dashboard/consulta/${patient.id}`;
                                                }
                                            }}
                                        >
                                            Nueva Consulta
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {!isLoading && !error && filteredPatients.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-clinical-gray-500">
                        {searchQuery
                            ? `No se encontraron pacientes que coincidan con "${searchQuery}"`
                            : 'No se encontraron pacientes'
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
                message={`隅Estケ seguro que desea eliminar al paciente "${deleteDialog.patientName}"? Esta acciИn no se puede deshacer.`}
                confirmText="Eliminar"
                cancelText="Cancelar"
                variant="danger"
                isLoading={isDeleting}
            />
        </div>
    );
}
