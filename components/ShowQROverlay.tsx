
import React from 'react';
import { X, QrCode, Copy, Share2 } from 'lucide-react';
import { MOCK_USER } from '../constants';

interface ShowQROverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShowQROverlay: React.FC<ShowQROverlayProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-[300] bg-white flex flex-col items-center justify-center animate-in fade-in duration-300 px-6 text-center font-sans">
        <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-gray-50 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
        >
            <X size={24} />
        </button>

        <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-[#6463C7] to-[#9f99e6] mb-4 shadow-xl">
            <img src={MOCK_USER.avatar} alt="User" className="w-full h-full rounded-full object-cover border-4 border-white" />
        </div>
        <h2 className="text-xl font-black text-gray-900 mb-1">{MOCK_USER.name}</h2>
        <p className="text-sm text-gray-400 font-bold mb-8">عضو ذهبي</p>

        <div className="bg-white p-6 rounded-[2.5rem] shadow-2xl shadow-purple-200/50 border border-purple-50 mb-8 relative">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gray-200 rounded-b-lg"></div>
             <QrCode size={200} className="text-gray-900" />
             <p className="mt-4 text-xs font-bold text-[#6463C7] bg-[#6463C7]/5 py-2 rounded-lg tracking-widest dir-ltr">SOUQ-USER-849021</p>
        </div>

        <h3 className="text-lg font-black text-gray-900 mb-2">عرض QR</h3>
        <p className="text-sm text-gray-500 max-w-[250px] leading-relaxed font-medium">
            اطلب من المشتري مسح الكود أعلاه لتوثيق عملية البيع واكتساب النقاط فوراً
        </p>

        <div className="flex gap-4 mt-8 w-full max-w-xs">
            <button 
                onClick={() => alert('تم نسخ رابط الكود')}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-50 py-3 rounded-2xl font-bold text-gray-700 hover:bg-gray-100 transition-colors"
            >
                <Copy size={18} />
                <span>نسخ</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 bg-[#6463C7] py-3 rounded-2xl font-bold text-white hover:bg-[#5352a3] transition-colors shadow-lg shadow-[#6463C7]/20">
                <Share2 size={18} />
                <span>مشاركة</span>
            </button>
        </div>
    </div>
  );
};
