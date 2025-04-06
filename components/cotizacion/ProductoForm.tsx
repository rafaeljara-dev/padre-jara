import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PlusCircle, Pencil, Check } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { AlertTriangle } from "lucide-react";
import { ProductoItem } from "@/components/cotizacion-pdf";

interface ProductoFormProps {
    nuevoProducto: Omit<ProductoItem, "id">;
    setNuevoProducto: React.Dispatch<React.SetStateAction<Omit<ProductoItem, "id">>>;
    agregarProducto: () => void;
    productoEnEdicion: string | null;
    cancelarEdicion: () => void;
    showConfirmation: boolean;
}

export const ProductoForm = ({
    nuevoProducto,
    setNuevoProducto,
    agregarProducto,
    productoEnEdicion,
    cancelarEdicion,
    showConfirmation
}: ProductoFormProps) => {
    // Estado para controlar los errores de validación
    const [camposConError, setCamposConError] = useState<{
        nombre: boolean;
        cantidad: boolean;
        precio: boolean;
    }>({
        nombre: false,
        cantidad: false,
        precio: false
    });

    // Función para validar y guardar el producto
    const handleAgregarProducto = () => {
        // Resetear todos los errores
        setCamposConError({
            nombre: false,
            cantidad: false,
            precio: false
        });

        // Validaciones específicas con mensajes personalizados
        if (!nuevoProducto.nombre) {
            setCamposConError(prev => ({ ...prev, nombre: true }));
            toast.error("Falta el nombre del producto", {
                style: { backgroundColor: "#FFF8E1", color: "#F59E0B", borderColor: "#F59E0B" },
                icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
            });
            return;
        }

        if (nuevoProducto.cantidad <= 0) {
            setCamposConError(prev => ({ ...prev, cantidad: true }));
            toast.error("La cantidad debe ser mayor a cero", {
                style: { backgroundColor: "#FFF8E1", color: "#F59E0B", borderColor: "#F59E0B" },
                icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
            });
            return;
        }

        if (nuevoProducto.precio <= 0) {
            setCamposConError(prev => ({ ...prev, precio: true }));
            toast.error("El precio debe ser mayor a cero", {
                style: { backgroundColor: "#FFF8E1", color: "#F59E0B", borderColor: "#F59E0B" },
                icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
            });
            return;
        }

        // Llamar a la función para agregar/actualizar el producto
        agregarProducto();
    };

    // Manejador de cambio de inputs con eliminación de errores
    const handleInputChange = (field: keyof typeof camposConError, value: string | number) => {
        // Eliminar el estado de error al interactuar con el campo
        if (camposConError[field]) {
            setCamposConError(prev => ({ ...prev, [field]: false }));
        }

        // Actualizar el valor del campo según su tipo
        if (field === 'nombre') {
            setNuevoProducto({ ...nuevoProducto, [field]: value as string });
        } else if (field === 'cantidad') {
            setNuevoProducto({ ...nuevoProducto, [field]: parseInt(value as string) || 0 });
        } else if (field === 'precio') {
            setNuevoProducto({ ...nuevoProducto, [field]: parseFloat(value as string) || 0 });
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{productoEnEdicion ? "Editar producto" : "Agregar producto"}</CardTitle>
                <CardDescription>
                    {productoEnEdicion
                        ? "Modifique los detalles del producto seleccionado"
                        : "Ingrese los detalles del producto a cotizar"}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="nombreProducto" className={camposConError.nombre ? "text-amber-500 font-medium" : ""}>Nombre del producto</Label>
                    <Input
                        id="nombreProducto"
                        placeholder="Ej. Laptop HP"
                        value={nuevoProducto.nombre}
                        onChange={(e) => handleInputChange('nombre', e.target.value)}
                        className={camposConError.nombre ? "border-2 border-amber-500 shadow-sm shadow-amber-200" : ""}
                    />
                    {camposConError.nombre && (
                        <p className="text-xs text-amber-500 mt-1">El nombre del producto es obligatorio</p>
                    )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="cantidad" className={camposConError.cantidad ? "text-amber-500 font-medium" : ""}>Cantidad</Label>
                        <Input
                            id="cantidad"
                            type="number"
                            min="1"
                            step="1"
                            value={nuevoProducto.cantidad}
                            onChange={(e) => handleInputChange('cantidad', e.target.value)}
                            className={camposConError.cantidad ? "border-2 border-amber-500 shadow-sm shadow-amber-200" : ""}
                        />
                        {camposConError.cantidad && (
                            <p className="text-xs text-amber-500 mt-1">Debe ser mayor a cero</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="precio" className={camposConError.precio ? "text-amber-500 font-medium" : ""}>Precio (MXN)</Label>
                        <Input
                            id="precio"
                            type="number"
                            min="0"
                            step="0.01"
                            value={nuevoProducto.precio}
                            onChange={(e) => handleInputChange('precio', e.target.value)}
                            className={camposConError.precio ? "border-2 border-amber-500 shadow-sm shadow-amber-200" : ""}
                        />
                        {camposConError.precio && (
                            <p className="text-xs text-amber-500 mt-1">Debe ser mayor a cero</p>
                        )}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                {productoEnEdicion && (
                    <Button
                        variant="outline"
                        onClick={cancelarEdicion}
                    >
                        Cancelar
                    </Button>
                )}
                <Button
                    className={`relative overflow-hidden ${productoEnEdicion ? "" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}
                    onClick={handleAgregarProducto}
                    variant={"secondary"}
                >
                    <span className={`flex items-center transition-transform duration-300 text-white ${showConfirmation ? "translate-y-[-40px]" : ""}`}>
                        {productoEnEdicion ? (
                            <>
                                <Pencil className="mr-2 h-4 w-4" />
                                Actualizar producto
                            </>
                        ) : (
                            <>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Agregar producto
                            </>
                        )}
                    </span>
                    <span className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ${showConfirmation ? "translate-y-0" : "translate-y-[40px]"}`}>
                        <Check className="h-6 w-6" />
                    </span>
                </Button>
            </CardFooter>
        </Card>
    );
};

export default ProductoForm; 