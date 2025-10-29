import prisma from "../config/prisma";
import { listResource } from '../utils/list-resource';

export async function getAllCustomers(query: any) {
  return listResource(
    'customer',
    query,
    ['id', 'name', 'email', 'rfc', 'contact'],
    {},
    { created_at: 'desc' },
    { status: 'active' } 
  );
}
export async function getCostumerToSelect(){
  const customers = await prisma.customer.findMany({
    where: { status: 'active' },
    select: {
      id: true,
      name: true,
    },
  }); 
  return customers;
}

export async function getCustomerById(customerId: number) {
  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    include: {
      orders: true,
      per_diems: true,
       quotes: true,
    },
  });

  if (!customer) return null;

  return customer;
}

export async function createCustomer(data: any) {
  return prisma.customer.create({
    data: {
      ...data,
      status: 'active',
      created_at: new Date(),
    },
  });
}

export async function updateCustomer(customerId: number, data: any) {
  return prisma.customer.update({
    where: { id: customerId },
    data: {
      ...data,
      updated_at: new Date(),
    },
  });
}

export async function deleteCustomer(customerId: number) {
  return prisma.customer.delete({
    where: { id: customerId },
  });
}