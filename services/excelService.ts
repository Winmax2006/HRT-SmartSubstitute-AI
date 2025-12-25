import * as XLSX from 'xlsx';
import { SubstituteHistoryItem } from '../types';

export const LOCAL_DB_KEY = 'smartsub_local_db';

// Helper to handle both named exports and default export structure
const getXLSX = () => {
    // @ts-ignore
    const lib = XLSX.default || XLSX;
    return lib;
};

export const ExcelService = {
  importData: async (file: File): Promise<SubstituteHistoryItem[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const lib = getXLSX();
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = lib.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = lib.utils.sheet_to_json(worksheet, { header: 1 });
          
          // Assuming Header Row is row 0: ID, Date, Period, Subject, TeacherID, SubstituteID, Status
          // Data starts from row 1
          const rows = jsonData.slice(1) as any[][];
          
          const historyItems: SubstituteHistoryItem[] = rows.map((row) => ({
             id: String(row[0] || ''),
             date: String(row[1] || ''),
             period: String(row[2] || ''),
             subject: String(row[3] || ''),
             teacher_id: String(row[4] || ''),
             substitute_id: String(row[5] || ''),
             status: (row[6] === 'completed' || row[6] === 'cancelled') ? row[6] as 'completed' | 'cancelled' : 'completed'
          })).filter(item => item.id && item.date); // Simple validation

          // Save to local storage to persist the "Database"
          localStorage.setItem(LOCAL_DB_KEY, JSON.stringify(historyItems));
          resolve(historyItems);
        } catch (error) {
          console.error("Excel Parse Error:", error);
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  },

  getLocalData: (): SubstituteHistoryItem[] | null => {
      const data = localStorage.getItem(LOCAL_DB_KEY);
      return data ? JSON.parse(data) : null;
  },

  exportData: (data: SubstituteHistoryItem[]) => {
      const lib = getXLSX();
      // Format data for export (matching the import expectation)
      const exportRows = data.map(item => ({
          ID: item.id,
          Date: item.date,
          Period: item.period,
          Subject: item.subject,
          TeacherID: item.teacher_id,
          SubstituteID: item.substitute_id,
          Status: item.status
      }));

      const worksheet = lib.utils.json_to_sheet(exportRows);
      const workbook = lib.utils.book_new();
      lib.utils.book_append_sheet(workbook, worksheet, "History");
      lib.writeFile(workbook, "SubstituteHistory.xlsx");
  },

  getTemplateData: () => {
      return [
          {
              ID: "h-001",
              Date: "2023-10-25",
              Period: "1",
              Subject: "Math",
              TeacherID: "T001",
              SubstituteID: "T002",
              Status: "completed"
          }
      ];
  }
};