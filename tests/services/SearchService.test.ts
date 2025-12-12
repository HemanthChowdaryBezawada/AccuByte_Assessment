import { SearchService } from '../../src/services/SearchService';
import prisma from '../../src/utils/prisma';

jest.mock('../../src/utils/prisma', () => ({
    sweet: {
        findMany: jest.fn(),
    },
}));

describe('SearchService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should search sweets by name', async () => {
        const mockSweets = [{ id: 1, name: 'Lollipop', category: 'Candy', price: 0.5, quantity: 50 }];
        (prisma.sweet.findMany as jest.Mock).mockResolvedValue(mockSweets);

        const result = await SearchService.searchByName('Lollipop');

        expect(prisma.sweet.findMany).toHaveBeenCalledWith({
            where: { name: { contains: 'Lollipop' } },
        });
        expect(result).toEqual(mockSweets);
    });

    it('should search sweets by category', async () => {
        const mockSweets = [{ id: 1, name: 'Lollipop', category: 'Candy', price: 0.5, quantity: 50 }];
        (prisma.sweet.findMany as jest.Mock).mockResolvedValue(mockSweets);

        const result = await SearchService.searchByCategory('Candy');

        expect(prisma.sweet.findMany).toHaveBeenCalledWith({
            where: { category: { equals: 'Candy' } },
        });
        expect(result).toEqual(mockSweets);
    });

    it('should sort sweets by price ascending', async () => {
        const mockSweets = [{ id: 1, name: 'Lollipop', category: 'Candy', price: 0.5, quantity: 50 }];
        (prisma.sweet.findMany as jest.Mock).mockResolvedValue(mockSweets);

        await SearchService.sortByPrice('asc');

        expect(prisma.sweet.findMany).toHaveBeenCalledWith({
            orderBy: { price: 'asc' },
        });
    });
});
