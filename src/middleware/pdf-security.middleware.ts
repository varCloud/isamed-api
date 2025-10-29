import { Request, Response, NextFunction } from 'express';

/**
 * Middleware para aplicar headers de seguridad a las descargas de PDF
 */
export function applyPdfSecurityHeaders(req: Request, res: Response, next: NextFunction) {
  // Headers de seguridad para PDFs más permisivos
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  
  // CSP más permisivo para PDFs
  res.setHeader("Content-Security-Policy", 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "object-src 'self'; " +
    "img-src 'self' data:; " +
    "font-src 'self' data:;"
  );
  
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  
  next();
}

/**
 * Función helper para configurar headers de descarga de PDF
 */
export function setPdfDownloadHeaders(res: Response, filename: string, inline: boolean = true) {
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `${inline ? 'inline' : 'attachment'}; filename="${filename}"`);
  
  // Aplicar headers de seguridad más permisivos para PDFs
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN"); // Permitir iframe en mismo origen
  
  // CSP más permisivo para que los PDFs funcionen en navegadores
  res.setHeader("Content-Security-Policy", 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "object-src 'self'; " +
    "img-src 'self' data:; " +
    "font-src 'self' data:;"
  );
  
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
}