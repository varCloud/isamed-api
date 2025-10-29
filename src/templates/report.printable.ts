export function generateRepairReportPrintableHtml(report: any, qrPath: string, membrete: string, delivery: any, css: string): string {
  return `
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
   <style>
        ${css}
    </style>
    
</head>
<body class="invoice">

<div id="watermark">
    <img src="${membrete}" height="97%" width="100%" />
</div>

<table class="order-data-addresses">
    <tr>
        <td class="order-data">
            <table class="cuadro">
                <tr><th class="mayus line">Cliente:</th><td class="datos mayus line2">${report.order.customer.name}</td></tr>
                <tr><th class="mayus line">RFC:</th><td class="datos mayus line2">${report.order.customer.rfc}</td></tr>
                <tr><th class="mayus line">Teléfono:</th><td class="datos mayus line2">${report.order.customer.contact}</td></tr>
                <tr><th class="mayus line">Ubicación:</th><td class="datos mayus line2">${report.order.customer.address}</td></tr>
            </table>
        </td>
        <td class="order-data">
            <table class="cuadro">
                <tr><th class="mayus line">Realizó:</th><td class="datos mayus line2">${report.order.user.name}</td></tr>
                <tr><th class="mayus line">Fecha:</th><td class="datos mayus line2">${new Date(report.created_at).toLocaleString('es-MX')}</td></tr>
                <tr><th class="mayus line">Folio:</th><td class="datos mayus line2">R-${report.id}</td></tr>
                ${delivery ? `
                <tr><th class="mayus line">Paquetería:</th><td class="datos mayus line2">${delivery.delivery_parcel}</td></tr>
                <tr><th class="mayus line">Rastreo:</th><td class="datos mayus line2">${delivery.code}</td></tr>
                ` : ''}
            </table>
        </td>
        <td class="order-data order-qr">
            <img src="${qrPath}" width="110" />
        </td>
    </tr>
</table>

<hr>

<h1 class="document-type-label" style="text-align: center;">REPORTE DE REPARACIÓN</h1>
<table class="equipment-details">
  <thead>
    <tr>
      <th>MARCA</th>
      <th>MODELO</th>
      <th>SERIE</th>
      <th>FALLA REPORTADA</th>
    </tr>
  </thead>
  <tbody>
    ${report.order.equipments.map((equipment: any) => `
      <tr>
        <td>${equipment.brand.name}</td>
        <td>${equipment.model}</td>
        <td>${equipment.serial_number}</td>
        <td>${(equipment.failure ?? '').replace(/\n/g, '<br>')}</td>
      </tr>
    `).join('')}
  </tbody>
</table>
<table class="order-details">
    <tfoot>
        <tr class="no-borders">
            <td class="mayus no-borders">
                  <div class="">
                    <b>DIAGNÓSTICO/REVISIÓN:</b><br>
                <div class="cuadro-observations">
                        <p>${report.diagnosis ?? ''}</p>
                    </div>
                </div>
            </td>
        </tr>
        <tr class="no-borders">
            <td class="mayus no-borders">
                <div class="">
                    <b>REPARACIÓN REALIZADA:</b><br>
                    <div class="cuadro-observations">
                        <p>${report.solution ?? ''}</p>
                    </div>
                </div>
            </td>
        </tr>
        <tr class="no-borders">
            <td class="mayus no-borders">
                <div class="">
                    <b>OBSERVACIONES:</b><br>
                    <div class="cuadro-observations">
                        <p>${report.observations ?? ''}</p>
                    </div>
                </div>
            </td>
        </tr>
        <tr class="no-borders">
            <td class="mayus no-borders">
                <div class="">
                    <b>COMENTARIOS DEL CLIENTE:</b><br>
                    <div class="cuadro-observations">
                        <p>${(report.comments ?? '').replace(/\n/g, '<br>')} ?? ''}</p>
                    </div>
                </div>
            </td>
        </tr>
    </tfoot>
</table>

<footer>
<br><br><br>
<table class="order-details">
    <tr>
        <td class="no-borders order-qr" style="text-align: center;">
            <b class="mayus">______________________________________</b><br><br>
            Firma Ingeniero
        </td>
        <td class="no-borders order-qr" style="text-align: center;">
            <b class="mayus">______________________________________</b><br><br>
            Firma Cliente
        </td>
    </tr>
</table>
</footer>

</body>
</html>
  `;
};
