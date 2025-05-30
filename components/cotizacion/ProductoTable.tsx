import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash, Pencil, AlertTriangle } from "lucide-react";
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

    return (
        <>
            <div className="rounded-lg border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-200 dark:bg-gray-800">
                            <TableHead className="w-6"></TableHead>
                            <TableHead>Producto</TableHead>
                            <TableHead>Cantidad</TableHead>
                            <TableHead>Precio unitario</TableHead>
                            <TableHead>Subtotal</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="overflow-auto max-h-[400px]">
                        {cotizacion.productos.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-muted-foreground">
                                    No hay productos agregados a la cotización
                                </TableCell>
                            </TableRow>
                        ) : (
                            cotizacion.productos.map((producto, index) => (
                                <TableRow key={producto.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                    <TableCell className="px-2 w-6">
                                        <div className="h-1.5 w-1.5 rounded-full bg-primary/40"></div>
                                    </TableCell>
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
                    </TableBody>
                </Table>

                {/* Resumen financiero como continuación visual de la tabla */}
                {cotizacion.productos.length > 0 && (
                    <div className="border-t border-border bg-white">
                        {/* Vista móvil (centrada) */}
                        <div className="grid grid-cols-1 sm:hidden gap-1 p-2 text-center">
                            <div>
                                <span className="text-md text-gray-600 mr-2 font-bold">Subtotal:</span>
                                <span className="font-medium text-sm">

                                    ${calcularSubtotal(cotizacion.productos).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            </div>
                            <div>
                                <span className="text-md text-gray-600 mr-2 font-bold">IVA (8%):</span>
                                <span className="font-medium text-sm">
                                    {cotizacion.aplicarIva
                                        ? `$${calcularIva(cotizacion.productos).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                        : "$0.00"}
                                </span>
                            </div>
                            <div className="border-t border-border mt-1 pt-1">
                                <span className="text-lg mr-2 font-bold">Total:</span>
                                <span className="font-bold text-md">
                                    ${calcularTotal(cotizacion.productos, cotizacion.aplicarIva).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>

                        {/* Vista desktop (alineada con los precios) */}
                        <div className="hidden sm:block">
                            <table className="w-full">
                                <tbody>
                                    <tr className="">
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td className="text-right pr-4 text-md text-gray-600 font-bold w-[180px]">Subtotal:</td>
                                        <td className="py-1 text-md w-[120px]">
                                            ${calcularSubtotal(cotizacion.productos).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </td>
                                        <td className="w-[100px]"></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td className="text-right pr-4 text-md text-gray-600 font-bold w-[180px]">IVA (8%):</td>
                                        <td className="py-1 text-md w-[120px]">
                                            {cotizacion.aplicarIva
                                                ? `$${calcularIva(cotizacion.productos).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                                : "$0.00"}
                                        </td>
                                        <td className="w-[100px]"></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td className="text-right pr-5 text-lg font-bold w-[180px]">Total:</td>
                                        <td className="py-2 font-bold w-[120px]">
                                            ${calcularTotal(cotizacion.productos, cotizacion.aplicarIva).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </td>
                                        <td className="w-[100px]"></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

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