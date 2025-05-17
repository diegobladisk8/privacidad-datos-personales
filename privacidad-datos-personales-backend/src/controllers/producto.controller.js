// src/controllers/producto.controller.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Obtener todos los productos
export const getProductos = async (req, res) => {
    try {
        const productos = await prisma.producto.findMany();

        const productosConvertidos = productos.map((p) => ({
            ...p,
            id_producto: p.id_producto.toString(),
        }));

        res.json(productosConvertidos);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
};

// Crear un nuevo producto
export const createProducto = async (req, res) => {
    try {
        const { descripcion } = req.body;

        const nuevoProducto = await prisma.producto.create({
            data: { descripcion },
        });

        res.status(201).json({
            ...nuevoProducto,
            id_producto: nuevoProducto.id_producto.toString(),
        });
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({ error: 'Error al crear producto' });
    }
};

// Actualizar un producto
export const updateProducto = async (req, res) => {
    const { id } = req.params;
    const { descripcion } = req.body;

    try {
        const productoActualizado = await prisma.producto.update({
            where: {
                id_producto: BigInt(id),
            },
            data: { descripcion },
        });

        res.json({
            ...productoActualizado,
            id_producto: productoActualizado.id_producto.toString(),
        });
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ error: 'Error al actualizar producto' });
    }
};

// Eliminar un producto
export const deleteProducto = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.producto.delete({
            where: {
                id_producto: BigInt(id),
            },
        });

        res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ error: 'Error al eliminar producto' });
    }
};
