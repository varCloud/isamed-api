export const generateMonthlyServicesPrintable = (orders: any[], month: string) => {
  const translateStatus = (status: string) => {
    const statusTranslations: Record<string, string> = {
      'pending': 'Pendiente',
      'in_progress': 'En Progreso',
      'completed': 'Concluido',
      'cancelled': 'Cancelado'
    };
    return statusTranslations[status] || status;
  };

  return `
  <html lang="es">
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          margin: 2cm auto;
          padding: 10px;
          font-family: Arial, sans-serif;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
          table-layout: fixed;
          word-wrap: break-word;
        }
        caption {
          caption-side: top;
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        th, td {
          border: 2px solid #afd038;
          padding: 8px;
          text-align: left;
          vertical-align: top;
        }
        th {
          background-color: #afd038;
          color: black;
        }
        td {
          background-color: #fff;
        }
        .wrap {
          white-space: pre-line;
        }
      </style>
    </head>
    <body>
      <table>
        <caption>Reportes del mes ${month} del año ${new Date().getFullYear()}</caption>
        <thead>
          <tr>
            <th>R-</th>
            <th>Cliente</th>
            <th>Ingeniero Asignado</th>
            <th>Falla</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          ${orders.map((order) => `
            <tr>
              <td>${order.id}</td>
              <td class="wrap">${order.customer.name}</td>
              <td class="wrap">${order.user.name}</td>
              <td class="wrap">
                ${order.equipments.map((eq: any) => `* ${eq.failure}`).join('<br/>')}
              </td>
              <td>${translateStatus(order.status)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </body>
  </html>
  `;
};
