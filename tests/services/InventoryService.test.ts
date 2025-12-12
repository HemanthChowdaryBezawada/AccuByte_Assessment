import { InventoryService } from '../../src/services/InventoryService';
import prisma from '../../src/utils/prisma';

jest.mock('../../src/utils/prisma', () => ({
    sweet: {
        create: jest.fn(),
        findMany: jest.fn(),
        delete: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
    },
}));

describe('InventoryService', () => {
    let inventoryService: InventoryService;

    beforeEach(() => {
        inventoryService = new InventoryService();
        jest.clearAllMocks();
    });

    it('should add a sweet to the inventory', async () => {
        const mockSweet = { id: 1, name: 'Lollipop', category: 'Candy', price: 0.5, quantity: 50 };
        (prisma.sweet.create as jest.Mock).mockResolvedValue(mockSweet);

        const result = await inventoryService.addSweet('Lollipop', 'Candy', 0.5, 50);

        expect(prisma.sweet.create).toHaveBeenCalledWith({
            data: { name: 'Lollipop', category: 'Candy', price: 0.5, quantity: 50 },
        });
        expect(result).toEqual(mockSweet);
    });

    it('should list all sweets', async () => {
        const mockSweets = [{ id: 1, name: 'Lollipop', category: 'Candy', price: 0.5, quantity: 50 }];
        (prisma.sweet.findMany as jest.Mock).mockResolvedValue(mockSweets);

        const result = await inventoryService.listSweets();
        expect(result).toEqual(mockSweets);
    });

    it('should remove a sweet from the inventory', async () => {
        (prisma.sweet.delete as jest.Mock).mockResolvedValue({ id: 1 } as any);

        await inventoryService.removeSweet(1);

        expect(prisma.sweet.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should restock an existing sweet', async () => {
        (prisma.sweet.update as jest.Mock).mockResolvedValue({ id: 1, quantity: 70 } as any);

        await inventoryService.restockSweet(1, 20);

        expect(prisma.sweet.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: { quantity: { increment: 20 } },
        });
    });

    it('should throw error when restocking with invalid quantity', async () => {
        await expect(inventoryService.restockSweet(1, 0))
            .rejects.toThrow('Restock quantity must be positive');
    });
});
