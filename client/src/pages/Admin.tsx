import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

interface Sweet {
    id: number;
    name: string;
    category: string;
    price: number;
    quantity: number;
}

export const Admin: React.FC = () => {
    const [sweets, setSweets] = useState<Sweet[]>([]);
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);

    const fetchSweets = async () => {
        try {
            const response = await axios.get('/sweets');
            setSweets(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchSweets();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const sweetData = { name, category, price: parseFloat(price), quantity: parseInt(quantity) };
            if (editingId) {
                await axios.put(`/sweets/${editingId}`, sweetData);
                alert('Updated successfully');
                setEditingId(null);
            } else {
                await axios.post('/sweets', sweetData);
                alert('Added successfully');
            }
            setName(''); setCategory(''); setPrice(''); setQuantity('');
            fetchSweets();
        } catch (error: any) {
            alert('Operation failed: ' + error.message);
        }
    };

    const handleEdit = (sweet: Sweet) => {
        setEditingId(sweet.id);
        setName(sweet.name);
        setCategory(sweet.category);
        setPrice(sweet.price.toString());
        setQuantity(sweet.quantity.toString());
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure?')) return;
        try {
            await axios.delete(`/sweets/${id}`);
            fetchSweets();
        } catch (error: any) {
            alert('Delete failed');
        }
    };

    return (
        <div className="admin-container">
            <h1>Admin Panel</h1>
            <div className="admin-form">
                <h3>{editingId ? 'Edit Sweet' : 'Add New Sweet'}</h3>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
                    <input type="text" placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} required />
                    <input type="number" placeholder="Price" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required />
                    <input type="number" placeholder="Quantity" value={quantity} onChange={e => setQuantity(e.target.value)} required />
                    <button type="submit">{editingId ? 'Update' : 'Add'}</button>
                    {editingId && <button type="button" onClick={() => { setEditingId(null); setName(''); setCategory(''); setPrice(''); setQuantity(''); }}>Cancel</button>}
                </form>
            </div>

            <div className="sweets-list">
                <h3>Current Inventory</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sweets.map(sweet => (
                            <tr key={sweet.id}>
                                <td>{sweet.name}</td>
                                <td>{sweet.category}</td>
                                <td>₹{sweet.price}</td>
                                <td>{sweet.quantity}</td>
                                <td>
                                    <button onClick={() => handleEdit(sweet)}>Edit</button>
                                    <button onClick={() => handleDelete(sweet.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
