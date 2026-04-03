import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const navigate = useNavigate();
  const { user, profile, loading, signInWithGoogle } = useAuth();

  // Handle redirection once auth and profile are loaded
  useEffect(() => {
    if (!loading && user && profile) {
      const role = profile.role;
      switch (role) {
        case 'super_admin':
          navigate('/dashboard/super-admin');
          break;
        case 'admin':
          navigate('/dashboard/admin');
          break;
        case 'seller':
          navigate('/dashboard/seller');
          break;
        default:
          navigate('/dashboard/buyer');
          break;
      }
    }
  }, [user, profile, loading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Welcome back to Marketly!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to login');
      setAuthLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setAuthLoading(true);
    try {
      await signInWithGoogle();
      toast.success('Successfully logged in with Google!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to login with Google');
      setAuthLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border"
      >
        <div className="p-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-orange-600 mb-2 tracking-tighter">Marketly</h1>
            <p className="text-slate-500 font-medium">Log in to your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-10 h-12"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-xs text-orange-600 hover:underline font-semibold">Forgot password?</a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
                  className="pl-10 h-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white font-bold text-lg uppercase shadow-lg shadow-orange-100 transition-all"
              disabled={authLoading || loading}
            >
              {authLoading || (loading && user) ? 'Processing...' : 'Login'}
              {!(authLoading || (loading && user)) && <ArrowRight className="ml-2 h-5 w-5" />}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400 font-semibold">Or continue with</span>
            </div>
          </div>

          <Button 
            type="button" 
            variant="outline"
            className="w-full h-12 border-slate-200 text-slate-600 font-semibold flex items-center justify-center gap-3 hover:bg-slate-50 transition-all"
            onClick={handleGoogleLogin}
            disabled={authLoading || loading}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </Button>

          <div className="mt-8 pt-8 border-t text-center">
            <p className="text-slate-500 mb-4">Don't have an account?</p>
            <Link to="/register">
              <Button variant="outline" className="w-full h-12 border-orange-600 text-orange-600 hover:bg-orange-50 font-bold uppercase">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="bg-slate-50 px-8 py-4 text-center">
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Marketly Secure Authentication</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;