export function generateQuotationPrintableHtml(quotation: any, qrPath: string, membrete: string, css: string): string {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-MX', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const subtotal = quotation.quote_items.reduce(
    (acc: number, item: any) => acc + item.unit_price * item.quantity,
    0
  );

  const fee              = Number(quotation.fee)              || 0;
const paymentAdvance   = Number(quotation.payment_advance)  || 0;
const perDiem          = Number(quotation.per_diem)         || 0;
const ivaPercent       = Number(quotation.iva)              || 0;
const discount         = Number(quotation.discount)         || 0;
const flatDiscount     = Boolean(quotation.flat_discount)   || false;
const discountPerDiemPercent = Number(quotation.discount_per_diem) || 0;
const interestPercent  = Number(quotation.interest)         || 0;

  const discountAmount = flatDiscount 
    ? discount  
    : subtotal * (discount / 100);  
  const subtotalAfterDiscount = subtotal - discountAmount;

  const discountPerDiemAmount =
    perDiem * (discountPerDiemPercent / 100);
  const perDiemAfterDiscount = perDiem - discountPerDiemAmount;

  const ivaAmount = subtotalAfterDiscount * (ivaPercent / 100);

  const interestRate = interestPercent / 100;
  const interestAmount = subtotalAfterDiscount * interestRate;

  const total =
    subtotalAfterDiscount +
    ivaAmount +
    perDiemAfterDiscount +
    fee -
    paymentAdvance;

  const totalWithInterest = total + interestAmount;


  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    ${css}
    
    /* Additional styles for page breaks and table height control */
    @media print {
      .equipment-details {
        page-break-inside: avoid;
        max-height: 400px;
      }
      
      .quote-item-row {
        page-break-inside: avoid;
        height: auto;
        min-height: 30px;
      }
      
      tbody {
        max-height: 350px;
        overflow: visible;
      }
      
      /* Force page break every 10 items */
      .quote-item-row:nth-child(10n) {
        page-break-after: always;
      }
      
      /* Page numbering */
      @page {
        margin-bottom: 30mm;
        @bottom-center {
          content: "Página " counter(page) " de " counter(pages);
          font-size: 12px;
          color: #666;
        }
      }
      
      /* Page footer */
      .page-footer {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 25mm;
        text-align: center;
        font-size: 12px;
        color: #666;
        border-top: 1px solid #ccc;
        padding-top: 5px;
        background: white;
      }
      
      /* Page break control */
      .page-break {
        page-break-before: always;
      }
      
      /* Content area with bottom margin for footer */
      body {
        margin-bottom: 30mm;
      }
    }
    
    /* Screen styles */
    .equipment-details {
      max-height: 400px;
      overflow-y: auto;
    }
    
    .quote-item-row {
      height: auto;
      min-height: 30px;
    }
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
                <tr><th class="mayus line">Cliente:</th><td class="datos mayus line2">${quotation.customer.name}</td></tr>
                <tr><th class="mayus line">RFC:</th><td class="datos mayus line2">${quotation.customer.rfc}</td></tr>
                <tr><th class="mayus line">Teléfono:</th><td class="datos mayus line2">${quotation.customer.contact}</td></tr>
                <tr><th class="mayus line">Ubicación:</th><td class="datos mayus line2">${quotation.customer.address}</td></tr>
            </table>
        </td>
        <td class="order-data">
            <table class="cuadro">
                <tr><th class="mayus line">Realizó:</th><td class="datos mayus line2">${quotation.user.name}</td></tr>
                <tr><th class="mayus line">Fecha:</th><td class="datos mayus line2">${new Date(quotation.created_at).toLocaleString('es-MX')}</td></tr>
                <tr><th class="mayus line">Folio:</th><td class="datos mayus line2">C-${quotation.id}</td></tr>

            </table>
        </td>
        <td class="order-data order-qr">
        <img src="${qrPath}" style="width: 90px; height: 90px;" />
        </td>
    </tr>
</table>

<hr>

<h1 class="document-type-label" style="text-align: center;">COTIZACIÓN</h1>

