import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import jwt from 'jsonwebtoken';

const userService = new UserService();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export class AuthController {
    static async register(req: Request, res: Response): Promise<void> {
        try {
            const { username, password } = req.body;
            const user = await userService.register(username, password);
            res.status(201).json({ message: 'User registered successfully', userId: user.id });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async login(req: Request, res: Response): Promise<void> {
        try {
            const { username, password } = req.body;
            const user = await userService.login(username, password);

            const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

            res.status(200).json({ token });
        } catch (error: any) {
            res.status(401).json({ error: error.message });
        }
    }
}
