import React, { useState, useEffect, useRef } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Save, Database, CheckCircle, XCircle, Link, FileSpreadsheet, Upload, Download, RefreshCw } from 'lucide-react';
import { getSheetConfig, saveSheetConfig, SheetService, SheetConfig } from '../services/sheetService';
import { ExcelService } from '../services/excelService';

export const Settings: React.FC = () => {
  const [config, setConfig] = useState<SheetConfig>({ spreadsheetId: '', apiKey: '', accessToken: '' });
  const [dataSource, setDataSource] = useState<'mock' | 'sheets' | 'excel'>('mock');
  const [sheetStatus, setSheetStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [excelStatus, setExcelStatus] = useState<'idle' | 'importing' | 'success' | 'error'>('idle');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedConfig = getSheetConfig();
    if (storedConfig) setConfig(storedConfig);
    
    const storedSource = localStorage.getItem('smartsub_data_source');
    if (storedSource) setDataSource(storedSource as any);
  }, []);

  const handleSaveConfig = () => {
    saveSheetConfig(config);
    localStorage.setItem('smartsub_data_source', dataSource);
    setSheetStatus('idle');
    // If sheets is selected, test immediately
    if (dataSource === 'sheets') {
        handleTestSheet();
    }
  };

  const handleTestSheet = async () => {
    setSheetStatus('testing');
    const success = await SheetService.testConnection(config);
    setSheetStatus(success ? 'success' : 'error');
  };

  const handleDataSourceChange = (source: 'mock' | 'sheets' | 'excel') => {
      setDataSource(source);
      localStorage.setItem('smartsub_data_source', source);
  };

  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setExcelStatus('importing');
      try {
          await ExcelService.importData(file);
          setExcelStatus('success');
          // Automatically switch to Excel mode upon successful import
          handleDataSourceChange('excel');
      } catch (error) {
          setExcelStatus('error');
      }
  };

  const handleDownloadTemplate = () => {
      ExcelService.exportData(ExcelService.getTemplateData() as any);
  };

  const handleExportData = () => {
      const data = ExcelService.getLocalData();
      if (data && data.length > 0) {
          ExcelService.exportData(data);
      } else {
          alert("ไม่มีข้อมูลใน Local Database ให้ส่งออก");
      }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">ตั้งค่าระบบ (Settings)</h2>

      {/* Data Source Selection */}
      <Card title="เลือกแหล่งข้อมูล (Data Source)" icon={<Database />}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div 
                  onClick={() => handleDataSourceChange('mock')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${dataSource === 'mock' ? 'bg-[#7aa2ff]/10 border-[#7aa2ff] text-white' : 'bg-[#0b0e1a] border-[#242c47] text-[#a7b0c9] hover:border-[#7aa2ff]/50'}`}
              >
                  <RefreshCw size={24} />
                  <span className="font-semibold">Mock Data</span>
                  <span className="text-xs opacity-70">ข้อมูลตัวอย่างในระบบ</span>
              </div>
              
              <div 
                  onClick={() => handleDataSourceChange('sheets')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${dataSource === 'sheets' ? 'bg-[#7aa2ff]/10 border-[#7aa2ff] text-white' : 'bg-[#0b0e1a] border-[#242c47] text-[#a7b0c9] hover:border-[#7aa2ff]/50'}`}
              >
                  <Link size={24} />
                  <span className="font-semibold">Google Sheets</span>
                  <span className="text-xs opacity-70">เชื่อมต่อ API ออนไลน์</span>
              </div>

              <div 
                  onClick={() => handleDataSourceChange('excel')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${dataSource === 'excel' ? 'bg-[#7aa2ff]/10 border-[#7aa2ff] text-white' : 'bg-[#0b0e1a] border-[#242c47] text-[#a7b0c9] hover:border-[#7aa2ff]/50'}`}
              >
                  <FileSpreadsheet size={24} />
                  <span className="font-semibold">Excel (Offline)</span>
                  <span className="text-xs opacity-70">นำเข้าไฟล์ .xlsx</span>
              </div>
          </div>
      </Card>
      
      {/* Google Sheets Config Section */}
      {dataSource === 'sheets' && (
        <Card title="ตั้งค่า Google Sheets API" className="animate-fadeIn">
            <div className="space-y-4 max-w-2xl">
            <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-sm text-indigo-300">
                คุณสามารถเชื่อมต่อ Google Sheets เพื่อใช้เป็นฐานข้อมูลสำหรับเก็บประวัติการสอนแทนได้ 
                โดยต้องระบุ Spreadsheet ID และ API Key
            </div>

            <div>
                <label className="block text-sm font-medium text-[#a7b0c9] mb-1">Spreadsheet ID</label>
                <input 
                    type="text" 
                    className="w-full bg-[#0b0e1a] border border-[#242c47] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#7aa2ff] text-[#e9edff]"
                    placeholder="เช่น 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                    value={config.spreadsheetId}
                    onChange={e => setConfig({...config, spreadsheetId: e.target.value})}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-[#a7b0c9] mb-1">API Key</label>
                <input 
                    type="password" 
                    className="w-full bg-[#0b0e1a] border border-[#242c47] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#7aa2ff] text-[#e9edff]"
                    placeholder="Google Cloud API Key"
                    value={config.apiKey}
                    onChange={e => setConfig({...config, apiKey: e.target.value})}
                />
            </div>

            <div className="flex items-center gap-3 mt-4">
                <Button onClick={handleSaveConfig} variant="primary">
                    <Save size={18} className="mr-2" /> บันทึกและทดสอบ
                </Button>
                
                {sheetStatus === 'testing' && <span className="text-[#a7b0c9] text-sm animate-pulse">กำลังทดสอบ...</span>}
                {sheetStatus === 'success' && (
                    <span className="text-emerald-400 flex items-center text-sm font-medium animate-fadeIn">
                        <CheckCircle size={18} className="mr-1" /> เชื่อมต่อสำเร็จ
                    </span>
                )}
                {sheetStatus === 'error' && (
                    <span className="text-red-400 flex items-center text-sm font-medium animate-fadeIn">
                        <XCircle size={18} className="mr-1" /> เชื่อมต่อล้มเหลว
                    </span>
                )}
            </div>
            </div>
        </Card>
      )}

      {/* Excel Config Section */}
      {dataSource === 'excel' && (
          <Card title="จัดการฐานข้อมูล Excel (Offline)" className="animate-fadeIn">
             <div className="space-y-6">
                 <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-sm text-emerald-300">
                    ข้อมูลจะถูกเก็บไว้ใน Browser (LocalStorage) หลังจากนำเข้าไฟล์ .xlsx 
                    คุณสามารถส่งออกข้อมูลเป็นไฟล์ Excel ได้ตลอดเวลา
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-3 border-r border-[#242c47] pr-6">
                        <h4 className="text-white font-medium flex items-center gap-2"><Upload size={18}/> นำเข้าข้อมูล (Import)</h4>
                        <p className="text-xs text-[#a7b0c9]">อัพโหลดไฟล์ .xlsx ที่มีคอลัมน์: ID, Date, Period, Subject, TeacherID, SubstituteID, Status</p>
                        
                        <div className="flex gap-2">
                           <input 
                             type="file" 
                             ref={fileInputRef}
                             className="hidden" 
                             accept=".xlsx, .xls"
                             onChange={handleExcelUpload}
                           />
                           <Button onClick={() => fileInputRef.current?.click()} variant="secondary" isLoading={excelStatus === 'importing'}>
                               เลือกไฟล์ Excel
                           </Button>
                           <Button onClick={handleDownloadTemplate} variant="ghost" size="sm" className="text-xs">
                               ดาวน์โหลด Template
                           </Button>
                        </div>
                        {excelStatus === 'success' && (
                            <div className="text-emerald-400 text-sm mt-2 flex items-center">
                                <CheckCircle size={16} className="mr-1" /> นำเข้าข้อมูลเรียบร้อยแล้ว
                            </div>
                        )}
                        {excelStatus === 'error' && (
                            <div className="text-red-400 text-sm mt-2 flex items-center">
                                <XCircle size={16} className="mr-1" /> เกิดข้อผิดพลาดในการอ่านไฟล์
                            </div>
                        )}
                     </div>

                     <div className="space-y-3 pl-2">
                        <h4 className="text-white font-medium flex items-center gap-2"><Download size={18}/> ส่งออกข้อมูล (Export)</h4>
                        <p className="text-xs text-[#a7b0c9]">ดาวน์โหลดข้อมูลปัจจุบันในระบบออกมาเป็นไฟล์ Excel</p>
                        <Button onClick={handleExportData} variant="primary">
                            Download .xlsx
                        </Button>
                     </div>
                 </div>
             </div>
          </Card>
      )}

      <Card title="โครงสร้างข้อมูล (Schema Guide)">
         <div className="text-sm text-[#a7b0c9]">
            <p className="mb-2">ไม่ว่าจะใช้ Google Sheets หรือ Excel กรุณาใช้โครงสร้างคอลัมน์ดังนี้:</p>
            <div className="bg-[#0b0e1a] p-3 rounded border border-[#242c47] font-mono text-xs overflow-x-auto">
               | ID | Date | Period | Subject | TeacherID | SubstituteID | Status |
            </div>
         </div>
      </Card>
    </div>
  );
};