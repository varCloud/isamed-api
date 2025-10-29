import prisma from "../config/prisma";
import { listResource } from '../utils/list-resource';

export async function getAllOrders(query: any) {
  return listResource(
    'order',
    query,
    [
    'id',
    'customer.name',
    'user.name',
    'equipments.failure',
    'equipments.brand.name',
    'equipments.equipment_cat.name',
    ],
    {
  customer: true,
  user: true,
  equipments: {
    include: {
      brand: true,
      equipment_cat: true,
    },
  },
},
    { created_at: 'desc' },
  );
}

export async function getOrdersByCustomer(query: Record<string, any>) {
  return listResource(
    'order',
    query,
    [
    ],
    {
      customer: true,
      user: true,
      equipments: {
        include: {
          brand: true,
          equipment_cat: true,
        },
      },
    },
    { created_at: 'desc' },
    { customer_id: query.customer_id },
  );
}


export async function getOrderById(orderId: number) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      customer: true,
      user: true,
      repair_report: true,
      equipments: {
        include: { brand: true, equipment_cat: true },
      },
    },
  });

  if (!order) return null;

  const deliveryOrder = await prisma.delivery.findFirst({
    where: {
      deliveriable_type: 'Order',
      deliveriable_id: order.id,
    },
  });

  const deliveryRepair = await prisma.delivery.findFirst({
    where: {
      deliveriable_type: 'Repair_report',
      deliveriable_id: order.id,
    },
  });

  return { ...order, deliveryOrder, deliveryRepair };
}

export async function getDeliveryByOrderId(orderId: number) {
  return prisma.delivery.findFirst({
    where: {
      deliveriable_type: 'Order',
      deliveriable_id: orderId,
    },
  });
}

export async function createOrder(data: any) {
  const { customer_id, user_id, comments, type_income } = data; 
  return prisma.order.create({
    data: {
      comments,
      status: 'pending',
      type_income,
      created_at: new Date(),
 
      customer: {
        connect: { id: customer_id },
      },
      user: {
        connect: { id: user_id },
      },
    },
  });
}

export async function updateOrder(orderId: number, data: any) {
  const order = await getOrderById(orderId);
  if (!order) {
    throw new Error('Order not found');
  }

  if(order.status === 'completed' || order.status === 'cancelled') {
    throw new Error('Cannot update a completed or cancelled order');
  }

  return prisma.order.update({
    where: { id: orderId },
    data: {
      ...data,
      status: 'in_progress',
      updated_at: new Date(),
    },
  });
}

export async function completeOrder(orderId: number) {
  return prisma.order.update({
    where: { id: orderId },
    data: {
      status: 'completed'
    },
  });
}

  export async function cancelOrder(orderId: number) {
  return prisma.order.update({
    where: { id: orderId },
    data: {
      status: 'cancelled'
    },
  });
}

export async function getOrdersByMonth(year: number, month: number) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  return prisma.order.findMany({
    where: {
      created_at: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      customer: true,
      user: true,
      equipments: {
        include: { brand: true, equipment_cat: true },
      },
    },
    orderBy: { created_at: 'desc' },
  });
}



