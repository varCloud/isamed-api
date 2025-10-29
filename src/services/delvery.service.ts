import prisma from "../config/prisma";
import { Delivery } from "@prisma/client";

export async function createDelivery(data: Omit<Delivery, "id">): Promise<Delivery> {
  const { deliveriable_type, deliveriable_id, ...rest } = data;
  return await prisma.delivery.create({
    data: {
      ...rest,
      deliveriable_type,
      deliveriable_id,
    },
  });
}

export async function updateDelivery(
  deliveryId: number,
  data: Partial<Omit<Delivery, "id" | "deliveriable_type" | "deliveriable_id">>
): Promise<Delivery> {
  return await prisma.delivery.update({
    where: { id: deliveryId },
    data: {
      ...data,
    },
  });
}