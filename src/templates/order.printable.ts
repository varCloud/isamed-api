export function generateOrderPrintableHtml(order: any, qrPath: string, membrete: string, delivery: any, css: string): string {
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
                <tr><th class="mayus line">Cliente:</th><td class="datos mayus line2">${order.customer.name}</td></tr>
                <tr><th class="mayus line">RFC:</th><td class="datos mayus line2">${order.customer.rfc}</td></tr>
                <tr><th class="mayus line">Teléfono:</th><td class="datos mayus line2">${order.customer.contact}</td></tr>
                <tr><th class="mayus line">Ubicación:</th><td class="datos mayus line2">${order.customer.address}</td></tr>
            </table>
        </td>
        <td class="order-data">
            <table class="cuadro">
                <tr><th class="mayus line">Realizó:</th><td class="datos mayus line2">${order.user.name}</td></tr>
                <tr><th class="mayus line">Fecha:</th><td class="datos mayus line2">${new Date(order.created_at).toLocaleString('es-MX')}</td></tr>
                <tr><th class="mayus line">Folio::</th><td class="datos mayus line2">S-${order.id}</td></tr>
                ${delivery ? `
                <tr><th class="mayus line">Paquetería:</th><td class="datos mayus line2">${delivery.delivery_parcel}</td></tr>
                <tr><th class="mayus line">Rastreo:</th><td class="datos mayus line2">${delivery.code}</td></tr>
                ` : ''}
            </table>
        </td>
        <td class="order-data order-qr">
        <img src="${qrPath}" style="width: 90px; height: 90px;" />
        </td>
    </tr>
</table>

<hr>

<h1 class="document-type-label" style="text-align: center;">ORDEN DE SERVICIO</h1>
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
    ${order.equipments.map((equipment: any) => `
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
                    <b>OBSERVACIONES:</b><br>
                    <div class="cuadro-observations">
                        <p>${(order.comments ?? '').replace(/\n/g, '<br>')}</p>
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
}
