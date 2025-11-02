'use client';

import React, { createContext, useContext, useState } from 'react';

export interface ProductoEnOrden {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen: string;
}

interface OrdenContextType {
  items: ProductoEnOrden[];
  agregarProducto: (producto: ProductoEnOrden) => void;
  eliminarProducto: (id: number) => void;
  actualizarCantidad: (id: number, cantidad: number) => void;
  limpiarOrden: () => void;
  total: number;
}

const OrdenContext = createContext<OrdenContextType | undefined>(undefined);

export function OrdenProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ProductoEnOrden[]>([]);

  const agregarProducto = (producto: ProductoEnOrden) => {
    setItems((prevItems) => {
      const existente = prevItems.find((item) => item.id === producto.id);

      if (existente) {
        return prevItems.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + producto.cantidad }
            : item
        );
      }

      return [...prevItems, producto];
    });
  };

  const eliminarProducto = (id: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const actualizarCantidad = (id: number, cantidad: number) => {
    if (cantidad <= 0) {
      eliminarProducto(id);
    } else {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? { ...item, cantidad } : item
        )
      );
    }
  };

  const limpiarOrden = () => {
    setItems([]);
  };

  const total = items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  return (
    <OrdenContext.Provider
      value={{
        items,
        agregarProducto,
        eliminarProducto,
        actualizarCantidad,
        limpiarOrden,
        total,
      }}
    >
      {children}
    </OrdenContext.Provider>
  );
}

export function useOrden() {
  const context = useContext(OrdenContext);
  if (context === undefined) {
    throw new Error('useOrden debe ser usado dentro de OrdenProvider');
  }
  return context;
}
