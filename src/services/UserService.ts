import prisma from '../utils/prisma';
import bcrypt from 'bcryptjs';

export class UserService {
    async register(username: string, password: string): Promise<any> {
        const existingUser = await prisma.user.findUnique({
            where: { username },
        });

        if (existingUser) {
            throw new Error('Username already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                role: 'user',
            },
        });

        return user;
    }

    async login(username: string, password: string): Promise<any> {
        const user = await prisma.user.findUnique({
            where: { username },
        });

        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            throw new Error('Invalid credentials');
        }

        return user;
    }
}
