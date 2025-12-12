import { Router } from 'express';
import { SweetController } from '../controllers/SweetController';
import { InventoryController } from '../controllers/InventoryController';

const router = Router();

router.get('/', SweetController.getAll);
router.get('/search', SweetController.search);
router.post('/', SweetController.create);
router.put('/:id', SweetController.update);
router.delete('/:id', SweetController.delete);

router.post('/:id/purchase', InventoryController.purchase);
router.post('/:id/restock', InventoryController.restock);

export default router;
