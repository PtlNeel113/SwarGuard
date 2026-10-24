/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Lock, ArrowRight, Info, AlertCircle } from 'lucide-react';
import { SwarGuardLogo } from '../components/ui/SwarGuardLogo';
import { Button } from '../components/ui/Button';
import { SwarSignalWaveform } from '../components/audio/SwarSignalWaveform';
import { useAppStore } from '../store/useAppStore';
import { useFirebaseAuth } from '../features/auth/useFirebaseAuth';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const startDemoSession = useAppStore((state) => state.startDemoSession);
  const { user, signInWithGoogle, authError } = useFirebaseAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [authErrorMessage, setAuthErrorMessage] = useState<string | null>(null);
  const [showForgotDialog, setShowForgotDialog] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: true,
    },
  });

  const onSubmit = async (_data: LoginFormValues) => {
    setAuthErrorMessage(null);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setAuthErrorMessage(
      "Password authentication isn't connected in this prototype. Please use Google Sign-in or Demo Access below."
    );
  };

  const handleGoogleSignIn = async () => {
    setAuthErrorMessage(null);
    setIsGoogleSigningIn(true);
    try {
      await signInWithGoogle();
      startDemoSession();
      navigate('/dashboard');
    } catch (err: any) {
      setAuthErrorMessage(err.message || 'Google Sign-in failed. Please try again.');
    } finally {
      setIsGoogleSigningIn(false);
    }
  };

  const handleDemoAccess = () => {
    startDemoSession();
    navigate('/dashboard');
  };

  const demoPeaks = [
    0.15, 0.2, 0.35, 0.5, 0.7, 0.85, 0.6, 0.4, 0.3, 0.55, 0.75, 0.9, 0.8, 0.45,
    0.3, 0.2, 0.4, 0.65, 0.85, 0.95, 0.7, 0.4, 0.25, 0.15, 0.3, 0.6, 0.8, 0.5,
  ];

  return (
    <div className="min-h-screen bg-[#0B1020] text-[#F6F3EC] flex flex-col justify-center items-center p-4 md:p-8">
      <div className="w-full max-w-5xl rounded-2xl bg-[#12192F] border border-[#263359] shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Panel: Hero Identity & Acoustic Waveform */}
        <div className="p-8 md:p-12 bg-gradient-to-br from-[#171F3A] to-[#0B1020] border-b md:border-b-0 md:border-r border-[#263359] flex flex-col justify-between relative overflow-hidden">
          {/* Sound Rings Motif */}
          <div
            className={`absolute -top-12 -left-12 w-64 h-64 rounded-full border border-[#F2A65A]/20 pointer-events-none transition-transform duration-700 ${
              isFocused ? 'scale-125 opacity-60' : 'scale-100 opacity-20'
            }`}
          />
          <div
            className={`absolute -top-4 -left-4 w-48 h-48 rounded-full border border-[#56D6C2]/20 pointer-events-none transition-transform duration-700 ${
              isFocused ? 'scale-120 opacity-50' : 'scale-100 opacity-15'
            }`}
          />

          <div>
            <SwarGuardLogo size="lg" showTagline={true} className="mb-8" />

            <h1 className="text-2xl md:text-3xl font-extrabold text-[#F6F3EC] tracking-tight mb-3 text-balance">
              Every voice deserves a second listen.
            </h1>

            <p className="text-sm text-[#9AA6BC] leading-relaxed mb-6">
              AI voice-scam detection and multilingual call safety engineered to expose
              digital-arrest threats, fake bank KYC ultimatums, and coercive extortion before harm occurs.
            </p>

            {/* Acoustic Waveform signature */}
            <div className="my-6">
              <SwarSignalWaveform
                peaks={demoPeaks}
                currentTime={12}
                duration={25}
                isPlaying={isFocused}
                onSeek={() => {}}
                height={72}
                showRings={false}
              />
            </div>

            {/* Feature labels */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#9AA6BC]">
              <span className="font-medium text-[#F2A65A]">Multilingual Intelligence</span>
              <span aria-hidden="true">·</span>
              <span className="font-medium text-[#56D6C2]">Evidence-Based Alerts</span>
              <span aria-hidden="true">·</span>
              <span className="font-medium text-[#F6F3EC]">Firebase Auth & Cloud Storage</span>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-[#263359]/70 text-xs text-[#9AA6BC]">
            Built for safer conversations across India.
          </div>
        </div>

        {/* Right Panel: Authentication Form with Google Sign-in */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#F6F3EC] mb-1">Welcome back.</h2>
            <p className="text-xs text-[#9AA6BC]">
              Sign in securely with Google to persist your threat evaluations and history.
            </p>
          </div>

          {/* Primary Action: Google Sign-in */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleSigningIn}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg bg-white text-slate-900 font-semibold text-xs hover:bg-slate-100 active:bg-slate-200 transition-colors shadow-sm cursor-pointer mb-5"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isGoogleSigningIn ? 'Connecting to Google...' : 'Sign in with Google'}</span>
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-[1px] bg-[#263359]" />
            <span className="text-[11px] text-[#9AA6BC] uppercase tracking-wider">or email access</span>
            <div className="flex-1 h-[1px] bg-[#263359]" />
          </div>

          {(authErrorMessage || authError) && (
            <div
              className="p-3 mb-4 rounded-lg border border-[#F2A65A]/40 bg-[#F2A65A]/10 text-xs text-[#F2A65A] flex items-start gap-2.5 animate-in fade-in"
              role="alert"
            >
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-0.5">Authentication Note</p>
                <p className="text-[#F6F3EC]/90 leading-relaxed">
                  {authErrorMessage || authError}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#F6F3EC] mb-1.5" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                {...register('email')}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={`w-full px-3.5 py-2.5 rounded-lg bg-[#0B1020] border text-xs text-[#F6F3EC] placeholder-[#9AA6BC]/60 focus:outline-none transition-colors ${
                  errors.email ? 'border-[#FF5B64]' : 'border-[#263359] focus:border-[#F2A65A]'
                }`}
              />
              {errors.email && (
                <p className="text-[11px] text-[#FF5B64] mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#F6F3EC]" htmlFor="password">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotDialog(true)}
                  className="text-[11px] text-[#F2A65A] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password')}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className={`w-full px-3.5 py-2.5 pr-10 rounded-lg bg-[#0B1020] border text-xs text-[#F6F3EC] placeholder-[#9AA6BC]/60 focus:outline-none transition-colors ${
                    errors.password ? 'border-[#FF5B64]' : 'border-[#263359] focus:border-[#F2A65A]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-[#9AA6BC] hover:text-[#F6F3EC]"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] text-[#FF5B64] mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="pt-2 space-y-3">
              <Button
                type="submit"
                variant="secondary"
                size="md"
                isLoading={isSubmitting}
                className="w-full justify-center"
              >
                Sign In With Email
              </Button>

              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={handleDemoAccess}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full justify-center"
              >
                Try Interactive Demo Access
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Forgot Password Dialog */}
      {showForgotDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm rounded-xl bg-[#12192F] border border-[#263359] p-6 text-center">
            <Lock className="w-8 h-8 text-[#F2A65A] mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#F6F3EC] mb-2">Password Recovery</h3>
            <p className="text-xs text-[#9AA6BC] leading-relaxed mb-5">
              Use Google Sign-in to automatically access your account with Google’s verified security.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setShowForgotDialog(false);
                handleGoogleSignIn();
              }}
              className="w-full justify-center"
            >
              Sign in with Google
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
