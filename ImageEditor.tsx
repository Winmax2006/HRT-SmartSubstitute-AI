import React, { useState, useRef } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { editImage } from '../services/geminiService';
import { Upload, Image as ImageIcon, Wand2, Download, AlertCircle } from 'lucide-react';

export const ImageEditor: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResultImage(null); // Reset result when new image uploaded
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!image || !prompt) return;
    setIsProcessing(true);
    setResultImage(null);
    try {
      const result = await editImage(image, prompt);
      if (result) {
        setResultImage(result);
      }
    } catch (error) {
      alert("Failed to edit image. Check API key or quotas.");
    }
    setIsProcessing(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">แต่งรูปด้วย AI (Nano Banana)</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Input Section */}
         <Card title="อัพโหลดรูปภาพ" icon={<Upload />}>
            <div className="space-y-4">
               <div 
                 onClick={() => fileInputRef.current?.click()}
                 className="border-2 border-dashed border-[#242c47] hover:border-[#7aa2ff] rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors min-h-[250px]"
               >
                  {image ? (
                    <img src={image} alt="Original" className="max-h-[200px] object-contain rounded-lg shadow-md" />
                  ) : (
                    <>
                      <ImageIcon size={48} className="text-[#a7b0c9] mb-4" />
                      <p className="text-[#a7b0c9] font-medium">คลิกเพื่ออัพโหลดรูปภาพ</p>
                      <p className="text-xs text-[#a7b0c9]/60 mt-2">รองรับ PNG, JPG</p>
                    </>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                  />
               </div>

               <div>
                 <label className="block text-sm font-medium text-[#a7b0c9] mb-2">คำสั่ง (Prompt)</label>
                 <textarea 
                   className="w-full bg-[#0b0e1a] border border-[#242c47] rounded-lg p-3 text-sm focus:outline-none focus:border-[#7aa2ff] min-h-[100px]"
                   placeholder="เช่น เปลี่ยนพื้นหลังเป็นห้องเรียน, ทำให้ภาพดูเก่าแบบ retro, ลบวัตถุสีแดงออก..."
                   value={prompt}
                   onChange={(e) => setPrompt(e.target.value)}
                 />
               </div>

               <Button 
                 className="w-full" 
                 onClick={handleEdit} 
                 disabled={!image || !prompt || isProcessing}
                 isLoading={isProcessing}
               >
                 <Wand2 size={18} className="mr-2" /> สร้างสรรค์ภาพใหม่
               </Button>
            </div>
         </Card>

         {/* Result Section */}
         <Card title="ผลลัพธ์" icon={<Wand2 />}>
            <div className="h-full min-h-[400px] flex flex-col">
               <div className="flex-1 bg-[#0b0e1a] border border-[#242c47] rounded-xl flex items-center justify-center overflow-hidden p-4">
                  {isProcessing ? (
                    <div className="text-center">
                       <div className="animate-spin w-12 h-12 border-4 border-[#7aa2ff] border-t-transparent rounded-full mx-auto mb-4"></div>
                       <p className="text-[#a7b0c9]">กำลังประมวลผลด้วย Gemini 2.5...</p>
                    </div>
                  ) : resultImage ? (
                    <img src={resultImage} alt="Result" className="max-h-full max-w-full object-contain rounded-lg shadow-lg" />
                  ) : (
                    <p className="text-[#a7b0c9]/60 text-sm">ภาพผลลัพธ์จะแสดงที่นี่</p>
                  )}
               </div>
               
               {resultImage && (
                 <div className="mt-4 flex justify-end">
                    <a href={resultImage} download="edited-image.png" className="w-full">
                       <Button variant="success" className="w-full">
                          <Download size={18} className="mr-2" /> ดาวน์โหลดรูปภาพ
                       </Button>
                    </a>
                 </div>
               )}

               <div className="mt-4 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg flex gap-3">
                  <AlertCircle size={20} className="text-indigo-400 shrink-0" />
                  <p className="text-xs text-indigo-300">
                     หมายเหตุ: ฟีเจอร์นี้ใช้ Gemini 2.5 Flash Image. ผลลัพธ์อาจแตกต่างกันไปตามความซับซ้อนของคำสั่ง
                  </p>
               </div>
            </div>
         </Card>
      </div>
    </div>
  );
};