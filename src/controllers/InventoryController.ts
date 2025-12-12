import { Request, Response } from 'express';
import { InventoryService } from '../services/InventoryService';
import { PurchaseService } from '../services/PurchaseService';

const inventoryService = new InventoryService();
const purchaseService = new PurchaseService();

export class InventoryController {
    static async purchase(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { quantity } = req.body;
            if (!id) throw new Error('ID is required');
            await purchaseService.purchase(parseInt(id), parseInt(quantity));
            res.status(200).json({ message: 'Purchase successful' });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async restock(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { quantity } = req.body;
            if (!id) throw new Error('ID is required');
            await inventoryService.restockSweet(parseInt(id), parseInt(quantity));
            res.status(200).json({ message: 'Restock successful' });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
