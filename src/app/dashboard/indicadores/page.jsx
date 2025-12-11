'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Pencil, Trash2, RefreshCw, Activity } from 'lucide-react';
import Card, { CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { getIndicators, removeIndicator } from '@/services/indicatorsApi';

export default function IndicadoresPage() {
    const router = useRouter();
    const [indicators, setIndicators] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, indicatorId: null, indicatorName: '' });
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchIndicators = async () => {
            try {
                setIsLoading(true);
                const data = await getIndicators();
                const indicatorList = Array.isArray(data) ? data : [];
                setIndicators(indicatorList);
                setError(null);
            } catch (err) {
                console.error('Error fetching indicators:', err);
                setError(err.message || 'No se pudieron cargar los indicadores');
            } finally {
                setIsLoading(false);
            }
        };

        fetchIndicators();
    }, []);

    const filteredIndicators = indicators.filter(indicator =>
        indicator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        indicator.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        indicator.unit.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDeleteClick = (indicator) => {
        setDeleteDialog({
            isOpen: true,
            indicatorId: indicator.id,
            indicatorName: indicator.name,
        });
    };

    const handleDeleteConfirm = async () => {
        try {
            setIsDeleting(true);
            await removeIndicator(deleteDialog.indicatorId);
            console.log('Indicador eliminado:', deleteDialog.indicatorId);

            setIndicators(prev => prev.filter(i => String(i.id) !== String(deleteDialog.indicatorId)));
            setDeleteDialog({ isOpen: false, indicatorId: null, indicatorName: '' });
        } catch (error) {
            console.error('Error deleting indicator:', error);
            alert('Error al eliminar el indicador: ' + error.message);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialog({ isOpen: false, indicatorId: null, indicatorName: '' });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-clinical-gray-900">Indicadores</h1>
                    <p className="text-clinical-gray-600 mt-1">Gestión de indicadores clínicos</p>
                </div>
                <Button
                    variant="primary"
                    onClick={() => {
                        try {
                            router.push('/dashboard/indicadores/nuevo');
                        } catch (err) {
                            window.location.href = '/dashboard/indicadores/nuevo';
                        }
                    }}
                    className="w-full sm:w-auto"
                >
                    Nuevo Indicador
                </Button>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-clinical-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Buscar indicador por nombre, tipo o unidad..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-clinical-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinical-blue-500 focus:border-transparent transition-all"
                />
            </div>

            {/* Indicators Cards */}
            <div className="grid grid-cols-1 gap-4">
                {isLoading && (
                    <Card>
                        <CardContent className="py-6 flex items-center justify-center gap-3 text-clinical-gray-600">
                            <RefreshCw className="animate-spin" size={18} />
                            <span>Cargando indicadores...</span>
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

                {!isLoading && !error && filteredIndicators.map((indicator) => {
                    return (
                        <Card key={indicator.id} hover>
                            <CardContent className="py-4">
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                                    {/* Icon */}
                                    <div className="w-12 h-12 rounded-full bg-clinical-blue-100 flex items-center justify-center text-clinical-blue-700 shrink-0">
                                        <Activity size={24} />
                                    </div>

                                    {/* Indicator Info */}
                                    <div className="flex-1 w-full md:w-auto">
                                        <h3 className="font-semibold text-clinical-gray-900">{indicator.name}</h3>
                                        <p className="text-sm text-clinical-gray-600">
                                            Tipo: {indicator.type} • Unidad: {indicator.unit}
                                        </p>
                                        <p className="text-xs text-clinical-gray-500 mt-1">
                                            Rango regular: {indicator.minRegularValue} - {indicator.maxRegularValue} {indicator.unit}
                                        </p>
                                    </div>

                                    {/* Type Badge */}
                                    <div className="self-start md:self-center">
                                        <Badge variant="stable">
                                            {indicator.type}
                                        </Badge>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto mt-2 md:mt-0">
                                        <Button
                                            variant="outline"
                                            className="w-full sm:w-auto flex items-center justify-center"
                                            onClick={() => {
                                                try {
                                                    router.push(`/dashboard/indicadores/${indicator.id}/editar`);
                                                } catch (err) {
                                                    window.location.href = `/dashboard/indicadores/${indicator.id}/editar`;
                                                }
                                            }}
                                        >
                                            <Pencil size={16} className="mr-2" />
                                            Editar
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="w-full sm:w-auto flex items-center justify-center text-clinical-red-600 hover:bg-clinical-red-50 border-clinical-red-300"
                                            onClick={() => handleDeleteClick(indicator)}
                                        >
                                            <Trash2 size={16} className="mr-2" />
                                            Eliminar
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {!isLoading && !error && filteredIndicators.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-clinical-gray-500">
                        {searchQuery
                            ? `No se encontraron indicadores que coincidan con "${searchQuery}"`
                            : 'No se encontraron indicadores'
                        }
                    </p>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={deleteDialog.isOpen}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                title="Eliminar Indicador"
                message={`¿Está seguro que desea eliminar el indicador "${deleteDialog.indicatorName}"? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                cancelText="Cancelar"
                variant="danger"
                isLoading={isDeleting}
            />
        </div>
    );
}
