import { Sweet } from '../../src/models/Sweet';

describe('Sweet Entity', () => {
    it('should create a Sweet instance with correct properties', () => {
        const id = 1;
        const name = 'Chocolate Bar';
        const category = 'Chocolate';
        const price = 2.5;
        const quantity = 100;

        const sweet = new Sweet(id, name, category, price, quantity);

        expect(sweet.id).toBe(id);
        expect(sweet.name).toBe(name);
        expect(sweet.category).toBe(category);
        expect(sweet.price).toBe(price);
        expect(sweet.quantity).toBe(quantity);
    });
});
