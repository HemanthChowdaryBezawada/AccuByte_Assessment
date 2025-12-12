import { UserService } from '../../src/services/UserService';
import prisma from '../../src/utils/prisma';
import bcrypt from 'bcryptjs';

jest.mock('../../src/utils/prisma', () => ({
    user: {
        findUnique: jest.fn(),
        create: jest.fn(),
    },
}));

jest.mock('bcryptjs', () => ({
    hash: jest.fn(),
    compare: jest.fn(),
}));

describe('UserService', () => {
    let userService: UserService;

    beforeEach(() => {
        userService = new UserService();
        jest.clearAllMocks();
    });

    it('should register a new user successfully', async () => {
        (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
        (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');
        (prisma.user.create as jest.Mock).mockResolvedValue({
            id: 1,
            username: 'testuser',
            password: 'hashed_password',
            role: 'user',
        });

        const user = await userService.register('testuser', 'password123');

        expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { username: 'testuser' } });
        expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
        expect(prisma.user.create).toHaveBeenCalled();
        expect(user.username).toBe('testuser');
    });

    it('should throw error if user already exists during registration', async () => {
        (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 1, username: 'testuser' });

        await expect(userService.register('testuser', 'password123'))
            .rejects.toThrow('Username already exists');
    });

    it('should login user successfully with correct credentials', async () => {
        const mockUser = { id: 1, username: 'testuser', password: 'hashed_password', role: 'user' };
        (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);

        const result = await userService.login('testuser', 'password123');
        expect(result).toEqual(mockUser);
    });

    it('should throw error for invalid credentials', async () => {
        (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

        await expect(userService.login('wronguser', 'password'))
            .rejects.toThrow('Invalid credentials');
    });
});
