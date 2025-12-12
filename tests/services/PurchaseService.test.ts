import { PurchaseService } from '../../src/services/PurchaseService';
import prisma from '../../src/utils/prisma';

jest.mock('../../src/utils/prisma', () => ({
    sweet: {
        findUnique: jest.fn(),
        update: jest.fn(),
    },
}));

describe('PurchaseService', () => {
    let purchaseService: PurchaseService;

    beforeEach(() => {
        purchaseService = new PurchaseService();
        jest.clearAllMocks();
    });

    it('should purchase a sweet successfully', async () => {
        const mockSweet = { id: 1, name: 'Lollipop', category: 'Candy', price: 0.5, quantity: 50 };
        (prisma.sweet.findUnique as jest.Mock).mockResolvedValue(mockSweet);
        (prisma.sweet.update as jest.Mock).mockResolvedValue({ ...mockSweet, quantity: 45 });

        await purchaseService.purchase(1, 5);

        expect(prisma.sweet.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
        expect(prisma.sweet.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: { quantity: { decrement: 5 } },
        });
    });

    it('should throw error if sweet not found', async () => {
        (prisma.sweet.findUnique as jest.Mock).mockResolvedValue(null);

        await expect(purchaseService.purchase(999, 1))
            .rejects.toThrow('Sweet not found');
    });

    it('should throw error for invalid quantity', async () => {
        const mockSweet = { id: 1, name: 'Lollipop', quantity: 50 };
        (prisma.sweet.findUnique as jest.Mock).mockResolvedValue(mockSweet);

        await expect(purchaseService.purchase(1, 0))
            .rejects.toThrow('Purchase quantity must be positive');
    });

    it('should throw error for insufficient stock', async () => {
        const mockSweet = { id: 1, name: 'Lollipop', quantity: 10 };
        (prisma.sweet.findUnique as jest.Mock).mockResolvedValue(mockSweet);

        await expect(purchaseService.purchase(1, 20))
            .rejects.toThrow('Insufficient stock for sweet: Lollipop');
    });
});
