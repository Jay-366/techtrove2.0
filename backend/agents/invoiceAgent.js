import * as XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Invoice Agent - Creates professional Excel invoice files
 * @param {Object} params - Invoice parameters
 * @param {string} params.userId - User identifier
 * @param {string} params.clientName - Client name
 * @param {string} params.serviceDescription - Description of services
 * @param {number} params.amount - Invoice amount
 * @param {string} [params.invoiceNumber] - Invoice number (auto-generated if not provided)
 * @param {string} [params.dueDate] - Due date (defaults to 30 days from now)
 * @param {string} [params.companyName] - Company name (defaults to "TechTrove")
 * @param {string} [params.companyEmail] - Company email
 * @returns {Promise<Object>} Result object with file path and invoice details
 */
export async function invoiceAgent({
  userId,
  clientName,
  serviceDescription,
  amount,
  invoiceNumber,
  dueDate,
  companyName = "TechTrove",
  companyEmail = "hello@techtrove.com"
}) {
  try {
    console.log(`[invoiceAgent] Creating invoice for ${clientName}`);

    // Generate invoice details
    const today = new Date();
    const invoiceDate = today.toLocaleDateString();
    const finalInvoiceNumber = invoiceNumber || `INV-${Date.now().toString().slice(-6)}`;
    
    // Calculate due date (30 days from now if not provided)
    let finalDueDate = dueDate;
    if (!finalDueDate) {
      const dueDateObj = new Date();
      dueDateObj.setDate(dueDateObj.getDate() + 30);
      finalDueDate = dueDateObj.toLocaleDateString();
    }

    // Create invoice data structure
    const invoiceData = [
      // Header section
      [companyName, '', '', '', '', ''],
      [`Email: ${companyEmail}`, '', '', '', '', ''],
      ['', '', '', '', '', ''],
      ['INVOICE', '', '', '', '', ''],
      ['', '', '', '', '', ''],
      
      // Invoice details
      [`Invoice #: ${finalInvoiceNumber}`, '', '', `Date: ${invoiceDate}`, '', ''],
      [`Due Date: ${finalDueDate}`, '', '', '', '', ''],
      ['', '', '', '', '', ''],
      
      // Bill to section
      ['BILL TO:', '', '', '', '', ''],
      [clientName, '', '', '', '', ''],
      ['', '', '', '', '', ''],
      
      // Service details header
      ['Description', 'Quantity', 'Rate', 'Amount', '', ''],
      ['', '', '', '', '', ''],
      
      // Service line item
      [serviceDescription, '1', `$${amount}`, `$${amount}`, '', ''],
      ['', '', '', '', '', ''],
      ['', '', '', '', '', ''],
      
      // Total section
      ['', '', 'Subtotal:', `$${amount}`, '', ''],
      ['', '', 'Tax (0%):', '$0.00', '', ''],
      ['', '', 'TOTAL:', `$${amount}`, '', ''],
      ['', '', '', '', '', ''],
      ['', '', '', '', '', ''],
      
      // Payment terms
      ['Payment Terms:', '', '', '', '', ''],
      ['Net 30 days', '', '', '', '', ''],
      ['Thank you for your business!', '', '', '', '', '']
    ];

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(invoiceData);

    // Set column widths
    worksheet['!cols'] = [
      { width: 25 }, // Description
      { width: 10 }, // Quantity
      { width: 15 }, // Rate
      { width: 15 }, // Amount
      { width: 10 }, // Empty
      { width: 10 }  // Empty
    ];

    // Style the header
    const headerStyle = {
      font: { bold: true, sz: 16 },
      alignment: { horizontal: 'left' }
    };

    const invoiceHeaderStyle = {
      font: { bold: true, sz: 20 },
      alignment: { horizontal: 'left' }
    };

    const totalStyle = {
      font: { bold: true },
      alignment: { horizontal: 'right' }
    };

    // Apply basic styling (XLSX has limited styling in free version)
    if (worksheet['A1']) worksheet['A1'].s = headerStyle;
    if (worksheet['A4']) worksheet['A4'].s = invoiceHeaderStyle;
    if (worksheet['C18']) worksheet['C18'].s = totalStyle;
    if (worksheet['C19']) worksheet['C19'].s = totalStyle;
    if (worksheet['C20']) worksheet['C20'].s = totalStyle;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Invoice');

    // Ensure invoices directory exists
    const invoicesDir = path.join(__dirname, '..', 'invoices');
    if (!fs.existsSync(invoicesDir)) {
      fs.mkdirSync(invoicesDir, { recursive: true });
    }

    // Generate filename
    const filename = `invoice_${finalInvoiceNumber}_${clientName.replace(/[^a-zA-Z0-9]/g, '_')}.xlsx`;
    const filePath = path.join(invoicesDir, filename);

    // Write the file
    XLSX.writeFile(workbook, filePath);

    console.log(`[invoiceAgent] ✅ Invoice created: ${filePath}`);

    return {
      status: 'CREATED',
      invoiceNumber: finalInvoiceNumber,
      clientName: clientName,
      amount: amount,
      filePath: filePath,
      filename: filename,
      invoiceDate: invoiceDate,
      dueDate: finalDueDate,
      serviceDescription: serviceDescription
    };

  } catch (error) {
    console.error('[invoiceAgent] Error creating invoice:', error.message);
    throw new Error(`Failed to create invoice: ${error.message}`);
  }
}