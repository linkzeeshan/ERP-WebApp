import * as XLSX from 'xlsx';

// Interfaces for Excel data structures
export interface BoxInHand {
  BOXNUMBER: string;
  PRODUCTCODE: string;
  MERGE: string;
  DENIER: string;
  GRADECODE: string;
  PACKINGTYPECODE: string;
  SHADECODE: string;
  SPOOLCODE: string;
  BOXCODE: string;
  CONECODE: string;
  KEYWORD: string;
  USAGEFLAG: string;
  FGWLOCATION: string;
  SLIPDATE: string;
  PACKERID: string;
  EDITFLAG: string;
  CONES: number;
  GROSSWT: number;
  TAREWT: number;
  NETWT: number;
  MACHINENUMBER: string;
  DISPATCHSTATUS: string;
  DANUMBER: string;
  JOBNUMBER: string;
  DOFFWT: number;
  BOXTYPE: string;
  TWIST: string;
  LUSTURE: string;
  ILTYPE: string;
  HEATER: string;
  SONUMBER: string;
  JOBRUNNINGNO: string;
  INSTOCK: string;
  SORUNNINGNO: string;
  PICKFLAG: string;
  AUTOPACKING: string;
  ACTWT: number;
}

export interface ExportOrder {
  SOE_PINUMBER: string;
  SOE_PIDATE: string;
  SOE_CURRENCY: string;
  SOE_ORDERTYPE: string;
  SOE_WUNIT: string;
  SOE_AGENT: string;
  SOE_CONSIGNEE: string;
  SOE_CONADDRESS: string;
  SOE_COUNTRY: string;
  SOE_PRODUCT: string;
  SOE_DENIER: string;
  SOE_FILAMENT: string;
  SOE_MERGE: string;
  SOE_GRADE: string;
  SOE_SPOOL: string;
  SOE_PRODUCTDESC: string;
  SOE_QTY: number;
  SOE_PIRATE: number;
  SOE_ACTRATE: number;
  SOE_PIAMOUNT: number;
  SOE_ACTAMOUNT: number;
  SOE_FREIGHT: number;
  SOE_FREIGHTKGS: number;
  SOE_INSURANCE: number;
  SOE_INSKGS: number;
  SOE_COMISSION: number;
  SOE_COMMKGS: number;
  SOE_DAYS: number;
  SOE_INTREST: number;
  SOE_INTKGS: number;
  SOE_NETFOB: number;
  SOE_TOTALAMOUNT: number;
  SOE_DELIVERYTERMS: string;
  SOE_PAYMENTTERMS: string;
  SOE_DELIVERYDATE: string;
  SOE_VALIDITY: string;
  SOE_QUALITYVARIATION: string;
  SOE_PACKINGTYPE: string;
  SOE_TRANSHIPMENT: string;
  SOE_PARTIALSHIPMENT: string;
  SOE_TESTRESULTS: string;
  SOE_DESTIPORT: string;
  SOE_REMARKS: string;
  SOE_CONTAINERS: string;
  SOE_BANKACNUMBER1: string;
  SOE_BANKACNAME1: string;
  SOE_BANKNAME1: string;
  SOE_BANKADRESS1: string;
  SOE_TELEX1: string;
  SOE_SWIFT1: string;
  SOE_BANKACNUMBER2: string;
  SOE_BANKACNAME2: string;
  SOE_BANKNAME2: string;
  SOE_BANKADRESS2: string;
  SOE_TELEX2: string;
  SOE_SWIFT2: string;
  SOE_CONSIGNEECODE: string;
  SOE_APPROVED: string;
  SOE_LCSTATUS: string;
  SOE_PRSTATUS: string;
  SOE_DASTATUS: string;
  SOE_APPROVEDBY: string;
  SOE_APPROVEDON: string;
  SOE_PRINTFLAG: string;
  SOE_EMAIL: string;
  SOE_RUNNINGNUMBER: string;
  SOE_JOBSTATUS: string;
  SOE_QTY_BALANCED: number;
  SOE_CUSTOMINVOICE_STATUS: string;
  SOE_ORDERNO: string;
  SOE_DELIVERY: string;
  SOE_STATUS: string;
  SOE_STATUS_REMARKS: string;
  SOE_PAYMENT_TYPE: string;
  SOE_REVISION: string;
  SOE_INTERNAL_USE: string;
  SOE_CUST_PHONE: string;
  SOE_CUST_FAX: string;
  SOE_CUST_TAX: string;
  SOE_STATUS_UPDATED_BY: string;
  SOE_REMARKS_UP: string;
}

