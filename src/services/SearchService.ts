import prisma from '../utils/prisma';
import { Sweet } from '@prisma/client';

export class SearchService {
    static async searchByName(query: string): Promise<Sweet[]> {
        return await prisma.sweet.findMany({
            where: {
                name: {
                    contains: query,
                },
            },
        });
    }

    static async searchByCategory(category: string): Promise<Sweet[]> {
        return await prisma.sweet.findMany({
            where: {
                category: {
                    equals: category,
                },
            },
        });
    }

    static async sortByPrice(order: 'asc' | 'desc'): Promise<Sweet[]> {
        return await prisma.sweet.findMany({
            orderBy: {
                price: order,
            },
        });
    }
}
