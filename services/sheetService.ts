import { SubstituteHistoryItem } from '../types';

export const SHEET_CONFIG_KEY = 'smartsub_sheet_config';

export interface SheetConfig {
  spreadsheetId: string;
  apiKey: string;
  accessToken?: string; // Required for writing/private sheets
}

export const getSheetConfig = (): SheetConfig | null => {
  const stored = localStorage.getItem(SHEET_CONFIG_KEY);
  if (stored) return JSON.parse(stored);
  // Fallback to env vars if available
  if (process.env.GOOGLE_SHEETS_ID && process.env.GOOGLE_SHEETS_API_KEY) {
      return {
          spreadsheetId: process.env.GOOGLE_SHEETS_ID,
          apiKey: process.env.GOOGLE_SHEETS_API_KEY
      };
  }
  return null;
};

export const saveSheetConfig = (config: SheetConfig) => {
  localStorage.setItem(SHEET_CONFIG_KEY, JSON.stringify(config));
};

export const SheetService = {
  async getSubstituteHistory(): Promise<SubstituteHistoryItem[] | null> {
    const config = getSheetConfig();
    if (!config || !config.spreadsheetId || !config.apiKey) return null;

    try {
      // Assuming 'History' is the sheet name and columns match expected order
      // A1 Notation: History!A2:G
      const range = 'History!A2:G';
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values/${range}?key=${config.apiKey}`;
      
      const headers: HeadersInit = {};
      if (config.accessToken) {
          headers['Authorization'] = `Bearer ${config.accessToken}`;
      }

      const response = await fetch(url, { headers });
      if (!response.ok) throw new Error('Failed to fetch from sheets');
      
      const data = await response.json();
      if (!data.values) return [];

      // Map rows to SubstituteHistoryItem
      // Assuming columns: ID, Date, Period, Subject, TeacherID, SubstituteID, Status
      return data.values.map((row: string[]) => ({
        id: row[0],
        date: row[1],
        period: row[2],
        subject: row[3],
        teacher_id: row[4],
        substitute_id: row[5],
        status: (row[6] === 'completed' || row[6] === 'cancelled') ? row[6] as 'completed' | 'cancelled' : 'completed'
      }));
    } catch (error) {
      console.error("Sheet API Error:", error);
      return null;
    }
  },

  async testConnection(config: SheetConfig): Promise<boolean> {
      try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}?key=${config.apiKey}`;
        const headers: HeadersInit = {};
        if (config.accessToken) {
            headers['Authorization'] = `Bearer ${config.accessToken}`;
        }
        const response = await fetch(url, { headers });
        return response.ok;
      } catch (e) {
          return false;
      }
  }
};