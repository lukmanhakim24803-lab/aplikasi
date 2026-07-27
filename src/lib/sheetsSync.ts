import { PembiayaanItem } from '../types';

const SPREADSHEET_TITLE = 'Database Pembiayaan BMT UGT Pasirian';

export interface SheetSyncResult {
  spreadsheetId: string;
  spreadsheetUrl: string;
  updatedRange: string;
  rowCount: number;
}

/**
 * Find existing Spreadsheet in Google Drive
 */
export async function findSpreadsheetId(accessToken: string): Promise<string | null> {
  try {
    const query = encodeURIComponent(
      `name = '${SPREADSHEET_TITLE}' and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false`
    );
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id, name, webViewLink)`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) return null;
    const data = await response.json();
    if (data.files && data.files.length > 0) {
      return data.files[0].id;
    }
    return null;
  } catch (error) {
    console.error('Error finding Spreadsheet:', error);
    return null;
  }
}

/**
 * Create new Google Spreadsheet
 */
export async function createSpreadsheet(accessToken: string): Promise<{ id: string; url: string } | null> {
  try {
    const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: {
          title: SPREADSHEET_TITLE,
        },
        sheets: [
          {
            properties: {
              title: 'Data Pembiayaan',
            },
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error('Failed to create spreadsheet:', await response.text());
      return null;
    }

    const data = await response.json();
    return {
      id: data.spreadsheetId,
      url: data.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${data.spreadsheetId}/edit`,
    };
  } catch (error) {
    console.error('Create Spreadsheet Error:', error);
    return null;
  }
}

/**
 * Export/Sync list of Pembiayaan to Google Sheets
 */
export async function exportToGoogleSheets(
  accessToken: string,
  pembiayaanList: PembiayaanItem[]
): Promise<SheetSyncResult | null> {
  try {
    let spreadsheetId = await findSpreadsheetId(accessToken);
    let spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

    if (!spreadsheetId) {
      const created = await createSpreadsheet(accessToken);
      if (!created) return null;
      spreadsheetId = created.id;
      spreadsheetUrl = created.url;
    }

    // Build Rows
    const headers = [
      'ID Pembiayaan',
      'No. Rekening',
      'Nama Anggota',
      'Nomor WhatsApp',
      'Alamat',
      'Jenis Akad',
      'Plafond (Rp)',
      'Sisa Angsuran (Rp)',
      'Angsuran / Bln (Rp)',
      'Jatuh Tempo',
      'Status Kolektibilitas',
    ];

    const rows = pembiayaanList.map((item) => [
      item.id,
      item.noRekening,
      item.namaAnggota,
      item.nomorWA,
      item.alamat,
      item.jenisPembiayaan,
      item.plafond,
      item.sisaAngsuran,
      item.angsuranPerBulan,
      item.jatuhTempo,
      item.statusKolektibilitas,
    ]);

    const values = [headers, ...rows];

    // Clear and write to range 'Data Pembiayaan!A1'
    const updateResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Data Pembiayaan!A1:K${values.length}?valueInputOption=USER_ENTERED`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          range: `Data Pembiayaan!A1:K${values.length}`,
          majorDimension: 'ROWS',
          values: values,
        }),
      }
    );

    if (!updateResponse.ok) {
      console.error('Failed to update sheet values:', await updateResponse.text());
      return null;
    }

    const resData = await updateResponse.json();
    return {
      spreadsheetId,
      spreadsheetUrl,
      updatedRange: resData.updatedRange || 'Data Pembiayaan!A1',
      rowCount: pembiayaanList.length,
    };
  } catch (error) {
    console.error('Export Google Sheets Error:', error);
    return null;
  }
}

/**
 * Import data from Google Sheets back into application
 */
export async function importFromGoogleSheets(
  accessToken: string
): Promise<PembiayaanItem[] | null> {
  try {
    const spreadsheetId = await findSpreadsheetId(accessToken);
    if (!spreadsheetId) return null;

    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Data Pembiayaan!A2:K100`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) return null;
    const data = await response.json();
    if (!data.values || data.values.length === 0) return null;

    const importedItems: PembiayaanItem[] = data.values.map((row: any[], index: number) => ({
      id: row[0] || `PB-IMP-${index + 1}`,
      noRekening: row[1] || `108.02.${100 + index}`,
      namaAnggota: row[2] || 'Anggota tanpa nama',
      nomorWA: row[3] || '081234567890',
      alamat: row[4] || 'Pasirian',
      jenisPembiayaan: (row[5] as any) || 'Murabahah',
      plafond: Number(row[6]) || 0,
      sisaAngsuran: Number(row[7]) || 0,
      angsuranPerBulan: Number(row[8]) || 0,
      jatuhTempo: row[9] || '2026-08-10',
      statusKolektibilitas: (row[10] as any) || 'Lancar',
      tunggakanBulan: 0,
    }));

    return importedItems;
  } catch (error) {
    console.error('Import Google Sheets Error:', error);
    return null;
  }
}
