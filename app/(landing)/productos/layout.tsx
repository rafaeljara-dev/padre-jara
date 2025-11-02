import { OrdenProvider } from './context';

export default function ProductosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <OrdenProvider>{children}</OrdenProvider>;
}
