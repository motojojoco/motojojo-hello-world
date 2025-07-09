import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { supabase } from "@/integrations/supabase/client";
import { FcGoogle } from "react-icons/fc";

const SignInSignUp = () => {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState<'signIn' | 'signUp'>('signIn');
  const [form, setForm] = useState({ email: '', password: '', full_name: '' });
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);
    if (authMode === 'signIn') {
      const { error } = await signIn(form.email, form.password);
      if (error) setFormError(error.message);
      else navigate('/');
    } else {
      if (!form.full_name.trim()) {
        setFormError('Full name is required');
        setLoading(false);
        return;
      }
      const { error } = await signUp(form.email, form.password, form.full_name);
      if (error) setFormError(error.message);
      else navigate('/');
    }
    setLoading(false);
  };

  const handleGoogleAuth = async () => {
    setGoogleLoading(true);
    setFormError(null);
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) setFormError(error.message);
    setGoogleLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-violet-100 to-red-100">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12">
        <div className="w-full max-w-md bg-yellow-200/80 rounded-xl shadow-xl p-8 flex flex-col items-center">
          <img src="/public/motojojo.png" alt="Motojojo" className="w-20 h-20 mb-4" />
          <h1 className="text-3xl font-bold mb-2 text-violet">Welcome to Motojojo</h1>
          <p className="mb-6 text-center text-gray-600">{authMode === 'signIn' ? 'Sign in to discover and book unique experiences.' : 'Create your Motojojo account and join the community!'}</p>
          <Button
            type="button"
            onClick={handleGoogleAuth}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 mb-6"
            disabled={googleLoading}
          >
            <FcGoogle className="w-5 h-5" />
            {googleLoading ? 'Redirecting...' : 'Continue with Google'}
          </Button>
          <div className="w-full flex items-center gap-2 mb-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <form onSubmit={handleAuthSubmit} className="space-y-4 w-full">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="password">Password</label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                required
              />
            </div>
            {authMode === 'signUp' && (
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="full_name">Full Name</label>
                <Input
                  id="full_name"
                  type="text"
                  value={form.full_name}
                  onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                  required
                />
              </div>
            )}
            {formError && <div className="text-red-600 text-sm">{formError}</div>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (authMode === 'signIn' ? 'Signing In...' : 'Signing Up...') : (authMode === 'signIn' ? 'Sign In' : 'Sign Up')}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            {authMode === 'signIn' ? (
              <>Don't have an account? <button className="text-violet underline" onClick={() => { setAuthMode('signUp'); setFormError(null); }}>Sign Up</button></>
            ) : (
              <>Already have an account? <button className="text-violet underline" onClick={() => { setAuthMode('signIn'); setFormError(null); }}>Sign In</button></>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignInSignUp; 