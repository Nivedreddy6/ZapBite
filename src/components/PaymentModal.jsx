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
  Zap
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
    if (cardNumber.startsWith('4')) return { name: 'VISA', color: 'from-blue-600 to-indigo-700' };
    if (cardNumber.startsWith('5')) return { name: 'Mastercard', color: 'from-amber-600 to-rose-700' };
    if (cardNumber.startsWith('6')) return { name: 'RuPay', color: 'from-emerald-600 to-teal-700' };
    return { name: 'Card', color: 'from-slate-800 to-slate-900' };
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
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] z-10 animate-scale-up">

        {/* Real-Time Processing Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 bg-slate-950/95 text-white z-50 flex flex-col items-center justify-center p-6 text-center space-y-6 animate-fade-in">
            <div className="relative flex items-center justify-center">
              <div className="w-24 h-24 rounded-full border-4 border-orange-500/20 border-t-orange-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Zap className="w-8 h-8 text-rose-500 fill-rose-500 animate-pulse" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-rose-400 font-mono text-xs uppercase tracking-widest font-extrabold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                256-Bit NPCI Encrypted Gateway
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                {processingStep === 1 && 'Initiating Secure Payment Session...'}
                {processingStep === 2 && 'Authorizing with Bank & NPCI Gateway...'}
                {processingStep === 3 && 'Payment Approved! Redirecting... 🎉'}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto font-medium">
                Please do not refresh or close this window. Your transaction of <span className="text-amber-300 font-bold">₹{totalAmount}</span> is protected.
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-md bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
              <div 
                className="bg-gradient-to-r from-rose-500 via-orange-500 to-emerald-400 h-full transition-all duration-1000 ease-out rounded-full"
                style={{
                  width: processingStep === 1 ? '35%' : processingStep === 2 ? '75%' : '100%'
                }}
              />
            </div>

            <div className="bg-slate-900/90 text-slate-300 text-[11px] font-mono px-3.5 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Txn Hash: ZAP-{Date.now().toString().slice(-8)}</span>
            </div>
          </div>
        )}

        {/* 3D Secure OTP Modal Step */}
        {isOtpStepOpen && !isProcessing && (
          <div className="absolute inset-0 bg-white z-40 p-6 flex flex-col justify-between animate-slide-in-right">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-rose-600" />
                  <h3 className="font-extrabold text-base text-slate-900">3D Secure Card OTP Verification</h3>
                </div>
                <button
                  onClick={() => setIsOtpStepOpen(false)}
                  className="text-slate-400 hover:text-slate-700 bg-slate-100 p-1.5 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-6 space-y-4">
                <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl text-xs text-rose-900 space-y-1">
                  <span className="font-extrabold block">Bank One-Time Password Sent!</span>
                  <span>An SMS containing a 6-digit OTP has been sent to your registered mobile number <span className="font-mono font-bold">+91 ••••• ••112</span>.</span>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-700 block">Enter 6-Digit Bank OTP</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full text-center tracking-[1em] font-mono text-xl font-black bg-slate-50 text-slate-900 py-3.5 rounded-2xl border border-slate-300 focus:border-rose-500 focus:outline-none"
                  />
                  <p className="text-[11px] text-slate-500 text-center font-medium">Demo Auto-Filled OTP: <span className="font-mono font-bold text-slate-800">789012</span></p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                onClick={() => setIsOtpStepOpen(false)}
                className="px-4 py-3 rounded-2xl text-xs font-extrabold text-slate-600 bg-slate-100 hover:bg-slate-200"
              >
                Back to Payment
              </button>
              <button
                onClick={startPaymentProcessing}
                className="flex-1 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 text-white font-extrabold text-xs py-3.5 rounded-2xl shadow-md flex items-center justify-center gap-1.5"
              >
                <span>Authorize ₹{totalAmount}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Modal Top Header */}
        <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-orange-500 p-0.5 flex items-center justify-center shadow-md">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">ZapPay Gateway</h3>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded font-mono font-bold border border-emerald-500/30">
                  LIVE
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Merchant: ZapBite.ai • Order Total: <span className="text-amber-400 font-mono font-bold">₹{totalAmount}</span></p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Payment Methods Nav Tabs */}
        <div className="bg-slate-100 p-1.5 border-b border-slate-200 flex items-center gap-1 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('upi')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
              activeTab === 'upi'
                ? 'bg-white text-rose-600 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-4 h-4 text-orange-500" />
            <span>UPI / QR</span>
          </button>

          <button
            onClick={() => setActiveTab('card')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
              activeTab === 'card'
                ? 'bg-white text-rose-600 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-4 h-4 text-rose-500" />
            <span>Card</span>
          </button>

          <button
            onClick={() => setActiveTab('netbanking')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
              activeTab === 'netbanking'
                ? 'bg-white text-rose-600 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4 text-blue-500" />
            <span>Net Banking</span>
          </button>

          <button
            onClick={() => setActiveTab('cod')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
              activeTab === 'cod'
                ? 'bg-white text-rose-600 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Banknote className="w-4 h-4 text-emerald-600" />
            <span>Cash on Delivery</span>
          </button>
        </div>

        {/* Tab Body Content */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">

          {/* TAB 1: UPI Gateway */}
          {activeTab === 'upi' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                
                {/* Left: Dynamic QR Code Box */}
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 flex flex-col items-center text-center space-y-3 shadow-inner">
                  <div className="relative p-3 bg-white rounded-2xl border border-slate-200 shadow-md">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=upi://pay?pa=zapbite@icici%26pn=ZapBiteAI%26am=${totalAmount}%26cu=INR`}
                      alt="UPI QR Code"
                      className="w-36 h-36 object-contain"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-slate-950/80 rounded-2xl transition-opacity text-white text-[11px] font-bold">
                      Scan with PhonePe / GPay
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono font-bold">
                    <Clock className="w-3.5 h-3.5 text-orange-500 animate-spin-slow" />
                    <span>QR Expires in {Math.floor(qrTimerSeconds / 60)}:{(qrTimerSeconds % 60).toString().padStart(2, '0')}</span>
                  </div>

                  <button
                    onClick={startPaymentProcessing}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-amber-300 font-extrabold text-xs py-2.5 rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                  >
                    <QrCode className="w-4 h-4 text-amber-400" />
                    <span>Simulate Scan QR & Pay</span>
                  </button>
                </div>

                {/* Right: Instant UPI App Intent & ID */}
                <div className="space-y-4">
                  <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Fast UPI Apps</h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      onClick={startPaymentProcessing}
                      className="p-3 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-2xl text-left transition-all group"
                    >
                      <div className="text-xs font-extrabold text-indigo-900 group-hover:text-indigo-600">PhonePe</div>
                      <div className="text-[10px] text-indigo-700">1-Tap Instant Auth</div>
                    </button>

                    <button
                      onClick={startPaymentProcessing}
                      className="p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-2xl text-left transition-all group"
                    >
                      <div className="text-xs font-extrabold text-blue-900 group-hover:text-blue-600">Google Pay</div>
                      <div className="text-[10px] text-blue-700">GPay Direct Intent</div>
                    </button>

                    <button
                      onClick={startPaymentProcessing}
                      className="p-3 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-2xl text-left transition-all group"
                    >
                      <div className="text-xs font-extrabold text-sky-900 group-hover:text-sky-600">Paytm UPI</div>
                      <div className="text-[10px] text-sky-700">Paytm Wallet / UPI</div>
                    </button>

                    <button
                      onClick={startPaymentProcessing}
                      className="p-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-2xl text-left transition-all group"
                    >
                      <div className="text-xs font-extrabold text-amber-900 group-hover:text-amber-600">BHIM UPI</div>
                      <div className="text-[10px] text-amber-700">NPCI Certified</div>
                    </button>
                  </div>

                  <div className="pt-2">
                    <label className="text-xs font-extrabold text-slate-700 block mb-1.5">Or Enter VPA / UPI ID</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="e.g. mobile@ybl / username@upi"
                        className="flex-1 bg-white text-slate-900 text-xs p-3 rounded-2xl border border-slate-300 font-bold focus:border-rose-500 focus:outline-none"
                      />
                      <button
                        onClick={startPaymentProcessing}
                        className="bg-gradient-to-r from-rose-500 to-orange-500 text-white text-xs font-extrabold px-4 py-3 rounded-2xl shadow-xs active:scale-95 transition-all"
                      >
                        Verify & Pay
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
              
              {/* Interactive 3D Card Visualizer */}
              <div className={`p-6 rounded-3xl bg-gradient-to-tr ${cardNetwork.color} text-white shadow-xl space-y-6 relative overflow-hidden transition-all`}>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono font-bold tracking-widest text-white/80">DEBIT / CREDIT CARD</span>
                  <span className="text-sm font-black italic tracking-widest bg-white/10 px-3 py-1 rounded-lg border border-white/20">
                    {cardNetwork.name}
                  </span>
                </div>

                <div className="font-mono text-xl tracking-widest font-extrabold drop-shadow-sm">
                  {cardNumber || '•••• •••• •••• ••••'}
                </div>

                <div className="flex justify-between items-end text-xs font-mono">
                  <div>
                    <div className="text-[9px] text-white/70 uppercase">Card Holder</div>
                    <div className="font-bold uppercase tracking-wider">{cardHolder || 'VALUED CUSTOMER'}</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-white/70 uppercase">Expires</div>
                    <div className="font-bold">{cardExpiry || '12/28'}</div>
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
                  className="w-full bg-white text-slate-900 text-xs p-3 rounded-2xl border border-slate-300 font-mono font-bold focus:border-rose-500 focus:outline-none"
                />

                <input
                  type="text"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  placeholder="Cardholder Name"
                  className="w-full bg-white text-slate-900 text-xs p-3 rounded-2xl border border-slate-300 font-bold focus:border-rose-500 focus:outline-none"
                />

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="MM / YY"
                    className="bg-white text-slate-900 text-xs p-3 rounded-2xl border border-slate-300 font-mono font-bold focus:border-rose-500 focus:outline-none"
                  />
                  <input
                    type="password"
                    maxLength={3}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    placeholder="CVV"
                    className="bg-white text-slate-900 text-xs p-3 rounded-2xl border border-slate-300 font-mono font-bold focus:border-rose-500 focus:outline-none"
                  />
                </div>

                <button
                  onClick={() => setIsOtpStepOpen(true)}
                  className="w-full mt-2 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 hover:from-rose-600 text-white font-extrabold text-xs py-3.5 rounded-2xl shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <Lock className="w-4 h-4 text-amber-200" />
                  <span>Proceed to 3D Secure OTP (Pay ₹{totalAmount})</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Net Banking */}
          {activeTab === 'netbanking' && (
            <div className="space-y-4">
              <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Popular Indian Banks</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map((bName) => (
                  <button
                    key={bName}
                    onClick={() => setSelectedBank(bName)}
                    className={`p-3.5 rounded-2xl text-xs text-left font-extrabold border transition-all ${
                      selectedBank === bName
                        ? 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-500/30'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-blue-600 mb-1.5" />
                    <span>{bName}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={startPaymentProcessing}
                className="w-full mt-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-extrabold text-xs py-3.5 rounded-2xl shadow-md active:scale-95 transition-all"
              >
                Pay ₹{totalAmount} via {selectedBank} NetBanking
              </button>
            </div>
          )}

          {/* TAB 4: Cash on Delivery */}
          {activeTab === 'cod' && (
            <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-3xl space-y-4 text-emerald-950">
              <div className="flex items-center gap-3">
                <Banknote className="w-8 h-8 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="font-extrabold text-sm">Pay Cash upon Delivery</h4>
                  <p className="text-xs text-emerald-800 mt-0.5">Pay ₹{totalAmount} directly to the delivery rider at your doorstep.</p>
                </div>
              </div>

              <div className="bg-white/80 p-3.5 rounded-2xl border border-emerald-200 text-xs text-slate-700 space-y-1">
                <span className="font-bold block text-slate-900">Delivery Security Pin</span>
                <span>An SMS verification OTP will be sent to your phone upon rider arrival.</span>
              </div>

              <button
                onClick={startPaymentProcessing}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3.5 rounded-2xl shadow-md active:scale-95 transition-all"
              >
                Confirm Order with Cash on Delivery (₹{totalAmount})
              </button>
            </div>
          )}

        </div>

        {/* Footer Security Badges */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>PCI-DSS Level 1 & 256-Bit SSL Encrypted</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[10px] text-slate-400">
            <span>NPCI Certified</span>
            <span>•</span>
            <span>RBI Compliant</span>
          </div>
        </div>

      </div>
    </div>
  );
};
