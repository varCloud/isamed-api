import prisma from "../config/prisma";
import { listResource } from '../utils/list-resource';
import { User } from "@prisma/client";
import bcrypt from 'bcrypt';
export const UserService = {
  async getAllUsers(query: any) {
   return listResource(
  'user',
  query,
  ['name', 'email', 'role'],
  {},
  { created_at: 'desc' },
  {
    id: {
      not: 1,
    },
    deleted_at: null,
  }
);

  },
  async getUserToSelect() {
        return await prisma.user.findMany({
            where: { status: 'active', NOT: { role: 'agent' } },
            select: {
            id: true,
            name: true,
            },
        });
  },
    async getUserById(userId: number): Promise<User | null> {
        return await prisma.user.findUnique({
        where: { id: userId },
        include: {
            orders: true,
            quotes: true,
            per_diems: true,
        },
        });
    },
    async createUser(data: Omit<User, "id">): Promise<User> {
        if (data.password) {
            data.password = bcrypt.hashSync(data.password, 12);
        }
        return await prisma.user.create({
            data: {
                ...data,
                status: 'active',
                created_at: new Date(),
            },
        });
    },
    async updateUser(userId: number, data: Partial<Omit<User, "id">>): Promise<User> {
        return await prisma.user.update({
            where: { id: userId },
            data: {
                ...data,
         
            },
        });
    },
    async deleteUser(userId: number): Promise<User> {
        return await prisma.user.update({
            where: { id: userId },
            data: {
                deleted_at: new Date(),
            },
        });
    },

    async changePassword(userId: number, currentPassword: string, newPassword: string): Promise<string> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("Usuario no encontrado");
    if (!user.password) throw new Error("Usuario no tiene contraseña configurada");

    const isMatch = bcrypt.compareSync(currentPassword, user.password);
    if (!isMatch) throw new Error("La contraseña actual es incorrecta");

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
    });
    return "Contraseña actualizada correctamente";
}
};