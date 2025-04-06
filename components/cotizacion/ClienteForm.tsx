import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatosCotizacion } from "@/components/cotizacion-pdf";

interface ClienteFormProps {
  cotizacion: DatosCotizacion;
  onClienteChange: (field: string, value: string) => void;
}

export const ClienteForm = ({ cotizacion, onClienteChange }: ClienteFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Datos del cliente</CardTitle>
        <CardDescription>
          Información del cliente para la cotización
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="cliente">Nombre del cliente (opcional)</Label>
          <Input
            id="cliente"
            placeholder="Nombre del cliente"
            value={cotizacion.cliente}
            onChange={(e) => onClienteChange('cliente', e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="empresa">Empresa (opcional)</Label>
          <Input
            id="empresa"
            placeholder="Nombre de la empresa"
            value={cotizacion.empresa}
            onChange={(e) => onClienteChange('empresa', e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ClienteForm; 