import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  ShieldCheck, 
  Lock, 
  Smartphone, 
  CreditCard, 
  Building2, 
  Banknote, 
  CheckCircle2, 
  X, 
  Clock, 
  QrCode, 
  Sparkles, 
  KeyRound, 
  ArrowRight,
  ShieldAlert,
  Zap,
  Radio,
  Cpu
} from 'lucide-react';

export const PaymentModal = ({ isOpen, onClose, orderData, onPaymentSuccess }) => {
  const [activeTab, setActiveTab] = useState('upi');
  
  // UPI State
  const [upiId, setUpiId] = useState('');
  const [qrTimerSeconds, setQrTimerSeconds] = useState(300); // 5 mins
  
  // Card State
  const [cardNumber, setCardNumber] = useState('4532 8910 2341 9012');
  const [cardHolder, setCardHolder] = useState(orderData?.customerName || 'Rahul Malhotra');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('891');

  // OTP Verification Modal State
  const [isOtpStepOpen, setIsOtpStepOpen] = useState(false);
  const [otpCode, setOtpCode] = useState('789012');

  // Net Banking State
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Processing State
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0); // 0: None, 1: Encrypting, 2: NPCI Verification, 3: Approved

  useEffect(() => {
    let timer;
    if (isOpen && activeTab === 'upi' && qrTimerSeconds > 0) {
      timer = setInterval(() => {
        setQrTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, activeTab, qrTimerSeconds]);

  if (!isOpen) return null;

  const totalAmount = orderData?.amount || 500;

  // Format Card Number (4-digit groups)
  const handleCardNumberChange = (val) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 16);
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    setCardNumber(formatted);
  };

  // Card Type Detector
  const getCardNetwork = () => {
    if (cardNumber.startsWith('4')) return { name: 'VISA QUANTUM', color: 'from-cyan-900 via-indigo-950 to-slate-950 border-cyan-500/40 text-cyan-300' };
    if (cardNumber.startsWith('5')) return { name: 'MASTERCARD CYBER', color: 'from-amber-950 via-rose-950 to-slate-950 border-amber-500/40 text-amber-300' };
    if (cardNumber.startsWith('6')) return { name: 'RUPAY SECURE', color: 'from-emerald-950 via-teal-950 to-slate-950 border-emerald-500/40 text-emerald-300' };
    return { name: 'CYBER CARD', color: 'from-slate-900 via-slate-950 to-black border-slate-700 text-slate-300' };
  };

  const cardNetwork = getCardNetwork();

  // Execute Payment Processing Flow
  const startPaymentProcessing = () => {
    setIsProcessing(true);
    setProcessingStep(1);

    // Step 1: 256-Bit TLS Encryption
    setTimeout(() => {
      setProcessingStep(2); // NPCI & Bank Verification
    }, 1200);

    // Step 2: Payment Approval
    setTimeout(() => {
      setProcessingStep(3); // Approved
      
      try {
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.5 }
        });
      } catch (e) {
        console.log(e);
      }
    }, 2500);

    // Step 3: Redirect & Complete Order
    setTimeout(() => {
      setIsProcessing(false);
      setProcessingStep(0);
      setIsOtpStepOpen(false);
      onPaymentSuccess();
    }, 3500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#040711]/85 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-[#0d1527] text-slate-100 rounded-3xl border border-emerald-500/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[92vh] z-10 animate-scale-up">

        {/* Real-Time Processing Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 bg-[#070b14]/95 text-white z-50 flex flex-col items-center justify-center p-6 text-center space-y-6 animate-fade-in">
            <div className="relative flex items-center justify-center">
              <div className="w-24 h-24 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Zap className="w-8 h-8 text-emerald-400 fill-emerald-400 animate-pulse" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-emerald-400 font-mono text-xs uppercase tracking-widest font-black">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                256-BIT QUANTUM ENCRYPTED GATEWAY
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {processingStep === 1 && 'Initiating Encrypted Quantum Channel...'}
                {processingStep === 2 && 'Authenticating with Bank & NPCI Node...'}
                {processingStep === 3 && 'Payment Approved & Confirmed! 🎉'}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto font-normal">
                Please do not refresh or close. Your transaction of <span className="text-emerald-300 font-mono font-bold">₹{totalAmount}</span> is protected.
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-md bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
              <div 
                className="bg-gradient-to-r from-emerald-500 via-cyan-400 to-indigo-500 h-full transition-all duration-1000 ease-out rounded-full shadow-[0_0_12px_rgba(0,245,155,0.6)]"
                style={{
                  width: processingStep === 1 ? '35%' : processingStep === 2 ? '75%' : '100%'
                }}
              />
            </div>

            <div className="bg-[#111c33] text-emerald-300 text-[11px] font-mono px-3.5 py-1.5 rounded-xl border border-emerald-500/30 flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Txn Hash: ZAP-{Date.now().toString().slice(-8)}</span>
            </div>
          </div>
        )}

        {/* 3D Secure OTP Modal Step */}
        {isOtpStepOpen && !isProcessing && (
          <div className="absolute inset-0 bg-[#0d1527] z-40 p-6 flex flex-col justify-between animate-slide-in-right">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-black text-base text-white">Quantum 3D Secure Verification</h3>
                </div>
                <button
                  onClick={() => setIsOtpStepOpen(false)}
                  className="text-slate-400 hover:text-white bg-[#111c33] p-1.5 rounded-xl cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-6 space-y-4">
                <div className="bg-[#0d241a] border border-emerald-500/40 p-4 rounded-2xl text-xs text-emerald-300 space-y-1">
                  <span className="font-bold block text-emerald-200">Bank One-Time Passcode Sent!</span>
                  <span>An SMS containing a 6-digit verification code has been dispatched to <span className="font-mono font-bold text-white">+91 ••••• ••{(orderData?.customerPhone || '7702618534').slice(-3)}</span>.</span>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 block font-mono">ENTER 6-DIGIT OTP</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full text-center tracking-[0.8em] font-mono text-xl font-black bg-[#070b14] text-emerald-400 py-3.5 rounded-2xl border border-emerald-500/40 focus:border-emerald-300 focus:outline-none shadow-inner"
                  />
                  <p className="text-[11px] text-slate-400 text-center font-mono">Demo Auto-Filled OTP: <span className="font-bold text-emerald-300">789012</span></p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
              <button
                onClick={() => setIsOtpStepOpen(false)}
                className="px-4 py-3 rounded-2xl text-xs font-bold text-slate-300 bg-[#111c33] hover:bg-[#192b4f] cursor-pointer"
              >
                Back to Gateway
              </button>
              <button
                onClick={startPaymentProcessing}
                className="flex-1 bg-gradient-to-r from-emerald-500 via-cyan-400 to-indigo-500 hover:from-emerald-400 text-slate-950 font-black text-xs py-3.5 rounded-2xl shadow-[0_0_20px_rgba(0,245,155,0.4)] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Authorize ₹{totalAmount}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Modal Top Header */}
        <div className="bg-[#070b14] text-white p-5 border-b border-emerald-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-cyan-400 to-indigo-500 p-0.5 flex items-center justify-center shadow-[0_0_15px_rgba(0,245,155,0.3)]">
              <div className="w-full h-full bg-[#070b14] rounded-[14px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base text-white">ZapPay Quantum Gateway</h3>
                <span className="bg-emerald-500/20 text-emerald-300 text-[9px] px-2 py-0.5 rounded font-mono font-bold border border-emerald-500/40">
                  LIVE VAULT
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Merchant: ZapBite.ai • Amount: <span className="text-emerald-400 font-mono font-bold">₹{totalAmount}</span></p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white bg-[#111c33] hover:bg-[#192b4f] p-2 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Payment Methods Nav Tabs */}
        <div className="bg-[#070b14]/60 p-1.5 border-b border-slate-800 flex items-center gap-1 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('upi')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'upi'
                ? 'bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(0,245,155,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>UPI / QR</span>
          </button>

          <button
            onClick={() => setActiveTab('card')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'card'
                ? 'bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(0,245,155,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Card Vault</span>
          </button>

          <button
            onClick={() => setActiveTab('netbanking')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'netbanking'
                ? 'bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(0,245,155,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Net Banking</span>
          </button>

          <button
            onClick={() => setActiveTab('cod')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'cod'
                ? 'bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(0,245,155,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Banknote className="w-4 h-4" />
            <span>Doorstep Cash</span>
          </button>
        </div>

        {/* Tab Body Content */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">

          {/* TAB 1: UPI Gateway */}
          {activeTab === 'upi' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                
                {/* Left: Dynamic QR Code Box */}
                <div className="bg-[#070b14] border border-emerald-500/30 rounded-3xl p-5 flex flex-col items-center text-center space-y-3 shadow-inner">
                  <div className="relative p-3 bg-white rounded-2xl border border-emerald-400 shadow-[0_0_20px_rgba(0,245,155,0.2)]">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=upi://pay?pa=zapbite@icici%26pn=ZapBiteAI%26am=${totalAmount}%26cu=INR`}
                      alt="UPI QR Code"
                      className="w-36 h-36 object-contain"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-[#070b14]/90 rounded-2xl transition-opacity text-emerald-300 text-[11px] font-bold">
                      Scan with PhonePe / GPay
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono font-bold">
                    <Clock className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
                    <span>QR Expires in {Math.floor(qrTimerSeconds / 60)}:{(qrTimerSeconds % 60).toString().padStart(2, '0')}</span>
                  </div>

                  <button
                    onClick={startPaymentProcessing}
                    className="w-full bg-[#111c33] hover:bg-[#192b4f] text-emerald-300 font-black text-xs py-2.5 rounded-xl border border-emerald-500/40 flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                  >
                    <QrCode className="w-4 h-4 text-emerald-400" />
                    <span>Simulate Scan QR & Pay</span>
                  </button>
                </div>

                {/* Right: Instant UPI App Intent & ID */}
                <div className="space-y-4">
                  <h4 className="text-xs font-mono font-black text-emerald-400 uppercase tracking-wider">Fast UPI Intents</h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      onClick={startPaymentProcessing}
                      className="p-3 bg-[#111c33] hover:bg-[#162544] border border-slate-700 hover:border-emerald-500/40 rounded-2xl text-left transition-all group cursor-pointer"
                    >
                      <div className="text-xs font-black text-white group-hover:text-emerald-300">PhonePe</div>
                      <div className="text-[10px] text-slate-400">1-Tap Instant Auth</div>
                    </button>

                    <button
                      onClick={startPaymentProcessing}
                      className="p-3 bg-[#111c33] hover:bg-[#162544] border border-slate-700 hover:border-cyan-500/40 rounded-2xl text-left transition-all group cursor-pointer"
                    >
                      <div className="text-xs font-black text-white group-hover:text-cyan-300">Google Pay</div>
                      <div className="text-[10px] text-slate-400">GPay Direct Intent</div>
                    </button>

                    <button
                      onClick={startPaymentProcessing}
                      className="p-3 bg-[#111c33] hover:bg-[#162544] border border-slate-700 hover:border-indigo-500/40 rounded-2xl text-left transition-all group cursor-pointer"
                    >
                      <div className="text-xs font-black text-white group-hover:text-indigo-300">Paytm UPI</div>
                      <div className="text-[10px] text-slate-400">Paytm Quantum Node</div>
                    </button>

                    <button
                      onClick={startPaymentProcessing}
                      className="p-3 bg-[#111c33] hover:bg-[#162544] border border-slate-700 hover:border-amber-500/40 rounded-2xl text-left transition-all group cursor-pointer"
                    >
                      <div className="text-xs font-black text-white group-hover:text-amber-300">BHIM UPI</div>
                      <div className="text-[10px] text-slate-400">NPCI Certified</div>
                    </button>
                  </div>

                  <div className="pt-2">
                    <label className="text-xs font-bold text-slate-300 block mb-1.5 font-mono">ENTER VPA / UPI ID</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="e.g. mobile@ybl / username@upi"
                        className="flex-1 bg-[#070b14] text-white text-xs p-3 rounded-2xl border border-slate-700 font-mono font-bold focus:border-emerald-400 focus:outline-none"
                      />
                      <button
                        onClick={startPaymentProcessing}
                        className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 text-xs font-black px-4 py-3 rounded-2xl active:scale-95 transition-all cursor-pointer"
                      >
                        Authorize
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: Credit / Debit Cards */}
          {activeTab === 'card' && (
            <div className="space-y-6">
              
              {/* Interactive Cyber 3D Card Visualizer */}
              <div className={`p-6 rounded-3xl bg-gradient-to-tr ${cardNetwork.color} border shadow-2xl space-y-6 relative overflow-hidden transition-all`}>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono font-black tracking-widest text-emerald-400">⚡ QUANTUM ENCRYPTED CHIP</span>
                  <span className="text-xs font-mono font-black tracking-widest bg-white/10 px-3 py-1 rounded-lg border border-white/20">
                    {cardNetwork.name}
                  </span>
                </div>

                <div className="font-mono text-xl tracking-widest font-black drop-shadow-md text-white">
                  {cardNumber || '•••• •••• •••• ••••'}
                </div>

                <div className="flex justify-between items-end text-xs font-mono">
                  <div>
                    <div className="text-[9px] text-slate-400 uppercase">Card Holder</div>
                    <div className="font-bold uppercase tracking-wider text-white">{cardHolder || 'VALUED CUSTOMER'}</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-slate-400 uppercase">Expires</div>
                    <div className="font-bold text-white">{cardExpiry || '12/28'}</div>
                  </div>
                </div>
              </div>

              {/* Card Inputs Form */}
              <div className="space-y-3">
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => handleCardNumberChange(e.target.value)}
                  placeholder="Card Number (16 Digits)"
                  className="w-full bg-[#070b14] text-white text-xs p-3 rounded-2xl border border-slate-700 font-mono font-bold focus:border-emerald-400 focus:outline-none"
                />

                <input
                  type="text"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  placeholder="Cardholder Name"
                  className="w-full bg-[#070b14] text-white text-xs p-3 rounded-2xl border border-slate-700 font-bold focus:border-emerald-400 focus:outline-none"
                />

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="MM / YY"
                    className="bg-[#070b14] text-white text-xs p-3 rounded-2xl border border-slate-700 font-mono font-bold focus:border-emerald-400 focus:outline-none"
                  />
                  <input
                    type="password"
                    maxLength={3}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    placeholder="CVV"
                    className="bg-[#070b14] text-white text-xs p-3 rounded-2xl border border-slate-700 font-mono font-bold focus:border-emerald-400 focus:outline-none"
                  />
                </div>

                <button
                  onClick={() => setIsOtpStepOpen(true)}
                  className="w-full mt-2 bg-gradient-to-r from-emerald-500 via-cyan-400 to-indigo-500 hover:from-emerald-400 text-slate-950 font-black text-xs py-3.5 rounded-2xl shadow-[0_0_20px_rgba(0,245,155,0.4)] flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-slate-950" />
                  <span>Authenticate & Pay ₹{totalAmount}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Net Banking */}
          {activeTab === 'netbanking' && (
            <div className="space-y-4">
              <h4 className="text-xs font-mono font-black text-emerald-400 uppercase tracking-wider">Partner Banking Nodes</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map((bName) => (
                  <button
                    key={bName}
                    onClick={() => setSelectedBank(bName)}
                    className={`p-3.5 rounded-2xl text-xs text-left font-bold border transition-all cursor-pointer ${
                      selectedBank === bName
                        ? 'bg-[#111c33] border-emerald-400 text-emerald-300 shadow-[0_0_12px_rgba(0,245,155,0.2)]'
                        : 'bg-[#070b14] hover:bg-[#111c33] border-slate-800 text-slate-300'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-cyan-400 mb-1.5" />
                    <span>{bName}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={startPaymentProcessing}
                className="w-full mt-4 bg-gradient-to-r from-emerald-500 via-cyan-400 to-indigo-500 text-slate-950 font-black text-xs py-3.5 rounded-2xl shadow-[0_0_20px_rgba(0,245,155,0.3)] active:scale-95 transition-all cursor-pointer"
              >
                Pay ₹{totalAmount} via {selectedBank}
              </button>
            </div>
          )}

          {/* TAB 4: Cash on Delivery */}
          {activeTab === 'cod' && (
            <div className="bg-[#070b14] border border-emerald-500/30 p-6 rounded-3xl space-y-4 text-slate-200">
              <div className="flex items-center gap-3">
                <Banknote className="w-8 h-8 text-emerald-400 shrink-0" />
                <div>
                  <h4 className="font-black text-sm text-white">Cash on Delivery Protocol</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Pay ₹{totalAmount} directly to the delivery rider upon thermal handoff.</p>
                </div>
              </div>

              <div className="bg-[#111c33] p-3.5 rounded-2xl border border-slate-700 text-xs text-slate-300 space-y-1">
                <span className="font-bold block text-emerald-300">Delivery Security Pin</span>
                <span>An SMS verification OTP will be sent to your phone upon rider arrival.</span>
              </div>

              <button
                onClick={startPaymentProcessing}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs py-3.5 rounded-2xl shadow-[0_0_20px_rgba(0,245,155,0.4)] active:scale-95 transition-all cursor-pointer"
              >
                Confirm Order with Cash on Delivery (₹{totalAmount})
              </button>
            </div>
          )}

        </div>

        {/* Footer Security Badges */}
        <div className="bg-[#070b14] p-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>PCI-DSS LEVEL 1 • 256-BIT QUANTUM ENCRYPTION</span>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-emerald-400">
            <span>NPCI CERTIFIED</span>
            <span>•</span>
            <span>RBI COMPLIANT</span>
          </div>
        </div>

      </div>
    </div>
  );
};
