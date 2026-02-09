
import React from 'react';
import { X, Percent, QrCode, Check } from 'lucide-react';

interface ScannerOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    onScanSuccess?: () => void;
}

export const ScannerOverlay: React.FC<ScannerOverlayProps> = ({ isOpen, onClose, onScanSuccess }) => {
    if (!isOpen) return null;

    const handleSimulatedScan = () => {
        // Simulate scanning delay
        setTimeout(() => {
            if (onScanSuccess) {
                onScanSuccess();
            } else {
                onClose();
            }
        }, 800);
    };

    return (
        <div className="absolute inset-0 z-[300] bg-[#6463C7] flex flex-col items-center justify-between py-10 px-6 text-white font-sans animate-in fade-in duration-300">
             <style>{`
               @keyframes scanLine {
                 0% { top: 10%; opacity: 0; }
                 10% { opacity: 1; }
                 90% { opacity: 1; }
                 100% { top: 90%; opacity: 0; }
               }
             `}</style>

             {/* Close Button */}
             <button 
                onClick={onClose} 
                className="absolute top-8 left-6 hover:bg-white/10 p-2 rounded-full transition-colors"
             >
                 <X size={32} strokeWidth={2.5} />
             </button>

             {/* Header Icon & Text */}
             <div className="flex flex-col items-center mt-12">
                <div className="relative mb-6">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-[#6463C7] relative z-10 shadow-lg">
                        <Percent size={48} strokeWidth={3} />
                    </div>
                    <div className="absolute inset-0 -m-2 border-2 border-dashed border-white/40 rounded-full animate-spin-slow" style={{ animationDuration: '10s' }}></div>
                </div>

                <h2 className="text-2xl font-black mb-2 tracking-wide">مسح كود المتجر / البائع</h2>
                <p className="text-white/90 font-medium text-sm tracking-wide">وجه الكاميرا نحو رمز QR لإتمام العملية</p>
             </div>

             {/* QR Scanning Area */}
             <div className="relative w-72 h-72 bg-white/10 rounded-[2rem] p-6 flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-2xl">
                 <div className="absolute top-4 left-4 w-8 h-8 border-t-[5px] border-l-[5px] border-white rounded-tl-2xl"></div>
                 <div className="absolute top-4 right-4 w-8 h-8 border-t-[5px] border-r-[5px] border-white rounded-tr-2xl"></div>
                 <div className="absolute bottom-4 left-4 w-8 h-8 border-b-[5px] border-l-[5px] border-white rounded-bl-2xl"></div>
                 <div className="absolute bottom-4 right-4 w-8 h-8 border-b-[5px] border-r-[5px] border-white rounded-br-2xl"></div>

                 <div className="bg-white p-3 rounded-2xl w-full h-full flex items-center justify-center shadow-inner">
                     <QrCode size={180} className="text-[#1a1a1a]" strokeWidth={1.5} />
                 </div>

                 <div className="absolute left-8 right-8 h-1.5 bg-[#b5b0ff]/80 shadow-[0_0_15px_rgba(181,176,255,0.6)] rounded-full" 
                      style={{ animation: 'scanLine 2.5s ease-in-out infinite' }}>
                 </div>
             </div>

             <div className="-mt-8 text-center">
                 <h3 className="text-xl font-bold opacity-90">جاري المسح...</h3>
             </div>

             <div className="w-full space-y-6 mb-4">
                <button 
                    onClick={handleSimulatedScan}
                    className="w-full bg-white text-[#6463C7] font-black text-lg py-4 rounded-2xl shadow-xl hover:shadow-2xl active:scale-[0.98] transition-all"
                >
                    محاكاة مسح الكود
                </button>
                
                <p className="text-[10px] text-center text-white/70 font-medium">
                    خاضع للشروط و الاحكام المتفق عليها بين الاطراف
                </p>
             </div>
          </div>
    );
};
