
import { Shipment } from '../types';
import { formatCurrency, formatDate } from './shipmentService';

export const generateInvoicePDF = (shipment: Shipment): void => {
  // Create a new window for the invoice
  const invoiceWindow = window.open('', '_blank');
  
  if (!invoiceWindow) {
    alert('Please allow pop-ups to generate the invoice');
    return;
  }
  
  // Calculate tax and total
  const taxRate = 0.15; // 15% tax
  const taxAmount = shipment.cost * taxRate;
  const totalAmount = shipment.cost + taxAmount;
  
  // Create invoice HTML
  const invoiceHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice #${shipment.id}</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
        }
        .invoice-container {
          max-width: 800px;
          margin: 0 auto;
          border: 1px solid #ddd;
          padding: 30px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .invoice-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid #ddd;
        }
        .company-details h2, .invoice-details h2 {
          margin: 0;
          color: #1a73e8;
        }
        .invoice-body {
          margin-bottom: 30px;
        }
        .customer-details {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
        }
        .details-column {
          width: 48%;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        th, td {
          padding: 10px;
          border-bottom: 1px solid #ddd;
          text-align: left;
        }
        th {
          background-color: #f9f9f9;
        }
        .total-section {
          float: right;
          width: 300px;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
        }
        .total-row.grand-total {
          font-weight: bold;
          font-size: 1.2em;
          border-top: 2px solid #333;
          padding-top: 10px;
          margin-top: 10px;
        }
        .status-badge {
          display: inline-block;
          padding: 5px 10px;
          border-radius: 4px;
          font-weight: bold;
        }
        .status-delivered {
          background-color: #d4edda;
          color: #155724;
        }
        .status-in-transit {
          background-color: #fff3cd;
          color: #856404;
        }
        .status-pending {
          background-color: #ffe5d0;
          color: #b35900;
        }
        .footer {
          text-align: center;
          margin-top: 50px;
          color: #777;
        }
        @media print {
          .invoice-container {
            box-shadow: none;
            border: none;
          }
          .print-button {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="invoice-header">
          <div class="company-details">
            <h2>ACMS Logistics</h2>
            <p>123 Main Street, Accra<br>Ghana<br>Email: info@acms.com<br>Tel: +233 20 123 4567</p>
          </div>
          <div class="invoice-details">
            <h2>INVOICE</h2>
            <p><strong>Invoice #:</strong> INV-${shipment.id}</p>
            <p><strong>Date:</strong> ${formatDate(shipment.createdAt)}</p>
            <p>
              <strong>Status:</strong> 
              <span class="status-badge ${shipment.status === 'Delivered' ? 'status-delivered' : shipment.status === 'In Transit' ? 'status-in-transit' : 'status-pending'}">
                ${shipment.status}
              </span>
            </p>
          </div>
        </div>
        
        <div class="invoice-body">
          <div class="customer-details">
            <div class="details-column">
              <h3>From:</h3>
              <p>${shipment.sender}<br>${shipment.route.split(' - ')[0]}</p>
            </div>
            <div class="details-column">
              <h3>To:</h3>
              <p>${shipment.receiver}<br>${shipment.route.split(' - ')[1]}</p>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Route</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Cargo Shipment Service</td>
                <td>${shipment.route}</td>
                <td>${formatCurrency(shipment.cost)}</td>
              </tr>
            </tbody>
          </table>
          
          <div class="total-section">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>${formatCurrency(shipment.cost)}</span>
            </div>
            <div class="total-row">
              <span>Tax (15%):</span>
              <span>${formatCurrency(taxAmount)}</span>
            </div>
            <div class="total-row grand-total">
              <span>Total:</span>
              <span>${formatCurrency(totalAmount)}</span>
            </div>
          </div>
        </div>
        
        <div style="clear: both;"></div>
        
        <div class="footer">
          <p>Thank you for your business!</p>
        </div>
        
        <div class="print-button" style="text-align: center; margin-top: 30px;">
          <button onclick="window.print()" style="padding: 10px 20px; background-color: #1a73e8; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Print Invoice
          </button>
        </div>
      </div>
    </body>
    </html>
  `;
  
  // Write the HTML to the new window
  invoiceWindow.document.open();
  invoiceWindow.document.write(invoiceHtml);
  invoiceWindow.document.close();
};
