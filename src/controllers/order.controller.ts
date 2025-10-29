import { Response } from 'express';
import { getAllOrders, getOrdersByCustomer, getOrderById, getOrdersByMonth, getDeliveryByOrderId, createOrder, completeOrder, updateOrder, cancelOrder } from '../services/order.service';
import { generatePdfFromHtml } from '../utils/pdf';
import { generateOrderQr } from '../utils/qr';
import { generateOrderPrintableHtml } from '../templates/order.printable';
import { EquipmentService } from '../services/equimpent.service';
import { RepairReportService } from '../services/repair-report.service';
import { AuthenticatedRequest } from '../types/express';
import path from 'path';
import fs from 'fs';
import { createDelivery } from '../services/delvery.service';
import { NotificationService } from '../services/notification.service';
import { generateMonthlyServicesPrintable } from '../templates/monthly-services.printable';

const app_url = process.env.APP_URL || 'http://localhost:3000';

/**
 * Controlador para manejar las órdenes de servicio.
 * Permite listar, mostrar y descargar órdenes en formato PDF.
 * Los servicios de órdenes se obtienen del servicio `order.service`.
 * Las plantillas de PDF se generan utilizando `pdf` y `qr` utilidades.
 */


export const OrderController = {
  async index(req: AuthenticatedRequest, res: Response) {
    const result = await getAllOrders(req.query);
     res.json(result);
  },

async getByCustomerId(req: AuthenticatedRequest, res: Response) {
  const customerId = parseInt(req.query.customer_id as string);

  if (!customerId) {
     res.status(400).json({ message: "customer_id es requerido" });
    return;
  }

  const query = {
    ...req.query,
    customer_id: customerId,
  };

  const orders = await getOrdersByCustomer(query);
  res.json(orders);
},

  async create(req: AuthenticatedRequest, res: Response) {
    const data = req.body;
    const order = await createOrder(data);
    if (!order) {
      res.status(500).json({ error: 'Error al crear la orden' });
      return;
    }
    for (const equipment of data.equipments || []) {
      await EquipmentService.createEquipment({
        ...equipment,
        order_id: order.id,
      });
    }

    if(data.type_income === 'delivery'){
      await createDelivery({
        deliveriable_type: 'Order',
        deliveriable_id: order.id,
        delivery_parcel: data.delivery.delivery_parcel,
        code: data.delivery.code,
        created_at: new Date(),
      });
    }

    await RepairReportService.createRepairReport({
      order_id: order.id,
      comments: null,
      diagnosis: null,
      solution: null,
      observations: null,
      updated_at: null,
    });

    await NotificationService.createNotification({
      id: undefined as unknown as number, 
      user_id: order.user_id !== null ? order.user_id : 0,
      class: 'Order',
      type: "New-Order",
      model_id: order.id.toString(),
      message: `Se ha creado una nueva orden de servicio con el folio ${order.id}`,
      readed: 0,
      created_at: new Date(),
    });

    res.status(201).json(order);


  },

async show(req: AuthenticatedRequest, res: Response): Promise<void> {
  const orderId = Number(req.params.id);

  if (!orderId || isNaN(orderId)) {
    res.status(400).json({ error: 'ID inválido' });
    return;
  }

  const order = await getOrderById(orderId);
  if (!order) {
    res.status(404).json({ error: 'Orden no encontrada' });
    return;
  }

  res.json(order);
},
  async update(req: AuthenticatedRequest, res: Response): Promise<void> {
    const orderId = +req.params.id;
    const updatedOrder = await updateOrder(orderId, req.body);
    res.status(200).json(updatedOrder);
  },

  async cancelOrder(req: AuthenticatedRequest, res: Response): Promise<void> {
    const orderId = +req.params.id;
    await cancelOrder(orderId);
    res.status(200).json({ message: 'Orden cancelada exitosamente' });
  },

  async downloadPdf(req: AuthenticatedRequest, res: Response): Promise<void> {
    const orderId = +req.params.id;
    const order = await getOrderById(orderId);
    if (!order) {
      res.status(404).send('Orden no encontrada');
      return;
    }
    const delivery = await getDeliveryByOrderId(orderId);
    const qrPath = await generateOrderQr(orderId);
    const css = fs.readFileSync(path.resolve(__dirname, '../assets/style.css'), 'utf-8');
    const imgPath = path.resolve(__dirname, '../assets/membrete.jpg');
    const imgBase64 = fs.readFileSync(imgPath).toString('base64');
    const imgDataUri = `data:image/jpeg;base64,${imgBase64}`;
    const qrBase64 = fs.readFileSync(qrPath).toString('base64');
    const qrDataUri = `data:image/png;base64,${qrBase64}`;
    const html = generateOrderPrintableHtml(order, qrDataUri, imgDataUri, delivery, css);
    const pdfBuffer = await generatePdfFromHtml(html);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="Orden-Servicio_S-${orderId}.pdf"`,
    });

    res.send(pdfBuffer);
  },

  async generatePdf(req: AuthenticatedRequest, res: Response): Promise<void> {
        const orderId = +req.params.id;
    const order = await getOrderById(orderId);
    if (!order) {
      res.status(404).send('Orden no encontrada');
      return;
    }
    const delivery = await getDeliveryByOrderId(orderId);
    const qrPath = await generateOrderQr(orderId);
    const css = fs.readFileSync(path.resolve(__dirname, '../assets/style.css'), 'utf-8');
    const imgPath = path.resolve(__dirname, '../assets/membrete.jpg');
    const imgBase64 = fs.readFileSync(imgPath).toString('base64');
    const imgDataUri = `data:image/jpeg;base64,${imgBase64}`;
    const qrBase64 = fs.readFileSync(qrPath).toString('base64');
    const qrDataUri = `data:image/png;base64,${qrBase64}`;
    const html = generateOrderPrintableHtml(order, qrDataUri, imgDataUri, delivery, css);
    const pdfBuffer = await generatePdfFromHtml(html);
res.setHeader("Content-Type", "application/pdf");
res.setHeader(
  "Content-Disposition",
  `inline; filename="Orden-Servicio_S-${orderId}.pdf"`
);
res.end(pdfBuffer);
  },

  async downloadQr(req: AuthenticatedRequest, res: Response): Promise<void> {
    const orderId = +req.params.id;
    const qrPath = await generateOrderQr(orderId);
    res.download(qrPath, `Orden-Servicio_S-${orderId}_QR.png`);
  },

  async completeOrder(req: AuthenticatedRequest, res: Response): Promise<void> {
    const orderId = +req.params.id;
    const order = await getOrderById(orderId);
    if (!order) {
      res.status(404).json({ error: 'Orden no encontrada' });
      return;
    }
    if (order.status === 'completed') {
      res.status(400).json({ error: 'La orden ya está completada' });
      return;
    }

    await completeOrder(orderId);
    res.status(200).json({ message: 'Orden completada exitosamente' });
  },

  async downloadMonthlyReport(req: AuthenticatedRequest, res: Response): Promise<void> {
    const month = req.query.month ? parseInt(req.query.month as string) : new Date().getMonth() + 1;
    const orders = await getOrdersByMonth(new Date().getFullYear(), month);
    if (!orders || orders.length === 0) {
      res.status(404).send('No se encontraron órdenes para el mes especificado');
      return;
    }

    const monthText = new Date(new Date().setMonth(month - 1)).toLocaleString('es-MX', { month: 'long' });
    const html = generateMonthlyServicesPrintable(orders, monthText);
    const pdfBuffer = await generatePdfFromHtml(html);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="Reporte_Mensual_S-${monthText}.pdf"`,
    });

    res.send(pdfBuffer);
  }
  

};