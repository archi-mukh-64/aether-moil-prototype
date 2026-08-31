import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import {
  UserCheck,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Zap,
  FileText,
  Clock,
  Sliders
} from 'lucide-react';

export const HumanDecision = () => {
  const { activeScenario, decisionStage, approveScenario, modifyScenario, rejectScenario, t, lang } = useApp();
  const [operatorName, setOperatorName] = useState('S. Sharma (Mine Controller)');
  const [operatorNotes, setOperatorNotes] = useState('');
  const [customParams, setCustomParams] = useState('');
  const [isModifying, setIsModifying] = useState(false);

  const scen = t?.scenarioLab || {};
  const comm = t?.common || {};
  const ws = t?.workspace || {};

  if (!activeScenario) return null;

  const isApproved = decisionStage === 'APPROVED';
  const isModified = decisionStage === 'MODIFIED';
  const isRejected = decisionStage === 'REJECTED';

  const handleApprove = () => {
    approveScenario(operatorName, operatorNotes || 'Statutory clearance verified. Dewatering active.');
  };

  const handleModifySubmit = () => {
    modifyScenario(customParams || 'Reduced haul speed to 15 km/h and increased pump RPM to +45%', operatorName);
    setIsModifying(false);
  };

  const handleReject = () => {
    rejectScenario(operatorName, operatorNotes || 'Manual inspection mandated before mechanical intervention.');
  };

  return (
    <div className="panel-surface p-6 sm:p-8 border border-telemetry-500/40 bg-gradient-to-b from-telemetry-950/15 via-obsidian-900 to-obsidian-950 font-mono text-xs space-y-6 shadow-2xl animate-fade-in select-none">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#C8BFAF] gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-telemetry-500/20 border border-telemetry-500/30 flex items-center justify-center">
            <UserCheck className="w-4 h-4 text-telemetry-400" />
          </div>
          <div>
            <div className="text-[10px] text-telemetry-400 font-bold uppercase tracking-wider">
              {lang === 'hi' ? 'चरण 6 // ऑपरेटर निर्णय एवं प्रेषण प्राधिकरण' : lang === 'mr' ? 'टप्पा 6 // ऑपरेटर निर्णय व प्रेषण प्राधिकरण' : 'STEP 6 // OPERATOR DECISION & DISPATCH AUTHORITY'}
            </div>
            <h3 className="font-display text-lg font-bold text-[#272A27]">
              {lang === 'hi' ? 'एआई सहायता करता है। मानव निर्णय लेते हैं।' : lang === 'mr' ? 'एआय सहाय्य करते. मानव निर्णय घेतात.' : 'AI Assists. Humans Decide.'}
            </h3>
          </div>
        </div>

        <div className="badge-telemetry font-mono text-[10px] self-start sm:self-auto">
          <span>{lang === 'hi' ? 'डीजीएमएस शिफ्ट नियंत्रक प्रमाणीकरण' : lang === 'mr' ? 'डीजीएमएस शिफ्ट नियंत्रक प्रमाणीकरण' : 'DGMS Shift Controller Sign-Off'}</span>
        </div>
      </div>

      {/* Decision Status Card if already decided */}
      {(isApproved || isModified || isRejected) && (
        <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${
          isRejected
            ? 'bg-hazard-950/20 border-hazard-500/40 text-hazard-300'
            : 'bg-telemetry-950/20 border-telemetry-500/40 text-telemetry-300'
        }`}>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <div>
              <div className="font-bold text-[#272A27] text-xs">
                {isApproved && (lang === 'hi' ? 'प्रेषण अधिकृत एवं प्रमाणित' : lang === 'mr' ? 'प्रेषण अधिकृत व प्रमाणित' : 'DISPATCH AUTHORIZED & CERTIFIED')}
                {isModified && (lang === 'hi' ? 'ऑपरेटर संशोधनों के साथ प्रेषण अधिकृत' : lang === 'mr' ? 'ऑपरेटर सुधारणेसह प्रेषण अधिकृत' : 'DISPATCH AUTHORIZED WITH OPERATOR MODIFICATIONS')}
                {isRejected && (lang === 'hi' ? 'ऑपरेटर द्वारा एआई सिफारिश ओवरराइड' : lang === 'mr' ? 'ऑपरेटरद्वारे एआय शिफारस ओव्हरराइड' : 'AI RECOMMENDATION OVERRIDDEN BY OPERATOR')}
              </div>
              <div className="text-[11px] text-[#5F625C] font-sans mt-0.5">
                {lang === 'hi' ? 'हस्ताक्षरकर्ता:' : lang === 'mr' ? 'स्वाक्षरीकर्ता:' : 'Sign-off recorded by'} <strong className="text-[#272A27]">{operatorName}</strong> • {new Date().toLocaleTimeString()} IST.
              </div>
            </div>
          </div>

          <span className="px-3 py-1 rounded bg-[#F0EBE2] border border-[#C8BFAF] text-[10px] font-bold text-[#272A27]">
            {decisionStage}
          </span>
        </div>
      )}

      {/* Operator Form (when awaiting decision or modifying) */}
      {!isApproved && !isModified && !isRejected && (
        <div className="space-y-4">

          <div className="p-4 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-[#5F625C] uppercase tracking-wider block mb-1">
                  {lang === 'hi' ? 'नामित शिफ्ट पर्यवेक्षक / संचालन नियंत्रक:' : lang === 'mr' ? 'नियुक्त शिफ्ट पर्यवेक्षक / ऑपरेशन्स नियंत्रक:' : 'Designated Shift Supervisor / Operations Controller:'}
                </label>
                <input
                  type="text"
                  value={operatorName}
                  onChange={(e) => setOperatorName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#F5F1E9] border border-[#C8BFAF] text-white font-mono text-xs focus:border-manganese-500 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#5F625C] uppercase tracking-wider block mb-1">
                  {lang === 'hi' ? 'वैधानिक शिफ्ट समय मुहर:' : lang === 'mr' ? 'वैधानिक शिफ्ट वेळ मुहर:' : 'Statutory Shift Timestamp:'}
                </label>
                <div className="px-3 py-2 rounded-lg bg-[#F5F1E9] border border-[#C8BFAF] text-[#272A27] font-mono text-xs flex items-center justify-between">
                  <span>{new Date().toLocaleTimeString()} IST</span>
                  <span className="text-telemetry-400 font-bold">{ws.shiftA || 'Shift A Active'}</span>
                </div>
              </div>
            </div>

            {isModifying ? (
              <div>
                <label className="text-[10px] text-manganese-400 uppercase tracking-wider block mb-1 font-bold">
                  {lang === 'hi' ? 'कस्टम पैरामीटर संशोधन दर्ज करें:' : lang === 'mr' ? 'सानुकूल पॅरामीटर सुधारणा प्रविष्ट करा:' : 'Enter Custom Parameter Modifications:'}
                </label>
                <textarea
                  rows={2}
                  value={customParams}
                  onChange={(e) => setCustomParams(e.target.value)}
                  placeholder={lang === 'hi' ? 'उदा. क्रशर थ्रॉटल 220 TPH करें; 2 डंपर तैनात करें।' : lang === 'mr' ? 'उदा. क्रशर थ्रॉटल 220 TPH करा; 2 डंपर तैनात करा.' : 'e.g. Throttle CR-01 to 220 TPH instead of 210 TPH; engage 2 dumpers instead of 4.'}
                  className="w-full px-3 py-2 rounded-lg bg-[#F5F1E9] border border-manganese-500/50 text-white font-mono text-xs focus:border-manganese-400 outline-none"
                />
              </div>
            ) : (
              <div>
                <label className="text-[10px] text-[#5F625C] uppercase tracking-wider block mb-1">
                  {lang === 'hi' ? 'ऑपरेटर शिफ्ट लेजर नोट्स (वैकल्पिक):' : lang === 'mr' ? 'ऑपरेटर शिफ्ट नोंदवही नोट्स (पर्यायी):' : 'Operator Shift Ledger Notes (Optional):'}
                </label>
                <input
                  type="text"
                  value={operatorNotes}
                  onChange={(e) => setOperatorNotes(e.target.value)}
                  placeholder={lang === 'hi' ? 'उदा. पंप AP-04 लाइन दबाव सत्यापित; वायरलेस प्रसारण पूर्ण।' : lang === 'mr' ? 'उदा. पंप AP-04 लाइन दाब तपासला; वायरलेस संदेश पूर्ण.' : 'e.g. Verified pump AP-04 line pressure; VHF broadcast complete.'}
                  className="w-full px-3 py-2 rounded-lg bg-[#F5F1E9] border border-[#C8BFAF] text-[#272A27] font-sans text-xs focus:border-manganese-500 outline-none"
                />
              </div>
            )}
          </div>

          {/* Decision Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              onClick={handleReject}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#DDD4C5] hover:bg-hazard-500/20 text-[#5F625C] hover:text-hazard-300 border border-[#C8BFAF] font-bold text-xs uppercase tracking-wide transition-colors"
            >
              {lang === 'hi' ? '[ अस्वीकार / मैनुअल ओवरराइड ]' : lang === 'mr' ? '[ नकार / मॅन्युअल ओव्हरराइड ]' : '[ REJECT / MANUAL OVERRIDE ]'}
            </button>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {isModifying ? (
                <>
                  <button
                    onClick={() => setIsModifying(false)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#C8BFAF] text-[#272A27] font-bold text-xs uppercase"
                  >
                    {comm.cancel || 'Cancel'}
                  </button>
                  <button
                    onClick={handleModifySubmit}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-manganese-500 hover:bg-manganese-400 text-obsidian-950 font-bold text-xs uppercase shadow-md"
                  >
                    {lang === 'hi' ? 'संशोधित योजना अधिकृत करें' : lang === 'mr' ? 'सुधारित योजना अधिकृत करा' : 'Authorize Modified Plan'}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsModifying(true)}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#C8BFAF] hover:bg-obsidian-750 text-manganese-300 border border-[#C8BFAF] font-bold text-xs uppercase tracking-wide transition-colors"
                  >
                    {lang === 'hi' ? '[ पैरामीटर संशोधित करें ]' : lang === 'mr' ? '[ पॅरामीटर्स सुधारा ]' : '[ MODIFY PARAMETERS ]'}
                  </button>

                  <button
                    onClick={handleApprove}
                    className="w-full sm:w-auto px-8 py-2.5 rounded-xl bg-gradient-to-r from-telemetry-500 to-emerald-400 hover:from-telemetry-400 hover:to-emerald-300 text-obsidian-950 font-black text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(16,185,129,0.3)] transition-all hover:scale-105"
                  >
                    {lang === 'hi' ? '[ स्वीकृत एवं प्रेषित करें ]' : lang === 'mr' ? '[ मंजूर व प्रेषित करा ]' : '[ APPROVE & DISPATCH ]'}
                  </button>
                </>
              )}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