<table class="equipment-details" style="page-break-inside: avoid; max-height: 400px;">
  <thead>
    <tr>
      <th class="mayus quantity1 line">CANTIDAD</th>
      <th class="mayus valor1 lineD">DESCRIPCIÓN</th>
      <th class="mayus price1 line">PRECIO UNITARIO</th>
      <th class="mayus price2 line">PRECIO TOTAL</th>
    </tr>
  </thead>
 <tbody style="max-height: 350px; overflow: hidden;">
  ${quotation.quote_items.map((item: any, index: number) => `
    <tr class="quote-item-row" style="page-break-inside: avoid; ${index > 0 && index % 10 === 0 ? 'page-break-before: always;' : ''}">
      <td class="mayus">${item.quantity}</td>
      <td class="mayus2" style="white-space: pre-line;"><b>${item.description.replace(/\n/g, '<br>')}</b></td>
      <td class="mayus" style="text-align: left; width: 20%;">$${formatCurrency(item.unit_price)}</td>
      <td class="mayus align-left" style="width: 10%;">$${formatCurrency(item.unit_price * item.quantity)}</td>
    </tr>
  `).join('')}

  ${quotation.discount > 0 ? `
    <tr class="quotation-breakdown">
      <td colspan="2"></td>
      <td class="label">Descuento en Servicio ${flatDiscount ? `($${formatCurrency(quotation.discount)})` : `(${quotation.discount}%)`}</td>
      <td class="value">-$${formatCurrency(discountAmount)}</td>
    </tr>` : ''}

  <tr class="quotation-breakdown">
    <td colspan="2"></td>
    <td class="label">Subtotal</td>
    <td class="value">$${formatCurrency(subtotalAfterDiscount)}</td>
  </tr>

  ${quotation.iva > 0 ? `
    <tr class="quotation-breakdown">
      <td colspan="2"></td>
      <td class="label">I.V.A. (${quotation.iva}%)</td>
      <td class="value">$${formatCurrency(ivaAmount)}</td>
    </tr>` : ''}

  ${quotation.fee > 0 ? `
    <tr class="quotation-breakdown">
      <td colspan="2"></td>
      <td class="label">Costo de Paquetería</td>
      <td class="value">$${formatCurrency(quotation.fee)}</td>
    </tr>` : ''}

  ${quotation.per_diem > 0 ? `
    <tr class="quotation-breakdown">
      <td colspan="2"></td>
      <td class="label">Viáticos</td>
      <td class="value">$${formatCurrency(quotation.per_diem)}</td>
    </tr>` : ''}

  ${quotation.discount_per_diem > 0 ? `
    <tr class="quotation-breakdown">
      <td colspan="2"></td>
      <td class="label">Descuento en Viáticos (${quotation.discount_per_diem}%)</td>
      <td class="value">-$${formatCurrency(discountPerDiemAmount)}</td>
    </tr>` : ''}

  ${quotation.payment_advance > 0 ? `
    <tr class="quotation-breakdown">
      <td colspan="2"></td>
      <td class="label">Anticipo</td>
      <td class="value">-$${formatCurrency(quotation.payment_advance)}</td>
    </tr>` : ''}

  ${quotation.days_per_diem > 0 ? `
    <tr class="quotation-breakdown">
      <td colspan="2"></td>
      <td class="label">Días: ${quotation.days_per_diem}</td>
      <td class="value"></td>
    </tr>` : ''}

  <!-- TOTAL -->
  <tr class="quotation-total">
    <td colspan="2"></td>
    <td class="label">Total</td>
    <td class="align-left">$${formatCurrency(total)}</td>
  </tr>

  ${quotation.monthly_payment > 0 && interestAmount > 0 ? `
    <tr class="quotation-total">
      <td colspan="2"></td>
      <td class="label">Total con Intereses</td>
      <td class="align-left">$${formatCurrency(totalWithInterest)}</td>
    </tr>` : ''}
</tbody>

</table>

<table class="order-details">
  <tfoot>
    <tr class="no-borders">
      <td class="mayus no-borders">
        <b>OBSERVACIONES:</b><br>
        <div class="cuadro-observations">
          <p>${(quotation.comments ?? '').replace(/\n/g, '<br>')}</p>
        </div>
      </td>
    </tr>
  </tfoot>
</table>

<footer>
  <br><br><br>
  <table class="order-details">
    <tr>
      <td class="no-borders quotation-qr" style="text-align: center;">
        <b class="mayus">______________________________________</b><br><br>
        Firma Ingeniero
      </td>
      <td class="no-borders quotation-qr" style="text-align: center;">
        <b class="mayus">______________________________________</b><br><br>
        Firma Cliente
      </td>
    </tr>
  </table>
</footer>

<!-- Page footer for page numbering -->
<div class="page-footer">
  <div style="display: flex; justify-content: space-between; align-items: center; padding: 0 20px;">
    <span>Cotización C-${quotation.id}</span>
    <span>IDSAMED - Página 1 de 2</span>
    <span>${new Date().toLocaleDateString('es-MX')}</span>
  </div>
</div>

${quotation.quote_items.length > 10 ? `
<!-- Second page footer -->
<div class="page-footer page-break" style="position: fixed; bottom: 0;">
  <div style="display: flex; justify-content: space-between; align-items: center; padding: 0 20px;">
    <span>Cotización C-${quotation.id}</span>
    <span>IDSAMED - Página 2 de 2</span>
    <span>${new Date().toLocaleDateString('es-MX')}</span>
  </div>
</div>
` : ''}

</body>
</html>`;
}
