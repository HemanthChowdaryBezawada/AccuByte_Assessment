import prisma from '../utils/prisma';
import { Sweet } from '@prisma/client';

export class InventoryService {
    async addSweet(name: string, category: string, price: number, quantity: number): Promise<Sweet> {
        return await prisma.sweet.create({
            data: { name, category, price, quantity },
        });
    }

    async listSweets(): Promise<Sweet[]> {
        return await prisma.sweet.findMany();
    }

    async removeSweet(id: number): Promise<void> {
        await prisma.sweet.delete({
            where: { id },
        });
    }

    async updateSweet(id: number, name: string, category: string, price: number, quantity: number): Promise<Sweet> {
        return await prisma.sweet.update({
            where: { id },
            data: { name, category, price, quantity },
        });
    }

    async restockSweet(id: number, quantity: number): Promise<void> {
        if (quantity <= 0) {
            throw new Error('Restock quantity must be positive');
        }
        await prisma.sweet.update({
            where: { id },
            data: { quantity: { increment: quantity } },
        });
    }
}
