export function generatePerDiemPrintableHtml(perDiem: any, qrPath: string, membrete: string, css: string): string {
  // Función para formatear números con separadores de miles
  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US');
  };

  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('es-MX', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const gasolineTotal = perDiem.gasoline_charges?.reduce((sum: number, charge: any) => sum + charge.amount, 0) || 0;
  const extrasTotal = perDiem.extra_expenses?.reduce((sum: number, expense: any) => sum + expense.amount, 0) || 0;
  
  const total = perDiem.hotel + 
    gasolineTotal +
    perDiem.food +
    perDiem.fee +
    perDiem.vehicle_cost +
    extrasTotal;

  const gasolineRows = perDiem.gasoline_charges?.map((charge: any) => `
    <tr>
      <th class="encabezado">${charge.name || 'Carga de Gasolina'}</th>
      <th class="encabezado">$${formatNumber(charge.amount)}</th>
    </tr>
  `).join('') || '';

  const extraRows = perDiem.extra_expenses?.map((expense: any) => `
    <tr>
      <th class="encabezado">${expense.name}</th>
      <th class="encabezado">$${formatNumber(expense.amount)}</th>
    </tr>
  `).join('') || '';

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>${css}</style>
</head>
<body class="invoice">

<div id="watermark">
  <img src="${membrete}" height="97%" width="100%" />
</div>

<table class="order-data-addresses">
   <tr>
        <td class="order-data">
            <table class="cuadro">
                <tr><th class="mayus line">Cliente:</th><td class="datos mayus line2">${perDiem.customer.name}</td></tr>
                <tr><th class="mayus line">RFC:</th><td class="datos mayus line2">${perDiem.customer.rfc}</td></tr>
                <tr><th class="mayus line">Teléfono:</th><td class="datos mayus line2">${perDiem.customer.contact}</td></tr>
                <tr><th class="mayus line">Ubicación:</th><td class="datos mayus line2">${perDiem.customer.address}</td></tr>
            </table>
        </td>
        <td class="order-data">
            <table class="cuadro">
                <tr><th class="mayus line">Realizó:</th><td class="datos mayus line2">${perDiem.user.name}</td></tr>
                <tr><th class="mayus line">Fecha:</th><td class="datos mayus line2">${formatDateTime(perDiem.created_at)}</td></tr>
                <tr><th class="mayus line">Folio:</th><td class="datos mayus line2">V-${perDiem.id}</td></tr>

            </table>
        </td>
        <td class="order-data quotation-qr">
        <img src="${qrPath}" style="width: 90px; height: 90px;" />
        </td>
    </tr>
</table>

<hr>
  <h1 class="document-type-label" style="text-align=center">VIÁTICOS</h1>
      
      <table class="tabla-viaticos">
        <tbody>
         <tr>
            <th class="gastos">DETALLES DEL VIÁTICO</th> 
            </tr>
          <tr>
            <th class="encabezado">Vehículo (PLACAS): ${perDiem.vehicle}</th>
            <th class="transparente"></th>
          </tr>
            <tr>
            <th class="encabezado">Fecha de Inicio: ${formatDateTime(perDiem.start_date)}</th>
            <th class="transparente" ></th>
          </tr>
          <tr>
            <th class="encabezado">Fecha de Fin: ${perDiem.end_date ? formatDateTime(perDiem.end_date) : 'Sin fecha programada'}</th>
            <th class="transparente"></th>
          </tr>
            <tr>
            <th class="encabezado">KM Inicial: ${formatNumber(perDiem.start_km)}</th>
            <th class="transparente"></th>      
          </tr>
          <tr>
            <th class="encabezado">KM Final: ${formatNumber(perDiem.end_km)}</th>
            <th class="transparente"></th>      
          </tr>
          <tr>
            <th class="encabezado">KM Total: ${formatNumber(perDiem.total_km)}</th>
            <th class="transparente"></th>      
          </tr>
           <tr>
            <th class="encabezado">Ciudad: ${perDiem.city}</th>
            <th class="borde-inferior"></th>      
          </tr>
          <tr>
          <th class="encabezado"># de Personas: ${perDiem.people}</th>
          <th class="gastos">GASTOS</th>      
        </tr>
        ${gasolineRows}
        ${gasolineTotal > 0 ? `
        <tr>
          <th class="encabezado"><strong>Subtotal Gasolina</strong></th>
          <th class="encabezado"><strong>$${formatNumber(gasolineTotal)}</strong></th>
        </tr>` : ''}
        <tr>
          <th class="encabezado">Caseta</th>
          <th class="encabezado">$${formatNumber(perDiem.fee)}</th>      
        </tr>
        <tr>
          <th class="encabezado">Alimentos</th>
          <th class="encabezado">$${formatNumber(perDiem.food)}</th>      
        </tr>
        <tr>
          <th class="encabezado">Hotel</th>
          <th class="encabezado">$${formatNumber(perDiem.hotel)}</th>      
        </tr>
        <tr>
          <th class="encabezado">Vehículo (MANTENIMIENTO)</th>
          <th class="encabezado">$${formatNumber(perDiem.vehicle_cost)}</th>      
        </tr>
        ${extraRows}
        ${extrasTotal > 0 ? `
        <tr>
          <th class="encabezado"><strong>Subtotal Extras</strong></th>
          <th class="encabezado"><strong>$${formatNumber(extrasTotal)}</strong></th>
        </tr>` : ''}
        <tr>
          <th class="encabezado">Total</th>
          <th class="encabezado">$${formatNumber(total)}</th>
        </tr>
        </tbody>
      </table>
      <br><br>

<table class="quotation-details">
  <tfoot>
    <tr class="no-borders">
      <td class="mayus no-borders">
        <b>OBSERVACIONES:</b><br>
        <div class="cuadro-observations">
          <p>${(perDiem.comments ?? '').replace(/\n/g, '<br>')}</p>
        </div>
      </td>
    </tr>
  </tfoot>
</table>

</body>
</html>
    `
}