export interface LocalOrder {
  SOL_NUMBER: string;
  SOL_DATE: string;
  SOL_AGENT: string;
  SOL_AGENTCOMM: number;
  SOL_CUSTOMERNAME: string;
  SOL_CUSTOMERADDRESS: string;
  SOL_CUSTOMERCOUNTRY: string;
  SOL_PRODUCTDESCRIPTION: string;
  SOL_QTY: number;
  SOL_UPRICE: number;
  SOL_UAMOUNT: number;
  SOL_TOTALAMOUNT: number;
  SOL_PAYMENTTERMS: string;
  SOL_DELIVERYTERMS: string;
  SOL_VALIDITY: string;
  SOL_CONDITIONS: string;
  SOL_PRSTATUS: string;
  SOL_DASTATUS: string;
  SOL_DELIVERYADDRESS: string;
  SOL_CUSTOMEREMAIL: string;
  SOL_APPROVAL_STATUS: string;
  SOL_CUSTOMERCODE: string;
  SOL_APPROVEDBY: string;
  SOL_APPROVEDON: string;
  SOL_PRINTFLAG: string;
  SOL_JOBSTATUS: string;
  SOL_GRADE: string;
  SOL_USAGE: string;
  SOL_MERGE: string;
  SOL_PRODUCT: string;
  SOL_QTY_BALANCED: number;
  SOL_RUNNINGNUMBER: string;
  SOL_PONUMBER: string;
  SOL_VAT: number;
  SOL_STATUS: string;
  SOL_STATUS_REMARKS: string;
  SOL_STATUS_UPDATED_BY: string;
  SOL_REMARKS: string;
}

export interface ExcelData {
  boxInHand: BoxInHand[];
  exportOrders: ExportOrder[];
  localOrders: LocalOrder[];
}

// Helper function to parse date strings
function parseDate(dateStr: string): Date {
  if (!dateStr) return new Date();
  
  // Handle Oracle date format: "30-MAY-25 12.00.00.000000000 AM"
  const match = dateStr.match(/(\d{1,2})-([A-Z]{3})-(\d{2})/);
  if (match) {
    const [, day, month, year] = match;
    const monthMap: { [key: string]: number } = {
      'JAN': 0, 'FEB': 1, 'MAR': 2, 'APR': 3, 'MAY': 4, 'JUN': 5,
      'JUL': 6, 'AUG': 7, 'SEP': 8, 'OCT': 9, 'NOV': 10, 'DEC': 11
    };
    const fullYear = parseInt(year) + 2000;
    return new Date(fullYear, monthMap[month], parseInt(day));
  }
  
  return new Date(dateStr);
}

// Helper function to extract product type from description
function extractProductType(description: string): string {
  if (!description) return 'Unknown';
  
  const upperDesc = description.toUpperCase();
  if (upperDesc.includes('PSF') || upperDesc.includes('STAPLE FIBER')) return 'PSF';
  if (upperDesc.includes('DTY') || upperDesc.includes('TEXTURED YARN')) return 'DTY';
  if (upperDesc.includes('FDY') || upperDesc.includes('FULLY DRAWN')) return 'FDY';
  if (upperDesc.includes('POY') || upperDesc.includes('PARTIALLY ORIENTED')) return 'POY';
  
  return 'Other';
}

