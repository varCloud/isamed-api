import QRCode from 'qrcode';
import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';
import { generatePublicPdfUrl, DOCUMENT_TYPES } from './url-builder';

export async function generateOrderQr(orderId: number) {
  const qrPath = path.resolve(`src/media/qrs/orders/${orderId}.png`);
  await fs.mkdir(path.dirname(qrPath), { recursive: true });
  
  // Usar URL pública (sin autenticación) para QR
  const qrUrl = generatePublicPdfUrl(DOCUMENT_TYPES.ORDER, orderId);
  
  await QRCode.toFile(qrPath, qrUrl);
  return qrPath;
}

export async function generateQuotationQr(quoteId: number) {
  const qrPath = path.resolve(`src/media/qrs/quotations/${quoteId}.png`);
  await fs.mkdir(path.dirname(qrPath), { recursive: true });
  
  // Usar URL pública (sin autenticación) para QR
  const qrUrl = generatePublicPdfUrl(DOCUMENT_TYPES.QUOTATION, quoteId);
  
  await QRCode.toFile(qrPath, qrUrl);
  return qrPath;
}
export async function generatePerDiemQr(perDiemId: number) {
  const qrPath = path.resolve(`src/media/qrs/per-diems/${perDiemId}.png`);
  await fs.mkdir(path.dirname(qrPath), { recursive: true });

  // Usar URL pública (sin autenticación) para QR
  const qrUrl = generatePublicPdfUrl(DOCUMENT_TYPES.PER_DIEM, perDiemId);

  const qrBuffer = await QRCode.toBuffer(qrUrl, {
    type: "png",
    margin: 2,
    width: 300
  });

  const label = `V-${perDiemId}`;
  const svgText = Buffer.from(`
    <svg width="300" height="40">
      <text x="50%" y="50%" font-size="20" text-anchor="middle" alignment-baseline="middle" fill="black" font-family="Arial">
        ${label}
      </text>
    </svg>
  `);

  await sharp({
    create: {
      width: 300,
      height: 340, 
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
    .composite([
      { input: qrBuffer, top: 0, left: 0 },
      { input: svgText, top: 300, left: 0 }
    ])
    .png()
    .toFile(qrPath);

  return qrPath;
}

export async function generatePromissoryNoteQr(promissoryNoteId: number) {
  const qrPath = path.resolve(`src/media/qrs/promissory-notes/${promissoryNoteId}.png`);
  await fs.mkdir(path.dirname(qrPath), { recursive: true });
  
  // Usar URL pública (sin autenticación) para QR
  const qrUrl = generatePublicPdfUrl(DOCUMENT_TYPES.PROMISSORY_NOTE, promissoryNoteId);
  
  await QRCode.toFile(qrPath, qrUrl);
  return qrPath;
}

export async function generateRepairReportQr(repairReportId: number) {
  const qrPath = path.resolve(`src/media/qrs/repair-reports/${repairReportId}.png`);
  await fs.mkdir(path.dirname(qrPath), { recursive: true });
  
  // Usar URL pública (sin autenticación) para QR
  const qrUrl = generatePublicPdfUrl(DOCUMENT_TYPES.REPAIR_REPORT, repairReportId);
  
  await QRCode.toFile(qrPath, qrUrl);
  return qrPath;
}
