import { Router } from 'express';
import authRouter from './auth.routes';
import orderRouter from './order.routes';
import notificationRouter from './notification.routes';
import customerRouter from './customer.routes';
import userRouter from './user.routes';
import brandCatRouter from './brand-cat.routes';
import equipmentCatRouter from './equipment-cat.routes';
import noteRouter from './note.routes';
import repairReportRouter from './repar-report.routes';
import photoRouter from './photo.routes';
import reminderRouter from './reminder.routes';
import quotationRouter from './quotation.routes';
import quotateItemRouter from './quote-item.routes';
import perDiemRouter from './per-diem.routes';
import promissoryNoteRouter from './promissory-note.routes';
import templateRouter from './template.routes';
import formatRouter from './format.routes';
import equipmentRouter from './equipment.routes';
import publicRouter from './public.routes';
const router = Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/customers', customerRouter);
router.use('/brands-cat', brandCatRouter);
router.use('/equipments-cat', equipmentCatRouter);
router.use('/orders', orderRouter);
router.use('/repair-report', repairReportRouter);
router.use('/formats', formatRouter);
router.use('/promissory-notes', promissoryNoteRouter);
router.use('/per-diems', perDiemRouter);
router.use('/templates', templateRouter);
router.use('/notes', noteRouter);
router.use('/photos', photoRouter);
router.use('/equipments', equipmentRouter);
router.use('/reminders', reminderRouter);
router.use('/quotations', quotationRouter);
router.use('/quote-items', quotateItemRouter);
router.use('/notifications', notificationRouter);

// Rutas públicas (sin autenticación) para descargas de PDF mediante QR
router.use('/public', publicRouter);

export default router;
