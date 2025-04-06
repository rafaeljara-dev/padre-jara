import { useState } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash, Pencil, AlertTriangle } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    DatosCotizacion,
    calcularTotal,
    calcularSubtotal,
    calcularIva
} from "@/components/cotizacion-pdf";

interface ProductoTableProps {
    cotizacion: DatosCotizacion;
    onDeleteProducto: (id: string) => void;
    onEditProducto: (id: string) => void;
    onSwitchChange: (field: string, value: boolean) => void;
}

export const ProductoTable = ({
    cotizacion,
    onDeleteProducto,
    onEditProducto,
    onSwitchChange
}: ProductoTableProps) => {
    // Estado para manejar el producto a eliminar
    const [productoAEliminar, setProductoAEliminar] = useState<string | null>(null);

    // Función para confirmar la eliminación
    const confirmarEliminacion = () => {
        if (productoAEliminar) {
            onDeleteProducto(productoAEliminar);
            setProductoAEliminar(null);
        }
    };

    return (
        <>
            <Table>
                <TableCaption className="pb-4">Lista de productos para cotización</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Producto</TableHead>
                        <TableHead>Cantidad</TableHead>
                        <TableHead>Precio unitario</TableHead>
                        <TableHead>Subtotal</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {cotizacion.productos.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center text-muted-foreground">
                                No hay productos agregados a la cotización
                            </TableCell>
                        </TableRow>
                    ) : (
                        cotizacion.productos.map((producto) => (
                            <TableRow key={producto.id}>
                                <TableCell className="font-medium">{producto.nombre}</TableCell>
                                <TableCell>{producto.cantidad}</TableCell>
                                <TableCell>${producto.precio.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                                <TableCell>${(producto.cantidad * producto.precio).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="secondary"
                                            size="icon"
                                            onClick={() => onEditProducto(producto.id)}
                                            className="transition-all duration-300 hover:scale-105"
                                        >
                                            <Pencil className="h-4 w-4 text-white" />
                                        </Button>

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    className="text-white transition-all duration-300 hover:scale-105"
                                                >
                                                    <Trash className="h-4 w-4 text-white" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="max-w-xs">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle className="text-rose-600 flex items-center gap-2">
                                                        <AlertTriangle className="h-5 w-5" /> ¿Eliminar producto?
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        ¿Está seguro de eliminar {producto.nombre}? Esta acción no se puede deshacer.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter className="flex gap-2 sm:justify-end">
                                                    <AlertDialogCancel className="m-0">Cancelar</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        className="bg-rose-500 hover:bg-rose-600 m-0"
                                                        onClick={() => onDeleteProducto(producto.id)}
                                                    >
                                                        Eliminar
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                    {cotizacion.productos.length > 0 && (
                        <>
                            <TableRow>
                                <TableCell colSpan={3} className="text-right font-bold">Subtotal:</TableCell>
                                <TableCell className="font-medium">${calcularSubtotal(cotizacion.productos).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                                <TableCell></TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell colSpan={3} className="text-right font-bold">IVA (8%):</TableCell>
                                <TableCell className="font-medium">
                                    {cotizacion.aplicarIva
                                        ? `$${calcularIva(cotizacion.productos).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                        : "$0.00"}
                                </TableCell>
                                <TableCell></TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell colSpan={3} className="text-right font-bold">Total:</TableCell>
                                <TableCell className="font-bold">${calcularTotal(cotizacion.productos, cotizacion.aplicarIva).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </>
                    )}
                </TableBody>
            </Table>

            <div className="flex flex-col sm:flex-row items-end justify-end gap-4 mt-6">
                <div className="flex items-center space-x-2 w-full sm:w-auto bg-muted border border-border rounded-md px-3 py-2">
                    <Label htmlFor="aplicar-iva" className="text-sm font-medium text-foreground">
                        Aplicar IVA (8%):
                    </Label>
                    <Switch
                        id="aplicar-iva"
                        checked={cotizacion.aplicarIva}
                        onCheckedChange={(checked: boolean) =>
                            onSwitchChange('aplicarIva', checked)
                        }
                        className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-gray-600 data-[state=checked]:border-emerald-600 data-[state=unchecked]:border-gray-700"
                    />
                </div>
                <div className="flex items-center space-x-2 w-full sm:w-auto bg-muted border border-border rounded-md px-3 py-2">
                    <Label htmlFor="mostrar-datos-bancarios" className="text-sm font-medium text-foreground">
                        Mostrar datos bancarios:
                    </Label>
                    <Switch
                        id="mostrar-datos-bancarios"
                        checked={cotizacion.mostrarDatosBancarios}
                        onCheckedChange={(checked: boolean) =>
                            onSwitchChange('mostrarDatosBancarios', checked)
                        }
                        className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-gray-600 data-[state=checked]:border-emerald-600 data-[state=unchecked]:border-gray-700"
                    />
                </div>
            </div>
        </>
    );
};

export default ProductoTable; 