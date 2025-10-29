import { Request, Response } from "express";
import { createCustomer, getAllCustomers, getCustomerById, updateCustomer, deleteCustomer, getCostumerToSelect } from "../services/customer.service";
import { Customer } from "@prisma/client";
import { AuthenticatedRequest } from "../types/express";

/**
 * Controlador para manejar las operaciones relacionadas con los clientes.
 * Permite listar, mostrar, crear, actualizar y eliminar clientes.
 * Los servicios de cliente se obtienen del servicio `customer.service`.
 */

export const CustomerController = {
  async index(req: AuthenticatedRequest, res: Response) {
    const result = await getAllCustomers(req.query);

     res.json(result);
  },

  async select(req: AuthenticatedRequest, res: Response) {
    const customers = await getCostumerToSelect();
    res.json(customers);
  },

  async show(req: AuthenticatedRequest, res: Response) {
    const customer = await getCustomerById(+req.params.id);
    if (!customer) {
      res.status(404).json({ error: "Cliente no encontrado" });
      return;
    }
    res.json(customer);
  },

  async create(req: AuthenticatedRequest, res: Response) {
    const data: Customer = req.body;
    await createCustomer(data);
    res.status(201).json({ message: 'Cliente creado exitosamente' });
  },

  async update(req: AuthenticatedRequest, res: Response) {
    const customerId = +req.params.id;
    const data: Customer = req.body;
    await updateCustomer(customerId, data);
    res.json({ message: 'Cliente actualizado exitosamente' });
  },

  async delete(req: AuthenticatedRequest, res: Response) {
    const customerId = +req.params.id;
    await deleteCustomer(customerId);
     res.status(204).send();
  },
};