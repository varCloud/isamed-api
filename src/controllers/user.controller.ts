import { Response } from "express";
import { UserService } from "../services/user.service";
import { AuthenticatedRequest } from "../types/express";
import { User } from "@prisma/client";

/**
 * Controlador para manejar las operaciones relacionadas con los usuarios.
 * Permite listar, mostrar, crear, actualizar y eliminar usuarios.
 * Los servicios de usuario se obtienen del servicio `user.service`.
 */

export const UserController = {
  async index(req: AuthenticatedRequest, res: Response) {
    const result = await UserService.getAllUsers(req.query);
    res.json(result);
  },

  async select(req: AuthenticatedRequest, res: Response) {
    const users = await UserService.getUserToSelect();
    res.json(users);
  },

  async show(req: AuthenticatedRequest, res: Response) {
    const user = await UserService.getUserById(+req.params.id);
    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }
    res.json(user);
  },

  async create(req: AuthenticatedRequest, res: Response) {
    const data: Omit<User, "id"> = req.body;
    const newUser = await UserService.createUser(data);
    res.status(201).json(newUser);
  },

  async update(req: AuthenticatedRequest, res: Response) {
    const userId = +req.params.id;
    const data: Partial<Omit<User, "id">> = req.body;
    const updatedUser = await UserService.updateUser(userId, data);
    res.json(updatedUser);
  },

  async changePassword(req: AuthenticatedRequest, res: Response) {
    const userId = +req.params.id;
    if (userId !== req.user?.id && req.user?.role !== 'admin') {
      res.status(403).json({ error: "No tienes permiso para cambiar la contraseña de este usuario" });
      return;
    }
    const { current, newPassword } = req.body;
    const result = await UserService.changePassword(userId, current, newPassword);
    res.json('Contraseña actualizada correctamente');
  },

  async delete(req: AuthenticatedRequest, res: Response) {
    const userId = +req.params.id;
    await UserService.deleteUser(userId);
    res.status(200).json({ message: "Usuario eliminado correctamente" });
  },
};