// Helper function to extract denier from description
function extractDenier(description: string): string {
  if (!description) return '';
  
  const match = description.match(/(\d+(?:\.\d+)?)\s*[Dd]/);
  return match ? match[1] : '';
}

export async function loadExcelData(): Promise<ExcelData> {
  try {
    // Load Box in Hand data
    const boxInHandResponse = await fetch('/demodata/TBL_BOXINHAND.xls');
    const boxInHandArrayBuffer = await boxInHandResponse.arrayBuffer();
    const boxInHandWorkbook = XLSX.read(boxInHandArrayBuffer, { type: 'array' });
    const boxInHandSheet = boxInHandWorkbook.Sheets['Export Worksheet'];
    const boxInHandData: BoxInHand[] = XLSX.utils.sheet_to_json(boxInHandSheet);

    // Load Export Orders data
    const exportOrdersResponse = await fetch('/demodata/TBL_SALESORDER_EXPORT.xls');
    const exportOrdersArrayBuffer = await exportOrdersResponse.arrayBuffer();
    const exportOrdersWorkbook = XLSX.read(exportOrdersArrayBuffer, { type: 'array' });
    const exportOrdersSheet = exportOrdersWorkbook.Sheets['Export Worksheet'];
    const exportOrdersData: ExportOrder[] = XLSX.utils.sheet_to_json(exportOrdersSheet);

    // Load Local Orders data
    const localOrdersResponse = await fetch('/demodata/TBL_SALESORDER_LOCAL.xls');
    const localOrdersArrayBuffer = await localOrdersResponse.arrayBuffer();
    const localOrdersWorkbook = XLSX.read(localOrdersArrayBuffer, { type: 'array' });
    const localOrdersSheet = localOrdersWorkbook.Sheets['Export Worksheet'];
    const localOrdersData: LocalOrder[] = XLSX.utils.sheet_to_json(localOrdersSheet);

    return {
      boxInHand: boxInHandData,
      exportOrders: exportOrdersData,
      localOrders: localOrdersData
    };
  } catch (error) {
    console.error('Error loading Excel data:', error);
    throw error;
  }
}

// Helper functions for data analysis
export function getProductSummary(boxInHand: BoxInHand[]) {
  const summary: { [key: string]: { totalBoxes: number; totalWeight: number; avgWeight: number } } = {};
  
  boxInHand.forEach(box => {
    const productKey = `${box.PRODUCTCODE}-${box.DENIER}`;
    if (!summary[productKey]) {
      summary[productKey] = { totalBoxes: 0, totalWeight: 0, avgWeight: 0 };
    }
    summary[productKey].totalBoxes++;
    summary[productKey].totalWeight += box.NETWT || 0;
  });

  // Calculate averages
  Object.keys(summary).forEach(key => {
    summary[key].avgWeight = summary[key].totalWeight / summary[key].totalBoxes;
  });

  return summary;
}

export function getOrderSummary(exportOrders: ExportOrder[], localOrders: LocalOrder[]) {
  const exportSummary = exportOrders.reduce((acc, order) => {
    const productType = extractProductType(order.SOE_PRODUCTDESC);
    if (!acc[productType]) acc[productType] = { quantity: 0, value: 0, count: 0 };
    acc[productType].quantity += order.SOE_QTY || 0;
    acc[productType].value += order.SOE_TOTALAMOUNT || 0;
    acc[productType].count++;
    return acc;
  }, {} as { [key: string]: { quantity: number; value: number; count: number } });

  const localSummary = localOrders.reduce((acc, order) => {
    const productType = extractProductType(order.SOL_PRODUCTDESCRIPTION);
    if (!acc[productType]) acc[productType] = { quantity: 0, value: 0, count: 0 };
    acc[productType].quantity += order.SOL_QTY || 0;
    acc[productType].value += order.SOL_TOTALAMOUNT || 0;
    acc[productType].count++;
    return acc;
  }, {} as { [key: string]: { quantity: number; value: number; count: number } });

  return { export: exportSummary, local: localSummary };
}

export function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}
