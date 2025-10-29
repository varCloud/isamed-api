export function generatePromissoryNotePrintableHtml(promissoryNote: any, qrPath: string, membrete: string, css: string): string {
 
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
</div>s

<table class="order-data-addresses">
   <tr>
        <td class="order-data">
            <table class="cuadro">
                <tr><th class="mayus line">Cliente:</th><td class="datos mayus line2">${promissoryNote.customer.name}</td></tr>
                <tr><th class="mayus line">RFC:</th><td class="datos mayus line2">${promissoryNote.customer.rfc}</td></tr>
                <tr><th class="mayus line">Teléfono:</th><td class="datos mayus line2">${promissoryNote.customer.contact}</td></tr>
                <tr><th class="mayus line">Ubicación:</th><td class="datos mayus line2">${promissoryNote.customer.address}</td></tr>
            </table>
        </td>
        <td class="order-data">
            <table class="cuadro">
                <tr><th class="mayus line">Realizó:</th><td class="datos mayus line2">ING. MIGUEL ANGEL GUZMAN
MARCOS</td></tr>
                <tr><th class="mayus line">Fecha:</th><td class="datos mayus line2">${new Date(promissoryNote.created_at).toLocaleString('es-MX')}</td></tr>
                <tr><th class="mayus line">Folio:</th><td class="datos mayus line2">P-${promissoryNote.id}</td></tr>

            </table>
        </td>
        <td class="order-data quotation-qr">
        <img src="${qrPath}" style="width: 90px; height: 90px;" />
        </td>
    </tr>
</table>

<hr>
  <h1 class="document-type-label" style="text-align=center">PAGARÉ</h1>

          <p>
  Debo y pagaré incondicionalmente por este pagaré a la orden del C. MIGUEL ANGEL GUZMAN MARCOS, en
  domicilio calle margarita N°9 (provisional), colonia las flores, Xochitepec, Morelos, 62790 o en la que se
  me(nos) requiere a elección del beneficiario la cantidad de <strong>${promissoryNote.quantity_digit} (${promissoryNote.quantity_text} Pesos Moneda Nacional)</strong>,
  cantidad recibida en efectivo o transferencia a mi entera satisfacción, debiendo realizar el pago el día <strong>${promissoryNote.day_digit} (${promissoryNote.day_text})</strong>
  del mes <strong>${promissoryNote.month_digit} (${promissoryNote.month_text})</strong> del año <strong>${promissoryNote.year_digit} (${promissoryNote.year_text})</strong>.
</p>
<p>
  Valor recibido a mi entera satisfacción, este pagare forma parte de una serie numerada del 1 al ${promissoryNote.id} y todos
  están sujetos a la condición de que, al no pagarse cualquiera de ellos a su vencimiento, serán exigibles todos
  los que le sigan en número, además de los ya vencidos, desde la fecha de vencimiento de este documento
  hasta el día de su liquidación.
</p>
<p>
  En caso de mora en cualquiera de las exhibiciones convenidas, se causará interés moratorio a razón de 4.5%
  mensual, más el correspondiente impuesto al valor agregado durante el tiempo en el que el suscriptor incurra
  en mora.
</p>
<p>
  Queda convenido que la falta de pago oportuno de una o más exhibiciones mensuales, dará por vencida
  anticipadamente la totalidad de la obligación pactada.
</p>
<footer>
  <br> <br> <br>
    <table class="order-details">
      <tr>
        <td class="no-borders order-qr">
          <b class="mayus">______________________________________</b> <br> <br>
        </td>
        <td class="no-borders order-qr">
          <b class="mayus">______________________________________</b> <br> <br>
        </td>
      </tr>
      <tr>
        <td class="no-borders order-qr">
          <b class="mayus">Firma y Huella del Aval</b>
        </td>
        <td class="no-borders order-qr">
          <b class="mayus">Firma y Huella del Deudor</b>
        </td>
      </tr>
    </table>
  </footer>
</body>
</html>
    `
}