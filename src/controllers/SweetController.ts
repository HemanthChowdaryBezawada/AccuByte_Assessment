import { Request, Response } from 'express';
import { InventoryService } from '../services/InventoryService';
import { SearchService } from '../services/SearchService';

const inventoryService = new InventoryService();

export class SweetController {
    static async create(req: Request, res: Response): Promise<void> {
        try {
            const { name, category, price, quantity } = req.body;
            const sweet = await inventoryService.addSweet(name, category, parseFloat(price), parseInt(quantity));
            res.status(201).json(sweet);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async getAll(req: Request, res: Response): Promise<void> {
        try {
            const sweets = await inventoryService.listSweets();
            res.status(200).json(sweets);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async search(req: Request, res: Response): Promise<void> {
        try {
            const { name, category, sort } = req.query;
            let sweets: any[] = [];

            if (name) {
                sweets = await SearchService.searchByName(name as string);
            } else if (category) {
                sweets = await SearchService.searchByCategory(category as string);
            } else {
                sweets = await inventoryService.listSweets();
            }

            if (sort === 'asc' || sort === 'desc') {
                if (sweets.length === 0) {
                    if (!name && !category) {
                        sweets = await SearchService.sortByPrice(sort);
                    } else {
                        sweets.sort((a: any, b: any) => sort === 'asc' ? a.price - b.price : b.price - a.price);
                    }
                } else {
                    sweets.sort((a: any, b: any) => sort === 'asc' ? a.price - b.price : b.price - a.price);
                }
            }

            res.status(200).json(sweets);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async update(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { name, category, price, quantity } = req.body;
            if (!id) throw new Error('ID is required');
            const sweet = await inventoryService.updateSweet(parseInt(id), name, category, parseFloat(price), parseInt(quantity));
            res.status(200).json(sweet);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async delete(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            if (!id) throw new Error('ID is required');
            await inventoryService.removeSweet(parseInt(id));
            res.status(204).send();
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
