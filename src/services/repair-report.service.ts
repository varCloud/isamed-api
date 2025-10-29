import prisma from "../config/prisma";
import { Delivery, Repair_report } from "@prisma/client";
import { NotificationService } from "./notification.service";
export const RepairReportService = {
  async createRepairReport(data: Omit<Repair_report, "id">): Promise<Repair_report> {
    const { order_id, ...rest } = data;
    return await prisma.repair_report.create({
      data: {
        ...rest,
        ...(order_id !== null && order_id !== undefined
          ? { order: { connect: { id: order_id } } }
          : {}),
      },
    });
  },

  async getRepairReportById(id: number): Promise<Repair_report | null> {
    return await prisma.repair_report.findUnique({ where: { id } , include: {
      order: {
        include: {
          customer: true,
          user: true,
          equipments: {
            include: {
              brand: true,
              equipment_cat: true,
            },
          },
        },
      },
    }
    });
  },

  async createReportDelivery(data: any){
    const { deliveriable_type, deliveriable_id, ...rest } = data;
    return await prisma.delivery.create({
      data: {
        ...rest,
        deliveriable_type,
        deliveriable_id,
        created_at: new Date(),
      },
    });
  },

  async updateRepairReport(id: number, data: Partial<Omit<Repair_report, "id">>): Promise<Repair_report> {
    const updatedReport = await prisma.repair_report.update({
      where: { id },
      data,
    });

    if (data.solution?.trim() && data.order_id) {
      await this.handleOrderCompletion(data.order_id);
    }

    return updatedReport;
  },

  async handleOrderCompletion(orderId: number): Promise<void> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) return;

    const wasAlreadyCompleted = order.status === 'completed';

    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'completed' },
    });

    if (!wasAlreadyCompleted && order.user_id) {
      await NotificationService.createNotification({
        id: undefined as unknown as number,
        user_id: order.user_id,
        class: 'Order',
        type: "Completed-Order",
        model_id: order.id.toString(),
        message: `Ha finalizado el reporte de reparación con el folio S - ${order.id}`,
        readed: 0,
        created_at: new Date(),
      });
    }
  },

  async getDeliveryByRepairReportId(repairReportId: number): Promise<Delivery | null> {
    return await prisma.delivery.findFirst({
      where: {
        deliveriable_type: 'Repair_report',
        deliveriable_id: repairReportId,
      },
    });
  }

  

};