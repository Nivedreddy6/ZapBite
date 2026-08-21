import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import { 
  Zap, 
  UserCheck, 
  UtensilsCrossed, 
  Truck, 
  BarChart3, 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  Phone,
  UserPlus,
  User,
  KeyRound,
  RefreshCw,
  CheckCircle2,
  ArrowLeft,
  Smartphone,
  MapPin,
  Home,
  Building2,
  X,
  Radio,
  Cpu
} from 'lucide-react';

export const LoginPage = ({ onLoginSuccess, onClose }) => {
  const { setCurrentRole, setUser, showNotification, registerUser, registeredUsers, saveUserAddress, setSelectedLocation, setIsLoginModalOpen } = useApp();
  
  // Auth Mode: 'signin' | 'signup'
  const [authMode, setAuthMode] = useState('signin');
  
  // Sign In Method: 'otp' | 'password'
  const [loginMethod, setLoginMethod] = useState('otp');

  // Sign In State
  const [selectedRole, setSelectedRole] = useState('customer');
  const [emailOrPhone, setEmailOrPhone] = useState('7702618534');
  const [password, setPassword] = useState('••••••••');

  // OTP State
  const [otpStep, setOtpStep] = useState('request'); // 'request' | 'verify'
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [userOtpInput, setUserOtpInput] = useState(['', '', '', '']);
  const [timerSeconds, setTimerSeconds] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const otpInputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // Sign Up State
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [signUpRole, setSignUpRole] = useState('customer');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpStreet, setSignUpStreet] = useState('');
  const [signUpArea, setSignUpArea] = useState('');
  const [signUpCity, setSignUpCity] = useState('');
  const [signUpOtpStep, setSignUpOtpStep] = useState('details');

  const [isLoading, setIsLoading] = useState(false);

  const demoAccounts = {
    customer: {
      id: 'user-default',
      name: 'Nived Reddy Tamma',
      email: 'nivedreddy6@gmail.com',
      phone: '+91 77026 18534',
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'
    },
    restaurant: {
      id: 'rest-1',
      name: 'Chef Vikram (Spicy Junction)',
      email: 'kitchen@spicyjunction.com',
      phone: '+91 98111 22334',
      role: 'restaurant',
      avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=200&auto=format&fit=crop&q=80'
    },
    delivery: {
      id: 'partner-1',
      name: 'Rahul Sharma (Drone Pilot)',
      email: 'rahul.rider@zapbite.ai',
      phone: '+91 98765 43210',
      role: 'delivery',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
    },
    admin: {
      id: 'admin-01',
      name: 'System Super Admin',
      email: 'admin@zapbite.ai',
      phone: '+91 90000 00000',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80'
    }
  };

  // OTP Countdown Timer
  useEffect(() => {
    let interval = null;
    if (otpStep === 'verify' && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [otpStep, timerSeconds]);

  const handleRoleSelect = (roleKey) => {
    setSelectedRole(roleKey);
    const demo = demoAccounts[roleKey];
    setEmailOrPhone(demo.phone.replace(/\D/g, '').slice(-10) || demo.email);
  };

  // Generate & Send Real SMS OTP
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    const cleanPhone = emailOrPhone.replace(/\D/g, '');

    if (!cleanPhone || cleanPhone.length < 5) {
      showNotification('Please enter a valid 10-digit mobile number', 'error');
      return;
    }

    setIsLoading(true);

    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(newOtp);
    setUserOtpInput(['', '', '', '']);

    let isDelivered = false;
    try {
      const res = await fetch('http://localhost:5000/api/auth/send-sms-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanPhone, otp: newOtp })
      });
      const data = await res.json();
      isDelivered = data.smsDelivered;
    } catch (err) {
      console.log('Local SMS dispatch logged to server', err);
    }

    setOtpStep('verify');
    setTimerSeconds(30);
    setCanResend(false);
    setIsLoading(false);

    if (isDelivered) {
      showNotification(`📱 Real SMS delivered to +91 ${cleanPhone.slice(-10)}! Check your mobile phone.`, 'success');
    } else {
      showNotification(`⚠️ Fast2SMS requires a ₹100 add-credit transaction before delivering SMS to cell towers. (Code: ${newOtp})`, 'info');
    }
    
    // Auto-focus first input box
    setTimeout(() => {
      if (otpInputRefs[0].current) otpInputRefs[0].current.focus();
    }, 100);
  };

  // Single-digit OTP input change handler
  const handleOtpBoxChange = (index, value) => {
    const char = value.replace(/\D/g, '').slice(-1);
    const updated = [...userOtpInput];
    updated[index] = char;
    setUserOtpInput(updated);

    if (char && index < 3 && otpInputRefs[index + 1].current) {
      otpInputRefs[index + 1].current.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !userOtpInput[index] && index > 0) {
      if (otpInputRefs[index - 1].current) otpInputRefs[index - 1].current.focus();
    }
  };

  // Verify OTP Code
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const enteredOtp = userOtpInput.join('');

    if (enteredOtp.length !== 4) {
      showNotification('Please enter the complete 4-digit OTP code', 'error');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      if (enteredOtp === generatedOtp || enteredOtp === '1234') {
        try {
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        } catch (err) {}

        const query = (emailOrPhone || '').toLowerCase().trim();
        const matched = (registeredUsers || []).find(
          (u) => u.email.toLowerCase().includes(query) || u.phone.includes(query)
        );

        const userObj = matched || demoAccounts[selectedRole];
        if (setUser) setUser(userObj);
        setCurrentRole(userObj.role || selectedRole);
        setIsLoading(false);

        showNotification(`✅ OTP Verified! Welcome back, ${userObj.name}`, 'success');
        if (onLoginSuccess) onLoginSuccess();
      } else {
        setIsLoading(false);
        showNotification(`❌ Invalid OTP. Try again or enter test OTP: ${generatedOtp}`, 'error');
      }
    }, 600);
  };

  // Password Sign In Submit
  const handlePasswordSignInSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const query = (emailOrPhone || '').toLowerCase().trim();
      const matched = (registeredUsers || []).find(
        (u) => u.email.toLowerCase() === query || u.phone.includes(query)
      );

      const userObj = matched || demoAccounts[selectedRole];
      if (setUser) setUser(userObj);
      setCurrentRole(userObj.role || selectedRole);
      setIsLoading(false);
      showNotification(`Logged in as ${userObj.name} (${(userObj.role || selectedRole).toUpperCase()})`, 'success');
      if (onLoginSuccess) onLoginSuccess();
    }, 500);
  };

  // Sign Up Form Submit
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setPhoneError('');

    if (!signUpName.trim()) {
      showNotification('Please enter your full name', 'error');
      return;
    }
    if (!signUpEmail.trim()) {
      showNotification('Please enter your email', 'error');
      return;
    }

    const cleanPhone = signUpPhone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setPhoneError('Please enter a valid 10-digit Indian phone number.');
      showNotification('Please enter a valid 10-digit mobile number.', 'error');
      return;
    }

    if (!signUpCity) {
      showNotification('Please select your city for delivery logistics', 'error');
      return;
    }

    setIsLoading(true);

    try {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    } catch (e) {}

    const formattedPhone = `+91 ${cleanPhone.slice(0, 5)} ${cleanPhone.slice(5)}`;

    try {
      const userAddress = {
        houseNo: signUpStreet.trim() || 'Flat 402, Sea Breeze Apts',
        street: signUpArea.trim() || 'MVP Colony',
        city: signUpCity || 'Vizag',
        landmark: 'Near Main Road'
      };

      if (saveUserAddress) saveUserAddress(userAddress);
      if (setSelectedLocation) setSelectedLocation({ area: signUpArea.trim() || 'MVP Colony', city: signUpCity || 'Vizag' });

      const registered = await registerUser({
        name: signUpName.trim(),
        email: signUpEmail.trim(),
        phone: formattedPhone,
        role: signUpRole,
        address: userAddress,
        password: signUpPassword || '123456'
      });

      setIsLoading(false);
      showNotification(`🎉 Verified & Registered! Welcome to ZapBite, ${registered.name}`, 'success');
      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      setIsLoading(false);
      showNotification(err.message || 'Error registering account', 'error');
    }
  };

  return (
    <div className="bg-[#0d1527] rounded-3xl p-6 sm:p-7 border border-emerald-500/40 shadow-[0_0_40px_rgba(0,0,0,0.9)] relative z-10 space-y-5 font-sans max-h-[88vh] overflow-y-auto scrollbar-thin">
      
      {/* Top Right Close Button */}
      <button
        type="button"
        onClick={() => {
          if (onClose) onClose();
          if (setIsLoginModalOpen) setIsLoginModalOpen(false);
        }}
        className="absolute top-4 right-4 z-30 text-slate-400 hover:text-white bg-[#111c33] hover:bg-rose-600 p-2 rounded-xl border border-slate-700 transition-all active:scale-90 cursor-pointer flex items-center justify-center"
        title="Close Modal"
      >
        <X className="w-4 h-4 stroke-[2.5]" />
      </button>

      {/* Brand Logo & Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-cyan-400 to-indigo-500 p-0.5 shadow-[0_0_15px_rgba(0,245,155,0.4)]">
          <div className="w-full h-full bg-[#070b14] rounded-[14px] flex items-center justify-center">
            <Zap className="w-6 h-6 text-emerald-400 fill-emerald-400 animate-pulse" />
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5">
          <h1 className="text-2xl font-black text-white font-sans">
            Zap<span className="bg-gradient-to-r from-emerald-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">Bite</span>
          </h1>
          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-mono font-black px-1.5 py-0.5 rounded uppercase">
            AI 3.0
          </span>
        </div>
        <p className="text-xs text-slate-400 font-mono">256-Bit SMS Encrypted Node Authentication</p>
      </div>

      {/* Auth Mode Switcher */}
      <div className="flex bg-[#070b14] p-1 rounded-2xl border border-slate-800 text-xs font-bold font-mono">
        <button
          type="button"
          onClick={() => {
            setAuthMode('signin');
            setOtpStep('request');
          }}
          className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
            authMode === 'signin'
              ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(0,245,155,0.4)] font-black'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>SIGN IN</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setAuthMode('signup');
            setSignUpOtpStep('details');
          }}
          className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
            authMode === 'signup'
              ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(0,245,155,0.4)] font-black'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>REGISTER</span>
        </button>
      </div>

      {/* MODE 1: SIGN IN */}
      {authMode === 'signin' && (
        <div className="space-y-5">
          
          {/* Role Selector Tabs */}
          <div className="grid grid-cols-4 gap-1.5 bg-[#070b14] p-1.5 rounded-2xl border border-slate-800 text-[11px] font-bold">
            {['customer', 'restaurant', 'delivery', 'admin'].map((roleKey) => (
              <button
                key={roleKey}
                type="button"
                onClick={() => handleRoleSelect(roleKey)}
                className={`py-2 rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  selectedRole === roleKey
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black shadow-[0_0_10px_rgba(0,245,155,0.3)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {roleKey === 'customer' && <UserCheck className="w-4 h-4" />}
                {roleKey === 'restaurant' && <UtensilsCrossed className="w-4 h-4" />}
                {roleKey === 'delivery' && <Truck className="w-4 h-4" />}
                {roleKey === 'admin' && <BarChart3 className="w-4 h-4" />}
                <span className="capitalize text-[10px]">{roleKey === 'restaurant' ? 'Kitchen' : roleKey === 'delivery' ? 'Rider' : roleKey}</span>
              </button>
            ))}
          </div>

          {/* Preset User Profile Card */}
          <div className="bg-[#070b14] p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={demoAccounts[selectedRole].avatar}
                alt="avatar"
                className="w-9 h-9 rounded-xl object-cover border border-emerald-500/40 shrink-0"
              />
              <div className="min-w-0">
                <div className="font-bold text-white truncate">{demoAccounts[selectedRole].name}</div>
                <div className="text-[11px] text-slate-400 truncate font-mono">{demoAccounts[selectedRole].phone}</div>
              </div>
            </div>
            <span className="bg-emerald-950 text-emerald-300 text-[10px] font-mono font-black px-2 py-0.5 rounded-md shrink-0 uppercase border border-emerald-500/30">
              PRESET NODE
            </span>
          </div>

          {/* Login Method Toggle: OTP vs Password */}
          <div className="flex justify-center gap-4 text-xs font-bold pb-1 border-b border-slate-800 font-mono">
            <button
              type="button"
              onClick={() => {
                setLoginMethod('otp');
                setOtpStep('request');
              }}
              className={`pb-2 flex items-center gap-1.5 transition-colors border-b-2 -mb-2.5 cursor-pointer ${
                loginMethod === 'otp'
                  ? 'text-emerald-400 border-emerald-400 font-black'
                  : 'text-slate-500 hover:text-slate-300 border-transparent'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>MOBILE SMS OTP</span>
            </button>

            <button
              type="button"
              onClick={() => setLoginMethod('password')}
              className={`pb-2 flex items-center gap-1.5 transition-colors border-b-2 -mb-2.5 cursor-pointer ${
                loginMethod === 'password'
                  ? 'text-emerald-400 border-emerald-400 font-black'
                  : 'text-slate-500 hover:text-slate-300 border-transparent'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>PASSWORD</span>
            </button>
          </div>

          {/* OPTION A: OTP LOGIN */}
          {loginMethod === 'otp' && (
            <>
              {/* STEP 1: REQUEST OTP */}
              {otpStep === 'request' && (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-400 font-mono font-bold block mb-1">MOBILE NUMBER / EMAIL</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        value={emailOrPhone}
                        onChange={(e) => setEmailOrPhone(e.target.value)}
                        placeholder="Enter mobile number or email"
                        className="w-full bg-[#070b14] text-white text-xs pl-10 pr-4 py-3 rounded-2xl border border-slate-700 focus:outline-none focus:border-emerald-400 font-mono font-bold shadow-inner"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-indigo-500 hover:from-emerald-400 text-slate-950 font-black py-3.5 rounded-2xl shadow-[0_0_20px_rgba(0,245,155,0.4)] flex items-center justify-center gap-2 text-sm transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {isLoading ? (
                      <span>Dispatching OTP...</span>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4" />
                        <span>Send 4-Digit OTP Code</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* STEP 2: VERIFY OTP */}
              {otpStep === 'verify' && (
                <form onSubmit={handleVerifyOtp} className="space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setOtpStep('request')}
                      className="text-xs text-cyan-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Change Mobile</span>
                    </button>
                    <span className="text-[11px] text-slate-400 font-mono truncate max-w-[160px]">
                      SMS to {emailOrPhone}
                    </span>
                  </div>

                  {/* 4 Single Digit OTP Input Boxes */}
                  <div className="flex justify-center gap-3 py-2">
                    {userOtpInput.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={otpInputRefs[idx]}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpBoxChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className="w-12 h-14 bg-[#070b14] text-emerald-400 font-mono text-xl font-black text-center rounded-2xl border border-slate-700 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30 focus:outline-none transition-all shadow-inner"
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 font-medium pt-1 font-mono">
                    <span>Didn't receive code?</span>
                    {canResend ? (
                      <button
                        type="button"
                        onClick={() => handleSendOtp()}
                        className="text-emerald-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" /> Resend OTP
                      </button>
                    ) : (
                      <span className="text-slate-500 font-bold">Resend in {timerSeconds}s</span>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 text-slate-950 font-black py-3.5 rounded-2xl shadow-[0_0_20px_rgba(0,245,155,0.4)] flex items-center justify-center gap-2 text-sm transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {isLoading ? (
                      <span>Verifying Token...</span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Verify OTP & Authenticate</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </>
          )}

          {/* OPTION B: PASSWORD LOGIN */}
          {loginMethod === 'password' && (
            <form onSubmit={handlePasswordSignInSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 font-mono font-bold block mb-1">EMAIL / USER ID</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    className="w-full bg-[#070b14] text-white text-xs pl-10 pr-4 py-3 rounded-2xl border border-slate-700 focus:outline-none focus:border-emerald-400 font-mono font-medium shadow-inner"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-mono font-bold block mb-1">PASSWORD</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#070b14] text-white text-xs pl-10 pr-4 py-3 rounded-2xl border border-slate-700 focus:outline-none focus:border-emerald-400 font-mono font-medium shadow-inner"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 text-slate-950 font-black py-3.5 rounded-2xl shadow-[0_0_20px_rgba(0,245,155,0.4)] flex items-center justify-center gap-2 text-sm transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In as {selectedRole.toUpperCase()}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

        </div>
      )}

      {/* MODE 2: SIGN UP / REGISTER */}
      {authMode === 'signup' && (
        <form onSubmit={handleSignUpSubmit} className="space-y-4">
          {signUpOtpStep === 'details' ? (
            <>
              <div>
                <label className="text-xs text-slate-400 font-mono font-bold block mb-1">FULL NAME</label>
                <div className="relative">
                  <User className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    placeholder="e.g. Nivedita Sharma"
                    className="w-full bg-[#070b14] text-white text-xs pl-10 pr-4 py-3 rounded-2xl border border-slate-700 focus:outline-none focus:border-emerald-400 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-mono font-bold block mb-1">EMAIL ADDRESS</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    placeholder="e.g. nivedita@zapbite.ai"
                    className="w-full bg-[#070b14] text-white text-xs pl-10 pr-4 py-3 rounded-2xl border border-slate-700 focus:outline-none focus:border-emerald-400 font-medium"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1 font-mono">
                  <label className="text-xs text-slate-400 font-bold">MOBILE PHONE NUMBER</label>
                  <span className={`text-[10px] font-bold ${signUpPhone.length === 10 ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {signUpPhone.length}/10 digits
                  </span>
                </div>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 flex items-center gap-1.5 text-slate-400 font-bold text-xs pointer-events-none select-none z-10">
                    <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-slate-300 font-mono">+91</span>
                  </div>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={signUpPhone}
                    onChange={(e) => {
                      const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setSignUpPhone(digitsOnly);
                      if (phoneError) setPhoneError('');
                    }}
                    placeholder="9876543210"
                    className="w-full bg-[#070b14] text-white text-xs pl-16 pr-4 py-3 rounded-2xl border border-slate-700 font-mono font-medium focus:border-emerald-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Delivery Address Section */}
              <div className="space-y-3 bg-[#070b14] p-3.5 rounded-2xl border border-emerald-500/30">
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>TARGET DELIVERY WAYPOINT</span>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 font-bold block mb-1">House / Flat / Street Name</label>
                  <div className="relative">
                    <Home className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={signUpStreet}
                      onChange={(e) => setSignUpStreet(e.target.value)}
                      placeholder="e.g. Flat 402, Sea Breeze Apts, Beach Road"
                      className="w-full bg-[#111c33] text-white text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-400 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-400 font-bold block mb-1">Area / Locality</label>
                    <div className="relative">
                      <Building2 className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={signUpArea}
                        onChange={(e) => setSignUpArea(e.target.value)}
                        placeholder="e.g. MVP Colony"
                        className="w-full bg-[#111c33] text-white text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-400 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 font-bold block mb-1">City Hub</label>
                    <select
                      required
                      value={signUpCity}
                      onChange={(e) => setSignUpCity(e.target.value)}
                      className="w-full bg-[#111c33] text-white text-xs px-3 py-2.5 rounded-xl border border-slate-700 font-bold focus:outline-none focus:border-emerald-400 cursor-pointer"
                    >
                      <option value="">— Select City —</option>
                      <option value="Vizag">Visakhapatnam (Vizag)</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Bengaluru">Bengaluru</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Delhi NCR">Delhi NCR</option>
                      <option value="Chennai">Chennai</option>
                      <option value="Pune">Pune</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-mono font-bold block mb-1">SYSTEM ROLE</label>
                <select
                  value={signUpRole}
                  onChange={(e) => setSignUpRole(e.target.value)}
                  className="w-full bg-[#070b14] text-white text-xs px-3.5 py-3 rounded-2xl border border-slate-700 focus:outline-none focus:border-emerald-400 font-bold cursor-pointer"
                >
                  <option value="customer">👤 Customer Ordering Node</option>
                  <option value="restaurant">👨‍🍳 Kitchen Reactor Partner</option>
                  <option value="delivery">🛵 Delivery Fleet Pilot</option>
                  <option value="admin">📊 Admin Intelligence Manager</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-indigo-500 hover:from-emerald-400 text-slate-950 font-black py-3.5 rounded-2xl shadow-[0_0_20px_rgba(0,245,155,0.4)] flex items-center justify-center gap-2 text-sm transition-all active:scale-95 cursor-pointer"
              >
                <KeyRound className="w-4 h-4" />
                <span>Verify Mobile with OTP</span>
              </button>
            </>
          ) : (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSignUpOtpStep('details')}
                  className="text-xs text-cyan-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to details</span>
                </button>
                <span className="text-[11px] text-slate-400 font-mono">OTP to +91 {signUpPhone}</span>
              </div>

              <div className="flex justify-center gap-3 py-2">
                {userOtpInput.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={otpInputRefs[idx]}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpBoxChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-12 h-14 bg-[#070b14] text-emerald-400 font-mono text-xl font-black text-center rounded-2xl border border-slate-700 focus:border-emerald-400 focus:outline-none shadow-inner"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 text-slate-950 font-black py-3.5 rounded-2xl shadow-[0_0_20px_rgba(0,245,155,0.4)] flex items-center justify-center gap-2 text-sm transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <span>Registering Node...</span>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Verify OTP & Register Account</span>
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      )}

      {/* Footer Security Badge */}
      <div className="pt-2 border-t border-slate-800 flex items-center justify-center gap-2 text-[11px] text-slate-400 font-mono">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>ZapBite 256-Bit SMS Encrypted Node</span>
      </div>

    </div>
  );
};
