/**
 * Utilidad para generar URLs correctas para QR codes y endpoints públicos
 */

/**
 * Construye la URL base del servidor según la configuración del ambiente
 */
export function getServerBaseUrl(): string {
  const appUrl = process.env.APP_URL;
  const port = process.env.PORT || 3000;
  
  // Si APP_URL está definido, usarlo (puede incluir /api o no)
  if (appUrl) {
    return appUrl;
  }
  
  // Fallback para desarrollo local
  const useApiPrefix = process.env.USE_API_PREFIX === 'true' || process.env.DEV_MODE === 'true';
  const baseUrl = `http://localhost:${port}`;
  
  return useApiPrefix ? `${baseUrl}/api` : baseUrl;
}

/**
 * Genera URL pública para descarga de PDF mediante QR
 * Estas URLs no requieren autenticación
 */
export function generatePublicPdfUrl(documentType: string, documentId: number): string {
  const baseUrl = getServerBaseUrl();
  
  // Si baseUrl ya termina con /api, no duplicar
  if (baseUrl.endsWith('/api')) {
    return `${baseUrl}/public/${documentType}/${documentId}/pdf`;
  }
  
  // Si no tiene /api, determinar si necesitamos agregarlo
  const useApiPrefix = process.env.USE_API_PREFIX === 'true' || process.env.DEV_MODE === 'true';
  const apiPath = useApiPrefix ? '/api' : '';
  
  return `${baseUrl}${apiPath}/public/${documentType}/${documentId}/pdf`;
}

/**
 * Genera URL para descarga de PDF con autenticación (para usuarios logueados)
 */
export function generatePrivatePdfUrl(documentType: string, documentId: number): string {
  const baseUrl = getServerBaseUrl();
  
  return `${baseUrl}/${documentType}/${documentId}/download-pdf`;
}

/**
 * Tipos de documentos soportados
 */
export const DOCUMENT_TYPES = {
  QUOTATION: 'quotations',
  ORDER: 'orders', 
  PER_DIEM: 'per-diems',
  REPAIR_REPORT: 'repair-reports',
  PROMISSORY_NOTE: 'promissory-notes'
} as const;

export type DocumentType = typeof DOCUMENT_TYPES[keyof typeof DOCUMENT_TYPES];