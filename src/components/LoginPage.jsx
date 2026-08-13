import React, { useState } from 'react';
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
  User
} from 'lucide-react';

export const LoginPage = ({ onLoginSuccess }) => {
  const { setCurrentRole, setUser, showNotification, registerUser, registeredUsers } = useApp();
  
  // Auth Mode: 'signin' | 'signup'
  const [authMode, setAuthMode] = useState('signin');

  // Sign In State
  const [selectedRole, setSelectedRole] = useState('customer');
  const [emailOrPhone, setEmailOrPhone] = useState('customer@zapbite.ai');
  const [password, setPassword] = useState('••••••••');

  // Sign Up State
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [signUpRole, setSignUpRole] = useState('customer');
  const [signUpPassword, setSignUpPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const demoAccounts = {
    customer: {
      id: 'cust-101',
      name: 'Rahul Malhotra',
      email: 'rahul@zapbite.ai',
      phone: '+91 98765 00112',
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
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

  const handleRoleSelect = (roleKey) => {
    setSelectedRole(roleKey);
    const demo = demoAccounts[roleKey];
    setEmailOrPhone(demo.email);
  };

  const handleSignInSubmit = (e) => {
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

    setIsLoading(true);

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log(e);
    }

    const formattedPhone = `+91 ${cleanPhone.slice(0, 5)} ${cleanPhone.slice(5)}`;

    try {
      const registered = await registerUser({
        name: signUpName.trim(),
        email: signUpEmail.trim(),
        phone: formattedPhone,
        role: signUpRole,
        password: signUpPassword
      });

      setIsLoading(false);
      showNotification(`🎉 Account registered and saved for ${registered.name}! Welcome to ZapBite.ai`, 'success');
      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      setIsLoading(false);
      showNotification(err.message || 'Error registering account', 'error');
    }
  };

  return (
    <div className="bg-[#0b0f19] rounded-3xl p-6 sm:p-8 border border-rose-500/30 shadow-2xl shadow-rose-950/40 relative z-10 space-y-6">
      
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
        <p className="text-xs text-slate-400 font-medium">Role-Based Authentication & Registration Portal</p>
      </div>

      {/* Mode Switcher: Sign In vs Sign Up */}
      <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs font-bold">
        <button
          type="button"
          onClick={() => setAuthMode('signin')}
          className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all ${
            authMode === 'signin'
              ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-lg font-black'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Sign In</span>
        </button>

        <button
          type="button"
          onClick={() => setAuthMode('signup')}
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
            <button
              type="button"
              onClick={() => handleRoleSelect('customer')}
              className={`py-2 rounded-xl flex flex-col items-center gap-1 transition-all ${
                selectedRole === 'customer'
                  ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Customer</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('restaurant')}
              className={`py-2 rounded-xl flex flex-col items-center gap-1 transition-all ${
                selectedRole === 'restaurant'
                  ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Kitchen</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('delivery')}
              className={`py-2 rounded-xl flex flex-col items-center gap-1 transition-all ${
                selectedRole === 'delivery'
                  ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Rider</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('admin')}
              className={`py-2 rounded-xl flex flex-col items-center gap-1 transition-all ${
                selectedRole === 'admin'
                  ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Admin</span>
            </button>
          </div>

          {/* Quick Demo Credentials Card */}
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={demoAccounts[selectedRole].avatar}
                alt="avatar"
                className="w-9 h-9 rounded-xl object-cover border border-rose-500/40 shrink-0"
              />
              <div className="min-w-0">
                <div className="font-extrabold text-white truncate">{demoAccounts[selectedRole].name}</div>
                <div className="text-[11px] text-slate-400 truncate">{demoAccounts[selectedRole].email}</div>
              </div>
            </div>
            <span className="bg-cyan-500/10 text-cyan-300 text-[10px] font-extrabold px-2 py-0.5 rounded-md shrink-0 uppercase border border-cyan-500/30">
              Demo Preset
            </span>
          </div>

          <form onSubmit={handleSignInSubmit} className="space-y-4">
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

        </div>
      )}

      {/* MODE 2: SIGN UP / REGISTER */}
      {authMode === 'signup' && (
        <form onSubmit={handleSignUpSubmit} className="space-y-4">
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
            {phoneError ? (
              <p className="text-[11px] text-red-400 font-medium mt-1 animate-in fade-in">{phoneError}</p>
            ) : (
              <p className="text-[10px] text-slate-500 font-medium mt-1">Accepts 10 numerical digits only (e.g. 9876543210)</p>
            )}
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

          <div>
            <label className="text-xs text-slate-400 font-bold block mb-1">Create Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={signUpPassword}
                onChange={(e) => setSignUpPassword(e.target.value)}
                placeholder="Create strong password"
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
              <span>Creating ZapBite Account...</span>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Register & Create Account</span>
              </>
            )}
          </button>
        </form>
      )}

      {/* Footer Security Badge */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-center gap-2 text-[11px] text-slate-500 font-medium">
        <ShieldCheck className="w-4 h-4 text-cyan-400" />
        <span>ZapBite.ai 256-Bit TLS Secured Authentication</span>
      </div>

    </div>
  );
};
