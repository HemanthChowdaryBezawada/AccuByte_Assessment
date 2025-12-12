import prisma from '../utils/prisma';

export class PurchaseService {
    async purchase(sweetId: number, quantity: number): Promise<void> {
        const sweet = await prisma.sweet.findUnique({
            where: { id: sweetId },
        });

        if (!sweet) {
            throw new Error('Sweet not found');
        }

        if (quantity <= 0) {
            throw new Error('Purchase quantity must be positive');
        }

        if (sweet.quantity < quantity) {
            throw new Error(`Insufficient stock for sweet: ${sweet.name}`);
        }

        await prisma.sweet.update({
            where: { id: sweetId },
            data: { quantity: { decrement: quantity } },
        });
    }
}
