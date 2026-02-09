
import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, ChevronRight, Compass, ArrowUpRight, Ticket } from 'lucide-react';
import { BottomNav } from './BottomNav';
import { RewardItem } from '../types';

// Declare Leaflet types globally since we are using CDN
declare const L: any;

interface StoreBranchesOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  offer: RewardItem;
  onHomeClick?: () => void;
  onOffersClick?: () => void;
  onMessagesClick?: () => void;
  onProfileClick?: () => void;
  onScanClick?: () => void;
}

export const StoreBranchesOverlay: React.FC<StoreBranchesOverlayProps> = ({ 
    isOpen, 
    onClose, 
    offer,
    onHomeClick,
    onOffersClick,
    onMessagesClick,
    onProfileClick,
    onScanClick
}) => {
  const [selectedBranchId, setSelectedBranchId] = useState<number>(1);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // Realistic Riyadh Coordinates for Branches
  const branches = [
      { id: 1, name: `${offer.brandName} - فرع القادسية`, address: 'طريق الدمام، حي القادسية، الرياض', distance: '1.66 كم', lat: 24.8115, lng: 46.7640 },
      { id: 2, name: `${offer.brandName} - فرع العليا`, address: 'طريق العليا العام، حي العليا، الرياض', distance: '8.2 كم', lat: 24.6953, lng: 46.6809 },
      { id: 3, name: `${offer.brandName} - فرع النخيل`, address: 'طريق الامام سعود، حي النخيل، الرياض', distance: '12.5 كم', lat: 24.7444, lng: 46.6214 },
  ];

  const selectedBranch = branches.find(b => b.id === selectedBranchId) || branches[0];

  // Initialize Map
  useEffect(() => {
    if (!isOpen || !mapContainerRef.current || mapInstanceRef.current) return;

    // Check if Leaflet is loaded
    if (typeof L === 'undefined') return;

    // 1. Create Map centered on Riyadh
    const map = L.map(mapContainerRef.current, {
        zoomControl: false, // We will add custom zoom buttons or rely on pinch
        attributionControl: false
    }).setView([24.7136, 46.6753], 12);

    mapInstanceRef.current = map;

    // 2. Add Tile Layer (OpenStreetMap - Standard View)
    // Using a light-themed tile provider for a cleaner app look
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
    }).addTo(map);

    // 3. Add Branch Markers
    branches.forEach((branch) => {
        const isActive = branch.id === selectedBranchId;
        
        // Custom HTML Icon
        const iconHtml = `
            <div style="
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: center;
                transform: translate(-50%, -50%);
            ">
                ${isActive ? `
                <div style="background: white; padding: 4px 8px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 6px; white-space: nowrap; border: 1px solid #f3f4f6;">
                    <span style="font-weight: bold; font-size: 10px; color: #111;">${branch.name.split('-')[1] || 'الفرع'}</span>
                </div>` : ''}
                
                <div style="
                    width: ${isActive ? '48px' : '36px'}; 
                    height: ${isActive ? '48px' : '36px'}; 
                    border-radius: 50%; 
                    background: ${isActive ? '#1e1e2e' : 'white'}; 
                    border: ${isActive ? '3px solid white' : '1px solid #ddd'}; 
                    box-shadow: 0 4px 10px rgba(0,0,0,0.2); 
                    display: flex; 
                    align-items: center; 
                    justify-content: center;
                    transition: all 0.3s ease;
                ">
                    <img src="${offer.brandLogo}" style="width: ${isActive ? '24px' : '18px'}; height: ${isActive ? '24px' : '18px'}; object-fit: contain; border-radius: 4px;" />
                </div>
                ${isActive ? `
                <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid #1e1e2e; margin-top: -2px;"></div>
                ` : ''}
            </div>
        `;

        const icon = L.divIcon({
            html: iconHtml,
            className: 'custom-marker-icon', // defined in global css in index.html
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        });

        const marker = L.marker([branch.lat, branch.lng], { icon: icon }).addTo(map);
        
        // Marker Click Event
        marker.on('click', () => {
            setSelectedBranchId(branch.id);
            map.flyTo([branch.lat, branch.lng], 14, { duration: 1 });
        });

        markersRef.current.push({ id: branch.id, marker: marker });
    });

    // Cleanup on unmount
    return () => {
        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
            markersRef.current = [];
        }
    };
  }, [isOpen]);

  // Update Markers visual state when selection changes
  useEffect(() => {
     if (!mapInstanceRef.current) return;
     
     // Re-render markers to update active state styling
     // Note: In a real heavy app, we'd update DOM nodes directly, but here we rebuild icons for simplicity
     markersRef.current.forEach(item => {
         const branch = branches.find(b => b.id === item.id);
         if (!branch) return;

         const isActive = branch.id === selectedBranchId;
         const iconHtml = `
            <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
                ${isActive ? `
                <div style="background: white; padding: 4px 8px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin-bottom: 4px; white-space: nowrap; border: 1px solid #f3f4f6; animation: fadeIn 0.3s;">
                    <span style="font-weight: bold; font-size: 10px; color: #111;">${branch.name.split('-')[1] || 'الفرع'}</span>
                </div>` : ''}
                
                <div style="
                    width: ${isActive ? '48px' : '36px'}; 
                    height: ${isActive ? '48px' : '36px'}; 
                    border-radius: 50%; 
                    background: ${isActive ? '#1e1e2e' : 'white'}; 
                    border: ${isActive ? '3px solid white' : '1px solid #ddd'}; 
                    box-shadow: 0 4px 10px rgba(0,0,0,0.2); 
                    display: flex; 
                    align-items: center; 
                    justify-content: center;
                    z-index: ${isActive ? 100 : 1};
                ">
                    <img src="${offer.brandLogo}" style="width: ${isActive ? '24px' : '18px'}; height: ${isActive ? '24px' : '18px'}; object-fit: contain; border-radius: 4px;" />
                </div>
                ${isActive ? `
                <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid #1e1e2e; margin-top: -2px;"></div>
                ` : ''}
            </div>
        `;
        
        const newIcon = L.divIcon({
            html: iconHtml,
            className: 'custom-marker-icon',
            iconSize: [40, 40],
            iconAnchor: [20, isActive ? 45 : 20]
        });

        item.marker.setIcon(newIcon);
        
        if (isActive) {
            item.marker.setZIndexOffset(1000); // Bring to front
        } else {
            item.marker.setZIndexOffset(0);
        }
     });

  }, [selectedBranchId, branches, offer.brandLogo]);


  // Google Maps Navigation Handler
  const handleNavigate = (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent card click (which zooms map)
      const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedBranch.lat},${selectedBranch.lng}`;
      window.open(url, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-[200] bg-[#e5e3df] flex flex-col font-sans animate-in fade-in duration-300">
      
      {/* Search Bar - Floating Top */}
      <div className="absolute top-12 left-0 right-0 z-20 px-6 flex justify-center pointer-events-none">
          <div className="bg-white/95 backdrop-blur-sm shadow-md rounded-full px-4 py-3 flex items-center gap-2 w-full max-w-xs border border-gray-100 cursor-pointer hover:shadow-lg transition-shadow pointer-events-auto">
              <Search size={18} className="text-gray-400" strokeWidth={2.5} />
              <span className="text-sm font-bold text-gray-600 flex-1 text-right">إبحث في هذه المنطقة</span>
              <div className="w-6 h-6 rounded-full overflow-hidden border border-gray-200">
                  <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" className="w-full h-full object-cover" alt="User" />
              </div>
          </div>
      </div>

      {/* Back Button (Absolute) */}
      <button 
        onClick={onClose}
        className="absolute top-12 right-4 z-20 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm text-gray-800 hover:bg-white transition-colors"
      >
          <ChevronRight size={24} />
      </button>

      {/* Interactive Map Container */}
      <div className="absolute inset-0 z-0 bg-gray-200">
          <div ref={mapContainerRef} className="w-full h-full outline-none" style={{ zIndex: 0 }}></div>
      </div>

      {/* Map Controls */}
      <div className="absolute bottom-52 right-4 z-20 flex flex-col gap-3">
          {/* Reset View / Compass */}
          <button 
             onClick={() => mapInstanceRef.current?.setView([24.7136, 46.6753], 12)}
             className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center text-gray-600 hover:text-gray-900 border border-gray-100 active:scale-95 transition-transform"
          >
              <Compass size={20} strokeWidth={2} />
          </button>
      </div>

      {/* Google Logo Watermark (Simulated for aesthetics) */}
      <div className="absolute bottom-[85px] left-4 z-10 select-none pointer-events-none opacity-80">
           <span className="text-[10px] font-medium text-gray-500 bg-white/50 px-1 rounded">OpenStreetMap</span>
      </div>

      {/* Branch Detail Card (Bottom) */}
      <div className="absolute bottom-[90px] left-4 right-4 z-20 animate-in slide-in-from-bottom-10 duration-500">
          <div className="bg-white rounded-[1.5rem] p-4 shadow-xl border border-gray-100 relative cursor-pointer active:scale-[0.99] transition-transform">
              
              {/* Close Card */}
              <button onClick={() => setSelectedBranchId(0)} className="absolute top-3 left-3 p-1 text-gray-300 hover:text-gray-500 z-10 bg-white/50 rounded-full">
                  <X size={16} />
              </button>

              <div className="flex items-start gap-4">
                  {/* 1. Image Logo (Right Side in RTL) */}
                  <div className="w-16 h-16 bg-white rounded-2xl p-1 shadow-sm border border-gray-100 shrink-0">
                      <img src={offer.brandLogo} alt={offer.brandName} className="w-full h-full object-contain rounded-xl" />
                  </div>

                  {/* 2. Text Details (Middle/Left) */}
                  <div className="flex-1 pt-0.5" onClick={() => {
                       // Zoom to selected branch
                       const b = branches.find(br => br.id === selectedBranchId);
                       if (b && mapInstanceRef.current) mapInstanceRef.current.flyTo([b.lat, b.lng], 15);
                  }}>
                      {/* Name */}
                      <h3 className="font-black text-gray-900 text-sm mb-1 leading-none">
                          {selectedBranch.name}
                      </h3>
                      {/* Address */}
                      <p className="text-[10px] text-gray-500 font-medium mb-2 leading-tight">
                          {selectedBranch.address}
                      </p>

                      {/* Offer Badge (The Offer added to this location) */}
                      <div className="flex items-center gap-1.5 bg-[#6463C7]/5 border border-[#6463C7]/10 rounded-lg px-2 py-1.5 mb-3 w-fit">
                          <Ticket size={10} className="text-[#6463C7]" />
                          <p className="text-[#6463C7] text-[10px] font-bold line-clamp-1">
                              {offer.title}
                          </p>
                      </div>
                      
                      {/* Distance & Directions Row */}
                      <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 bg-gray-50 px-2 py-1.5 rounded-lg border border-gray-100">
                              <span className="text-[10px] font-bold text-gray-700 dir-ltr">{selectedBranch.distance}</span>
                              <MapPin size={10} className="text-gray-400" />
                          </div>
                          
                          {/* Navigate Button */}
                          <button 
                            onClick={handleNavigate}
                            className="flex items-center gap-1.5 bg-[#4285F4] text-white px-3 py-1.5 rounded-lg border border-[#3367d6] shadow-sm hover:bg-[#3367d6] active:scale-95 transition-all"
                          >
                              <span className="text-[10px] font-bold">إتجاهات</span>
                              <ArrowUpRight size={12} strokeWidth={2.5} />
                          </button>
                      </div>
                  </div>
              </div>

          </div>
      </div>

      {/* Bottom Nav - Reused to maintain context */}
      <BottomNav 
        activeTab="offers"
        onHomeClick={onHomeClick}
        onOffersClick={onOffersClick}
        onMessagesClick={onMessagesClick}
        onProfileClick={onProfileClick}
        onScanClick={onScanClick}
      />

    </div>
  );
};
