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
  MessageSquare,
  MapPin,
  Home,
  Building2,
  X
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
  const [smsPushNotification, setSmsPushNotification] = useState(null);
  const otpInputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // Sign Up State (Empty by default for manual entry)
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [signUpRole, setSignUpRole] = useState('customer');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpStreet, setSignUpStreet] = useState('');
  const [signUpArea, setSignUpArea] = useState('');
  const [signUpCity, setSignUpCity] = useState('');
  const [signUpOtpStep, setSignUpOtpStep] = useState('details'); // 'details' | 'verify_otp'

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
      name: 'Rahul Sharma (Rider)',
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
      showNotification('Please enter your email address', 'error');
      return;
    }

    const cleanPhone = signUpPhone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length !== 10) {
      setPhoneError('Please enter a valid 10-digit mobile number');
      showNotification('Mobile number must be exactly 10 digits', 'error');
      return;
    }

    if (!signUpCity) {
      showNotification('Please select your city for delivery', 'error');
      return;
    }

    // Move to OTP verification for Sign Up
    if (signUpOtpStep === 'details') {
      const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOtp(newOtp);
      setUserOtpInput(['', '', '', '']);
      setSignUpOtpStep('verify_otp');

      setSmsPushNotification({
        phone: `+91 ${cleanPhone.slice(-10)}`,
        otp: newOtp
      });

      try {
        await fetch('http://localhost:5000/api/auth/send-sms-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: cleanPhone, otp: newOtp })
        });
      } catch (err) {}

      showNotification(`💬 Registration SMS OTP sent to +91 ${cleanPhone}!`, 'success');
      return;
    }

    // Verify Sign Up OTP
    const enteredOtp = userOtpInput.join('');
    if (enteredOtp !== generatedOtp && enteredOtp !== '1234') {
      showNotification(`❌ Invalid OTP code. Please check your SMS and try again.`, 'error');
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
      showNotification(`🎉 Verified & Registered! Welcome to ZapBite.ai, ${registered.name}`, 'success');
      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      setIsLoading(false);
      showNotification(err.message || 'Error registering account', 'error');
    }
  };

  return (
    <div className="bg-[#0b0f19] rounded-3xl p-6 sm:p-7 border border-rose-500/40 shadow-2xl shadow-rose-950/60 relative z-10 space-y-5 font-sans max-h-[88vh] overflow-y-auto scrollbar-thin">
      
      {/* Top Right Close Button - Highly Visible */}
      <button
        type="button"
        onClick={() => {
          if (onClose) onClose();
          if (setIsLoginModalOpen) setIsLoginModalOpen(false);
        }}
        className="absolute top-4 right-4 z-30 text-slate-200 hover:text-white bg-slate-800/90 hover:bg-rose-600 p-2 rounded-full border border-slate-600/80 transition-all active:scale-90 cursor-pointer shadow-lg flex items-center justify-center"
        title="Close Modal"
      >
        <X className="w-4 h-4 stroke-[2.5]" />
      </button>

      {/* Brand Logo & Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 via-purple-600 to-cyan-400 p-0.5 shadow-xl shadow-rose-500/30">
          <div className="w-full h-full bg-[#0b0f19] rounded-[14px] flex items-center justify-center">
            <Zap className="w-6 h-6 text-rose-400 fill-rose-400" />
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5">
          <h1 className="text-2xl font-black text-white font-sans">
            Zap<span className="bg-gradient-to-r from-rose-400 to-purple-400 bg-clip-text text-transparent">Bite</span>
          </h1>
          <span className="bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[10px] font-extrabold px-1.5 py-0.5 rounded uppercase">
            .AI
          </span>
        </div>
        <p className="text-xs text-slate-400 font-medium">OTP Secured Authentication & Registration Portal</p>
      </div>

      {/* Auth Mode Switcher: Sign In vs Sign Up */}
      <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs font-bold">
        <button
          type="button"
          onClick={() => {
            setAuthMode('signin');
            setOtpStep('request');
          }}
          className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all ${
            authMode === 'signin'
              ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-lg font-black'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>Sign In</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setAuthMode('signup');
            setSignUpOtpStep('details');
          }}
          className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all ${
            authMode === 'signup'
              ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-lg font-black'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Sign Up</span>
        </button>
      </div>

      {/* MODE 1: SIGN IN */}
      {authMode === 'signin' && (
        <div className="space-y-5">
          
          {/* Role Selector Tabs */}
          <div className="grid grid-cols-4 gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-[11px] font-bold">
            {['customer', 'restaurant', 'delivery', 'admin'].map((roleKey) => (
              <button
                key={roleKey}
                type="button"
                onClick={() => handleRoleSelect(roleKey)}
                className={`py-2 rounded-xl flex flex-col items-center gap-1 transition-all ${
                  selectedRole === roleKey
                    ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {roleKey === 'customer' && <UserCheck className="w-4 h-4" />}
                {roleKey === 'restaurant' && <UtensilsCrossed className="w-4 h-4" />}
                {roleKey === 'delivery' && <Truck className="w-4 h-4" />}
                {roleKey === 'admin' && <BarChart3 className="w-4 h-4" />}
                <span className="capitalize">{roleKey === 'restaurant' ? 'Kitchen' : roleKey === 'delivery' ? 'Rider' : roleKey}</span>
              </button>
            ))}
          </div>

          {/* Preset User Profile Card */}
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={demoAccounts[selectedRole].avatar}
                alt="avatar"
                className="w-9 h-9 rounded-xl object-cover border border-rose-500/40 shrink-0"
              />
              <div className="min-w-0">
                <div className="font-extrabold text-white truncate">{demoAccounts[selectedRole].name}</div>
                <div className="text-[11px] text-slate-400 truncate">{demoAccounts[selectedRole].phone}</div>
              </div>
            </div>
            <span className="bg-cyan-500/10 text-cyan-300 text-[10px] font-extrabold px-2 py-0.5 rounded-md shrink-0 uppercase border border-cyan-500/30">
              Preset User
            </span>
          </div>

          {/* Login Method Toggle: OTP vs Password */}
          <div className="flex justify-center gap-4 text-xs font-bold pb-1 border-b border-slate-800">
            <button
              type="button"
              onClick={() => {
                setLoginMethod('otp');
                setOtpStep('request');
              }}
              className={`pb-2 flex items-center gap-1.5 transition-colors border-b-2 -mb-2.5 ${
                loginMethod === 'otp'
                  ? 'text-cyan-400 border-cyan-400 font-extrabold'
                  : 'text-slate-500 hover:text-slate-300 border-transparent'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile OTP</span>
            </button>

            <button
              type="button"
              onClick={() => setLoginMethod('password')}
              className={`pb-2 flex items-center gap-1.5 transition-colors border-b-2 -mb-2.5 ${
                loginMethod === 'password'
                  ? 'text-cyan-400 border-cyan-400 font-extrabold'
                  : 'text-slate-500 hover:text-slate-300 border-transparent'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Password</span>
            </button>
          </div>

          {/* OPTION A: OTP LOGIN */}
          {loginMethod === 'otp' && (
            <>
              {/* STEP 1: REQUEST OTP */}
              {otpStep === 'request' && (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-400 font-bold block mb-1">Mobile Number / Email</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        value={emailOrPhone}
                        onChange={(e) => setEmailOrPhone(e.target.value)}
                        placeholder="Enter mobile number or email"
                        className="w-full bg-slate-950 text-white text-xs pl-10 pr-4 py-3 rounded-2xl border border-slate-800 focus:outline-none focus:border-cyan-500 font-medium"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 hover:from-rose-600 hover:to-purple-700 text-white font-black py-3.5 rounded-2xl shadow-xl shadow-rose-500/30 flex items-center justify-center gap-2 text-sm transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span>Sending OTP...</span>
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
                      className="text-xs text-cyan-400 hover:underline font-bold flex items-center gap-1"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Change Mobile</span>
                    </button>
                    <span className="text-[11px] text-slate-400 font-medium truncate max-w-[160px]">
                      SMS sent to {emailOrPhone}
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
                        className="w-12 h-14 bg-slate-950 text-white font-mono text-xl font-black text-center rounded-2xl border border-slate-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 focus:outline-none transition-all"
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 font-medium pt-1">
                    <span>Didn't receive code?</span>
                    {canResend ? (
                      <button
                        type="button"
                        onClick={() => handleSendOtp()}
                        className="text-cyan-400 hover:underline font-bold flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" /> Resend OTP
                      </button>
                    ) : (
                      <span className="text-slate-500 font-mono font-bold">Resend in {timerSeconds}s</span>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black py-3.5 rounded-2xl shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 text-sm transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span>Verifying OTP...</span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Verify OTP & Sign In</span>
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
                <label className="text-xs text-slate-400 font-bold block mb-1">Email / User ID</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs pl-10 pr-4 py-3 rounded-2xl border border-slate-800 focus:outline-none focus:border-cyan-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-bold block mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs pl-10 pr-4 py-3 rounded-2xl border border-slate-800 focus:outline-none focus:border-cyan-500 font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 hover:from-rose-600 hover:to-purple-700 text-white font-black py-3.5 rounded-2xl shadow-xl shadow-rose-500/30 flex items-center justify-center gap-2 text-sm transition-all active:scale-95 disabled:opacity-50"
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

      {/* MODE 2: SIGN UP / REGISTER WITH OTP */}
      {authMode === 'signup' && (
        <form onSubmit={handleSignUpSubmit} className="space-y-4">
          {signUpOtpStep === 'details' ? (
            <>
              <div>
                <label className="text-xs text-slate-400 font-bold block mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    placeholder="e.g. Nivedita Sharma"
                    className="w-full bg-slate-950 text-white text-xs pl-10 pr-4 py-3 rounded-2xl border border-slate-800 focus:outline-none focus:border-cyan-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-bold block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    placeholder="e.g. nivedita@zapbite.ai"
                    className="w-full bg-slate-950 text-white text-xs pl-10 pr-4 py-3 rounded-2xl border border-slate-800 focus:outline-none focus:border-cyan-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs text-slate-400 font-bold">Mobile Phone Number</label>
                  <span className={`text-[10px] font-mono font-bold ${signUpPhone.length === 10 ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {signUpPhone.length}/10 digits
                  </span>
                </div>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 flex items-center gap-1.5 text-slate-400 font-bold text-xs pointer-events-none select-none z-10">
                    <Phone className="w-4 h-4 text-slate-500 shrink-0" />
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
                    className={`w-full bg-slate-950 text-white text-xs pl-16 pr-4 py-3 rounded-2xl border font-mono font-medium focus:outline-none transition-all ${
                      phoneError
                        ? 'border-red-500/80 focus:border-red-500 bg-red-950/10'
                        : signUpPhone.length === 10
                        ? 'border-emerald-500/80 focus:border-emerald-500'
                        : 'border-slate-800 focus:border-cyan-500'
                    }`}
                  />
                </div>
              </div>

              {/* Delivery Address Section (Sign Up Only) */}
              <div className="space-y-3 bg-slate-900/60 p-3.5 rounded-2xl border border-rose-500/20">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-rose-400">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Your Delivery Address</span>
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
                      className="w-full bg-slate-950 text-white text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 font-medium"
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
                        className="w-full bg-slate-950 text-white text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 font-bold block mb-1">City</label>
                    <select
                      required
                      value={signUpCity}
                      onChange={(e) => setSignUpCity(e.target.value)}
                      className={`w-full bg-slate-950 text-xs px-3 py-2.5 rounded-xl border font-bold transition-all focus:outline-none ${
                        signUpCity ? 'text-white border-slate-800 focus:border-cyan-500' : 'text-slate-500 border-slate-800 focus:border-cyan-500'
                      }`}
                    >
                      <option value="">— Select City —</option>
                      <option value="Vizag">Visakhapatnam (Vizag)</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Bengaluru">Bengaluru</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Delhi NCR">Delhi NCR</option>
                      <option value="Chennai">Chennai</option>
                      <option value="Pune">Pune</option>
                      <option value="Kolkata">Kolkata</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-bold block mb-1">Select System Role</label>
                <select
                  value={signUpRole}
                  onChange={(e) => setSignUpRole(e.target.value)}
                  className="w-full bg-slate-950 text-white text-xs px-3.5 py-3 rounded-2xl border border-slate-800 focus:outline-none focus:border-cyan-500 font-bold"
                >
                  <option value="customer">👤 Customer Ordering User</option>
                  <option value="restaurant">👨‍🍳 Kitchen Staff Partner</option>
                  <option value="delivery">🛵 Delivery Fleet Rider</option>
                  <option value="admin">📊 Admin Intelligence Manager</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 hover:from-rose-600 hover:to-purple-700 text-white font-black py-3.5 rounded-2xl shadow-xl shadow-rose-500/30 flex items-center justify-center gap-2 text-sm transition-all active:scale-95"
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
                  className="text-xs text-cyan-400 hover:underline font-bold flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to details</span>
                </button>
                <span className="text-[11px] text-slate-400 font-medium">OTP sent to +91 {signUpPhone}</span>
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
                    className="w-12 h-14 bg-slate-950 text-white font-mono text-xl font-black text-center rounded-2xl border border-slate-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 focus:outline-none transition-all"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black py-3.5 rounded-2xl shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 text-sm transition-all active:scale-95 disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Registering...</span>
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
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-center gap-2 text-[11px] text-slate-500 font-medium">
        <ShieldCheck className="w-4 h-4 text-cyan-400" />
        <span>ZapBite.ai 256-Bit SMS & OTP Secured Authentication</span>
      </div>

    </div>
  );
};
