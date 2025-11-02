export interface Product {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  descripcion: string;
  descripcionLarga: string;
  imagen: string; // ruta o emoji
  imagenURL?: string; // URL de imagen
  imagenes: string[]; // rutas o emojis
  imagenesURL?: string[]; // URLs de imágenes
  especificaciones: {
    label: string;
    valor: string;
  }[];
}

export const productos: Product[] = [
  {
    id: 1,
    nombre: "Tanque de Gas LP 30kg",
    categoria: "Tanques",
    precio: 450,
    descripcion: "Tanque de gas licuado de petróleo de alta calidad, capacidad 30kg. Ideal para uso doméstico.",
    descripcionLarga: "Tanque de gas LP de 30kg fabricado con acero de alta resistencia. Perfecto para uso doméstico en hogares y pequeños negocios. Incluye válvula de seguridad y soportes de instalación.",
    imagen: "🛢️",
    imagenURL: "/assets/tanque-bg.webp",
    imagenes: ["🛢️", "🛢️", "🛢️"],
    imagenesURL: ["/assets/tanque-bg.webp", "/assets/tanque-bg.webp", "/assets/tanque-bg.webp"],
    especificaciones: [
      { label: "Capacidad", valor: "30 kg" },
      { label: "Material", valor: "Acero galvanizado" },
      { label: "Altura", valor: "85 cm" },
      { label: "Garantía", valor: "1 año" },
      { label: "Certificación", valor: "ISO 9001" }
    ]
  },
  {
    id: 2,
    nombre: "Tanque de Gas LP 60kg",
    categoria: "Tanques",
    precio: 800,
    descripcion: "Tanque de gran capacidad 60kg. Perfecto para comercios y industrias pequeñas.",
    descripcionLarga: "Tanque industrial de 60kg ideal para restaurantes, lavanderías y pequeñas industrias. Construcción reforzada para mayor durabilidad y seguridad. Incluye válvula de doble función.",
    imagen: "🛢️",
    imagenURL: "/assets/tanque-bg.webp",
    imagenes: ["🛢️", "🛢️", "🛢️"],
    imagenesURL: ["/assets/tanque-bg.webp", "/assets/tanque-bg.webp", "/assets/tanque-bg.webp"],
    especificaciones: [
      { label: "Capacidad", valor: "60 kg" },
      { label: "Material", valor: "Acero de carbono" },
      { label: "Altura", valor: "110 cm" },
      { label: "Garantía", valor: "2 años" },
      { label: "Certificación", valor: "ISO 9001, NOM-002" }
    ]
  },
  {
    id: 3,
    nombre: "Regulador de Presión",
    categoria: "Reguladores",
    precio: 150,
    descripcion: "Regulador de presión estándar para tanques de gas. Control preciso de flujo.",
    descripcionLarga: "Regulador de presión profesional que mantiene un control constante del flujo de gas. Precisión de ±5%. Compatible con múltiples tipos de conexión.",
    imagen: "⚙️",
    imagenURL: "/assets/tanque-bg.webp",
    imagenes: ["⚙️", "⚙️", "⚙️"],
    imagenesURL: ["/assets/tanque-bg.webp", "/assets/tanque-bg.webp", "/assets/tanque-bg.webp"],
    especificaciones: [
      { label: "Presión Max", valor: "30 PSI" },
      { label: "Presión Min", valor: "5 PSI" },
      { label: "Conexiones", valor: "NPT 1/4 y 3/8" },
      { label: "Material", valor: "Latón y acero" },
      { label: "Certificación", valor: "CE" }
    ]
  },
  {
    id: 4,
    nombre: "Sensor de Gas LP",
    categoria: "Sensores",
    precio: 280,
    descripcion: "Sensor detector de fugas de gas LP. Sistema de alarma integrado para seguridad.",
    descripcionLarga: "Detector de fugas de gas LP con sensor infrarrojo y alarma sonora de 85dB. Incluye display LCD y batería de respaldo. Rango de detección hasta 5 metros.",
    imagen: "🔔",
    imagenURL: "/assets/tanque-bg.webp",
    imagenes: ["🔔", "🔔", "🔔"],
    imagenesURL: ["/assets/tanque-bg.webp", "/assets/tanque-bg.webp", "/assets/tanque-bg.webp"],
    especificaciones: [
      { label: "Rango detección", valor: "5 metros" },
      { label: "Alarma sonora", valor: "85 dB" },
      { label: "Sensor", valor: "Infrarrojo" },
      { label: "Alimentación", valor: "110V + batería" },
      { label: "Garantía", valor: "1 año" }
    ]
  },
  {
    id: 5,
    nombre: "Manguera de Gas (5m)",
    categoria: "Accesorios",
    precio: 95,
    descripcion: "Manguera de gas de 5 metros. Material resistente y certificado para seguridad.",
    descripcionLarga: "Manguera de goma industrial de 5 metros con recubrimiento protector. Resistente a temperaturas entre -20°C y +80°C. Certificada para uso de gas LP.",
    imagen: "🔗",
    imagenURL: "/assets/tanque-bg.webp",
    imagenes: ["🔗", "🔗", "🔗"],
    imagenesURL: ["/assets/tanque-bg.webp", "/assets/tanque-bg.webp", "/assets/tanque-bg.webp"],
    especificaciones: [
      { label: "Longitud", valor: "5 metros" },
      { label: "Diámetro interno", valor: "8 mm" },
      { label: "Presión máxima", valor: "25 PSI" },
      { label: "Material", valor: "Goma reforzada" },
      { label: "Temperatura", valor: "-20°C a +80°C" }
    ]
  },
  {
    id: 6,
    nombre: "Válvula de Seguridad",
    categoria: "Válvulas",
    precio: 120,
    descripcion: "Válvula de seguridad de doble función. Protección contra sobrepresión.",
    descripcionLarga: "Válvula de seguridad de alivio de presión con límite ajustable. Protege contra sobrepresión y fugas. Rosca NPT estándar.",
    imagen: "⚡",
    imagenURL: "/assets/tanque-bg.webp",
    imagenes: ["⚡", "⚡", "⚡"],
    imagenesURL: ["/assets/tanque-bg.webp", "/assets/tanque-bg.webp", "/assets/tanque-bg.webp"],
    especificaciones: [
      { label: "Tipo", valor: "Alivio de presión" },
      { label: "Presión de ajuste", valor: "20-30 PSI" },
      { label: "Conexión", valor: "NPT 1/2" },
      { label: "Material", valor: "Latón" },
      { label: "Certificación", valor: "ASME" }
    ]
  },
  {
    id: 7,
    nombre: "Manómetro Digital",
    categoria: "Medidores",
    precio: 200,
    descripcion: "Medidor de presión digital con pantalla LCD. Lectura rápida y precisa.",
    descripcionLarga: "Manómetro digital de alta precisión con pantalla LCD de 2 pulgadas. Rango de 0-100 PSI con exactitud de ±1%. Escala a colores para fácil lectura.",
    imagen: "📊",
    imagenURL: "/assets/tanque-bg.webp",
    imagenes: ["📊", "📊", "📊"],
    imagenesURL: ["/assets/tanque-bg.webp", "/assets/tanque-bg.webp", "/assets/tanque-bg.webp"],
    especificaciones: [
      { label: "Rango", valor: "0-100 PSI" },
      { label: "Exactitud", valor: "±1%" },
      { label: "Pantalla", valor: "LCD 2 pulgadas" },
      { label: "Conexión", valor: "NPT 1/4" },
      { label: "Alimentación", valor: "1 batería AAA" }
    ]
  },
  {
    id: 8,
    nombre: "Adaptador Universal",
    categoria: "Adaptadores",
    precio: 45,
    descripcion: "Adaptador universal para conexión de mangueras. Compatible con varios diámetros.",
    descripcionLarga: "Kit de 3 adaptadores universales en latón que permiten conectar mangueras de diferentes diámetros. Incluye rosca macho y hembra.",
    imagen: "🔧",
    imagenURL: "/assets/tanque-bg.webp",
    imagenes: ["🔧", "🔧", "🔧"],
    imagenesURL: ["/assets/tanque-bg.webp", "/assets/tanque-bg.webp", "/assets/tanque-bg.webp"],
    especificaciones: [
      { label: "Cantidad", valor: "Kit 3 piezas" },
      { label: "Material", valor: "Latón" },
      { label: "Diámetros", valor: "6mm, 8mm, 10mm" },
      { label: "Rosca", valor: "Macho y hembra" },
      { label: "Conexiones", valor: "NPT 1/4, 3/8, 1/2" }
    ]
  }
];

export function getProductoById(id: number): Product | undefined {
  return productos.find((p) => p.id === id);
}
