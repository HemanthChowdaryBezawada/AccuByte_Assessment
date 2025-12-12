import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

interface Sweet {
    id: number;
    name: string;
    category: string;
    price: number;
    quantity: number;
}

export const Dashboard: React.FC = () => {
    const [sweets, setSweets] = useState<Sweet[]>([]);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('');
    const [purchaseId, setPurchaseId] = useState<number | null>(null);
    const [quantity, setQuantity] = useState(1);
    const navigate = useNavigate();

    const fetchSweets = async () => {
        try {
            const params: any = {};
            if (search) params.name = search;
            if (sort) params.sort = sort;

            const url = search || sort ? '/sweets/search' : '/sweets';
            const response = await axios.get(url, { params });
            setSweets(response.data);
        } catch (error) {
            console.error('Failed to fetch sweets', error);
        }
    };

    useEffect(() => {
        fetchSweets();
    }, [search, sort]);

    const handlePurchase = async () => {
        if (!purchaseId) return;
        try {
            await axios.post(`/sweets/${purchaseId}/purchase`, { quantity });
            alert('Purchase successful!');
            setPurchaseId(null);
            fetchSweets();
        } catch (error: any) {
            alert('Purchase failed: ' + (error.response?.data?.error || error.message));
        }
    };

    return (
        <div className="dashboard-container">
            <h1>Sweet Shop Dashboard</h1>
            <div className="controls">
                <input
                    type="text"
                    placeholder="Search sweets..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <select onChange={e => setSort(e.target.value)} value={sort}>
                    <option value="">Sort by</option>
                    <option value="asc">Price: Low to High</option>
                    <option value="desc">Price: High to Low</option>
                </select>
                <button onClick={() => navigate('/admin')}>Admin Panel</button>
            </div>

            <div className="sweets-grid">
                {sweets.map(sweet => (
                    <div key={sweet.id} className="sweet-card">
                        <h3>{sweet.name}</h3>
                        <p>Category: {sweet.category}</p>
                        <p>Price: ₹{sweet.price}</p>
                        <p>Stock: {sweet.quantity}</p>
                        <button
                            disabled={sweet.quantity === 0}
                            onClick={() => { setPurchaseId(sweet.id); setQuantity(1); }}
                        >
                            {sweet.quantity === 0 ? 'Out of Stock' : 'Purchase'}
                        </button>
                    </div>
                ))}
            </div>

            {purchaseId && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Confirm Purchase</h3>
                        <p>Quantity:</p>
                        <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={e => setQuantity(parseInt(e.target.value))}
                        />
                        <button onClick={handlePurchase}>Confirm</button>
                        <button onClick={() => setPurchaseId(null)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};
