import React from 'react';
import { useApp } from '../../../context/AppContext.jsx';
import { 
  Globe2,
  Mountain,
  MapPin, 
  Layers, 
  Truck, 
  Activity, 
  TrendingUp,
  Sparkles, 
  Boxes,
  Compass,
  Zap,
  Building,
  Droplet, 
  ShieldAlert, 
  CloudRain, 
  Radio,
  BarChart2,
  AlertTriangle
} from 'lucide-react';

export const GisLayerControls = ({ activeLayers = {}, onToggleLayer }) => {
  const { t, lang } = useApp();

  const layerGroups = [
    {
      group: lang === 'hi' ? 'बेसमैप एवं स्थलाकृति' : lang === 'mr' ? 'बेस-मॅप व भूरूपे' : 'BASEMAP & TOPOGRAPHY',
      items: [
        { id: 'satellite', label: lang === 'hi' ? 'वास्तविक उपग्रह / पृथ्वी' : lang === 'mr' ? 'वास्तविक उपग्रह / पृथ्वी' : 'Real Earth / Satellite', icon: Globe2, color: 'text-sky-400' },
        { id: 'terrain', label: lang === 'hi' ? 'स्थलाकृतिक कंटूर' : lang === 'mr' ? 'भूरूप कंटूर' : 'Topographic Contours', icon: Mountain, color: 'text-amber-400' },
        { id: 'boundary', label: lang === 'hi' ? 'खदान पट्टा सीमा' : lang === 'mr' ? 'खाण पट्टा सीमा' : 'Mine Lease Boundary', icon: MapPin, color: 'text-amber-500' }
      ]
    },
    {
      group: lang === 'hi' ? 'खदान अवसंरचना' : lang === 'mr' ? 'खाण पायाभूत सुविधा' : 'MINE INFRASTRUCTURE',
      items: [
        { id: 'benches', label: lang === 'hi' ? 'बेंच एवं उत्खनन स्तर' : lang === 'mr' ? 'बेंच व उत्खनन स्तर' : 'Benches & Extraction Levels', icon: Layers, color: 'text-emerald-400' },
        { id: 'haulRoads', label: lang === 'hi' ? 'ढुलाई सड़कें एवं प्रवाह' : lang === 'mr' ? 'वाहतूक रस्ते व प्रवाह' : 'Haul Roads & Speed Flow', icon: Activity, color: 'text-yellow-400' },
        { id: 'shafts', label: lang === 'hi' ? 'शाफ्ट एवं हेडफ्रेम होइस्ट' : lang === 'mr' ? 'शाफ्ट व हेडफ्रेम होइस्ट' : 'Shafts & Headframe Hoists', icon: Building, color: 'text-blue-400' },
        { id: 'crusher', label: lang === 'hi' ? 'प्राथमिक साइजिंग क्रशर' : lang === 'mr' ? 'प्राथमिक क्रशर स्टेशन' : 'Primary Sizing Crushers', icon: Zap, color: 'text-purple-400' },
        { id: 'stockpile', label: lang === 'hi' ? 'आरओएम एवं मिश्रण स्टॉकपाइल' : lang === 'mr' ? 'आरओएम व साठा स्टॉकपाइल' : 'ROM & Blending Stockpiles', icon: Boxes, color: 'text-orange-400' },
        { id: 'sump', label: lang === 'hi' ? 'सम्प एवं डीवाटरिंग नेटवर्क' : lang === 'mr' ? 'सम्प व उपसा नेटवर्क' : 'Sump & Dewatering Network', icon: Droplet, color: 'text-teal-400' },
        { id: 'infrastructure', label: lang === 'hi' ? 'कार्यशालाएं एवं संयंत्र' : lang === 'mr' ? 'कार्यशाळा व संयंत्र' : 'Workshops & Plant Facilities', icon: Building, color: 'text-zinc-400' }
      ]
    },
    {
      group: lang === 'hi' ? 'भूविज्ञान एवं फ्लीट संचालन' : lang === 'mr' ? 'भूशास्त्र व फ्लीट ऑपरेशन्स' : 'GEOLOGY & FLEET OPERATIONS',
      items: [
        { id: 'oreZones', label: lang === 'hi' ? 'ब्राउनाइट अयस्क शिरा' : lang === 'mr' ? 'ब्राउनाइट खनिज स्तर' : 'Braunite Ore Vein Reef', icon: Sparkles, color: 'text-amber-300' },
        { id: 'geology', label: lang === 'hi' ? 'भूवैज्ञानिक संरचनाएं' : lang === 'mr' ? 'भूगर्भीय रचना' : 'Geological Formations', icon: Compass, color: 'text-indigo-400' },
        { id: 'equipment', label: lang === 'hi' ? 'मोबाइल फ्लीट मशीनरी' : lang === 'mr' ? 'मोबाईल फ्लीट यंत्रसामग्री' : 'Mobile Fleet & Silhouettes', icon: Truck, color: 'text-emerald-300' },
        { id: 'telemetry', label: lang === 'hi' ? 'आईओटी पीजोमीटर व जियोफोन' : lang === 'mr' ? 'आयओटी पिझोमीटर व सेन्सर' : 'IoT Piezometer & Geophones', icon: Radio, color: 'text-cyan-400' },
        { id: 'production', label: lang === 'hi' ? 'सक्रिय उत्पादन ब्लास्ट' : lang === 'mr' ? 'सक्रिय उत्पादन ब्लास्ट' : 'Active Production Blasts', icon: BarChart2, color: 'text-lime-400' },
        { id: 'riskZones', label: lang === 'hi' ? 'ढलान स्थिरता एवं भू-जोखिम' : lang === 'mr' ? 'उतार स्थिरता व भू-जोखीम' : 'Stability & Geotech Risk', icon: ShieldAlert, color: 'text-rose-400' },
        { id: 'weather', label: lang === 'hi' ? 'लाइव मौसम एवं वर्षा प्रवाह' : lang === 'mr' ? 'थेट हवामान व पाऊस प्रवाह' : 'Live Weather & Rain Inflow', icon: CloudRain, color: 'text-blue-300' }
      ]
    }
  ];

  return (
    <div className="p-3 rounded-2xl bg-[#090e17]/95 border border-[#1a2538] backdrop-blur-md space-y-3 font-mono text-[11px] select-none max-h-[460px] overflow-y-auto custom-scrollbar shadow-2xl">
      <div className="flex items-center justify-between pb-2 border-b border-[#141c2b] text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
        <span>{lang === 'hi' ? 'जीआईएस इंजीनियरिंग परतें (18)' : lang === 'mr' ? 'जीआयएस अभियांत्रिकी स्तर (18)' : 'GIS ENGINEERING LAYERS (18)'}</span>
        <span className="px-1.5 py-0.5 rounded bg-sky-950/80 text-sky-400 border border-sky-800 text-[9px]">
          {lang === 'hi' ? 'इंटरैक्टिव' : lang === 'mr' ? 'इंटरअॅक्टिव्ह' : 'INTERACTIVE'}
        </span>
      </div>

      <div className="space-y-3">
        {layerGroups.map((grp) => (
          <div key={grp.group} className="space-y-1">
            <div className="text-[9px] font-bold tracking-widest text-zinc-500 uppercase px-1">
              {grp.group}
            </div>
            <div className="space-y-0.5">
              {grp.items.map((l) => {
                const Icon = l.icon;
                const isActive = activeLayers[l.id] ?? true;
                return (
                  <button
                    key={l.id}
                    onClick={() => onToggleLayer(l.id)}
                    className={`w-full px-2 py-1.5 rounded-lg flex items-center justify-between transition-all ${
                      isActive
                        ? 'bg-[#131d2e] text-zinc-100 border border-[#1e2d44]'
                        : 'text-zinc-500 hover:text-zinc-300 hover:bg-[#0c121c] border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? l.color : 'text-zinc-600'}`} />
                      <span className="truncate text-[10.5px]">{l.label}</span>
                    </div>
                    <div className={`w-2 h-2 rounded-full transition-all ${
                      isActive ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-zinc-700'
                    }`} />
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
