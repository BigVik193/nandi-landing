'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/mobile-games/MobileGamesNavigation';

function SignupContent() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    workspaceName: '',
    gameProjectName: '',
    companySize: '',
    role: '',
    phoneNumber: '',
    timeZone: '',
    acceptTerms: false,
    acceptDataProcessing: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { supabase, session } = useAuth();

  useEffect(() => {
    // If user is already signed in, redirect to dashboard
    if (session) {
      router.push('/dashboard');
      return;
    }

    // Handle error messages from URL params
    const urlError = searchParams.get('error');
    const message = searchParams.get('message');
    
    if (urlError) {
      switch (urlError) {
        case 'expired_link':
          setError(message || 'Your verification link has expired. Please request a new one.');
          break;
        case 'verification_failed':
          setError('Email verification failed. Please try again.');
          break;
        case 'no_user':
          setError('No user found. Please sign up again.');
          break;
        case 'callback_failed':
          setError('Authentication failed. Please try again.');
          break;
        case 'auth_error':
          setError(message || 'Authentication error occurred.');
          break;
        case 'no_session':
          setError('Authentication session not found. Please try again.');
          break;
        default:
          setError('An error occurred. Please try again.');
      }
    }
  }, [session, router, searchParams]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.gameProjectName) {
      newErrors.gameProjectName = 'Game project name is required';
    }
    
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the Terms of Service';
    }
    
    if (!formData.acceptDataProcessing) {
      newErrors.acceptDataProcessing = 'You must consent to data processing';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            workspace_name: formData.workspaceName,
            game_project_name: formData.gameProjectName,
            company_size: formData.companySize,
            role: formData.role,
            phone_number: formData.phoneNumber,
            time_zone: formData.timeZone,
            terms_accepted: formData.acceptTerms,
            data_processing_consent: formData.acceptDataProcessing
          }
        }
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.user && !data.session) {
        // User created but needs email verification
        setSuccess(true);
      } else if (data.session) {
        // User is signed up and signed in immediately
        router.push('/dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!formData.email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });

      if (response.ok) {
        setError(null);
        alert('Verification email sent! Please check your inbox.');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to resend verification email');
      }
    } catch (err) {
      setError('Failed to resend verification email');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-6">
          <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 font-title">Check your email</h2>
              <p className="text-gray-600 mb-6">
                We've sent a verification link to <strong>{formData.email}</strong>. 
                Click the link in your email to complete your signup.
              </p>
              <button
                onClick={handleResendVerification}
                disabled={loading}
                className="text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Resend verification email'}
              </button>
              <p className="mt-4 text-sm text-gray-500">
                Already verified?{' '}
                <button
                  type="button"
                  onClick={() => router.push('/auth/signin')}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header */}
      <div className="pb-8 pt-24">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium font-title text-center mb-6">
            Get Started with Nandi
          </h1>
          <p className="text-xl text-gray-700 text-center max-w-2xl mx-auto">
            Create your account to set up your dynamic in-game store
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 pb-20">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 max-w-2xl mx-auto">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-6 text-center text-black font-title">Create Your Account</h2>
          
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
                <div className="ml-auto pl-3">
                  <button
                    type="button"
                    onClick={() => setError(null)}
                    className="inline-flex text-red-400 hover:text-red-600"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
            {/* Account Creation */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, email: e.target.value }));
                    if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent ${
                    errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="you@company.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, password: e.target.value }));
                    if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent ${
                    errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Create a strong password"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, confirmPassword: e.target.value }));
                    if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }));
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent ${
                    errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Workspace and Project Names */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Studio/Company Name <span className="text-gray-400">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.workspaceName}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, workspaceName: e.target.value }));
                    if (errors.workspaceName) setErrors(prev => ({ ...prev, workspaceName: '' }));
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent ${
                    errors.workspaceName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Awesome Games Studio"
                />
                {errors.workspaceName && (
                  <p className="mt-1 text-sm text-red-600">{errors.workspaceName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Game Project
                </label>
                <input
                  type="text"
                  required
                  value={formData.gameProjectName}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, gameProjectName: e.target.value }));
                    if (errors.gameProjectName) setErrors(prev => ({ ...prev, gameProjectName: '' }));
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent ${
                    errors.gameProjectName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Battle Royale Champions"
                />
                {errors.gameProjectName && (
                  <p className="mt-1 text-sm text-red-600">{errors.gameProjectName}</p>
                )}
              </div>
            </div>

            {/* Additional Developer Information - Only show if workspace name is provided */}
            {formData.workspaceName && (
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Size <span className="text-gray-400">(Optional)</span>
                  </label>
                  <select
                    value={formData.companySize}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, companySize: e.target.value }));
                      if (errors.companySize) setErrors(prev => ({ ...prev, companySize: '' }));
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent ${
                      errors.companySize ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select company size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="200+">200+ employees</option>
                    <option value="solo">Solo developer</option>
                  </select>
                  {errors.companySize && (
                    <p className="mt-1 text-sm text-red-600">{errors.companySize}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Role <span className="text-gray-400">(Optional)</span>
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, role: e.target.value }));
                      if (errors.role) setErrors(prev => ({ ...prev, role: '' }));
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent ${
                      errors.role ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select your role</option>
                    <option value="founder">Founder/CEO</option>
                    <option value="developer">Developer</option>
                    <option value="producer">Producer/PM</option>
                    <option value="designer">Game Designer</option>
                    <option value="artist">Artist</option>
                    <option value="analyst">Data Analyst</option>
                    <option value="marketing">Marketing</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.role && (
                    <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                  )}
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-gray-400">(Optional)</span>
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, phoneNumber: e.target.value }));
                    if (errors.phoneNumber) setErrors(prev => ({ ...prev, phoneNumber: '' }));
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent ${
                    errors.phoneNumber ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="+1 (555) 123-4567"
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Zone
                </label>
                <select
                  value={formData.timeZone}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, timeZone: e.target.value }));
                    if (errors.timeZone) setErrors(prev => ({ ...prev, timeZone: '' }));
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent ${
                    errors.timeZone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select time zone</option>
                  <option value="PST">Pacific (PST)</option>
                  <option value="MST">Mountain (MST)</option>
                  <option value="CST">Central (CST)</option>
                  <option value="EST">Eastern (EST)</option>
                  <option value="GMT">GMT (London)</option>
                  <option value="CET">Central European (CET)</option>
                  <option value="JST">Japan (JST)</option>
                  <option value="AEST">Australia Eastern (AEST)</option>
                  <option value="other">Other</option>
                </select>
                {errors.timeZone && (
                  <p className="mt-1 text-sm text-red-600">{errors.timeZone}</p>
                )}
              </div>
            </div>

            {/* Terms and Data Processing */}
            <div className={`space-y-3 p-4 rounded-lg border ${
              errors.acceptTerms || errors.acceptDataProcessing ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, acceptTerms: e.target.checked }));
                    if (errors.acceptTerms) setErrors(prev => ({ ...prev, acceptTerms: '' }));
                  }}
                  className="mt-0.5 mr-3 w-4 h-4 text-gray-600 border-gray-300 rounded focus:ring-gray-500 flex-shrink-0"
                />
                <label htmlFor="acceptTerms" className="text-sm text-gray-700">
                  I accept the{' '}
                  <a href="#" className="text-gray-600 hover:text-gray-700 underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-gray-600 hover:text-gray-700 underline">
                    Privacy Policy
                  </a>
                </label>
              </div>
              {errors.acceptTerms && (
                <p className="ml-7 text-sm text-red-600">{errors.acceptTerms}</p>
              )}

              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="acceptDataProcessing"
                  checked={formData.acceptDataProcessing}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, acceptDataProcessing: e.target.checked }));
                    if (errors.acceptDataProcessing) setErrors(prev => ({ ...prev, acceptDataProcessing: '' }));
                  }}
                  className="mt-0.5 mr-3 w-4 h-4 text-gray-600 border-gray-300 rounded focus:ring-gray-500 flex-shrink-0"
                />
                <label htmlFor="acceptDataProcessing" className="text-sm text-gray-700">
                  I consent to Nandi processing game analytics and player behavior data to optimize my store performance
                </label>
              </div>
              {errors.acceptDataProcessing && (
                <p className="ml-7 text-sm text-red-600">{errors.acceptDataProcessing}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-5">
              <button
                type="submit"
                disabled={loading}
                className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                {loading ? 'Creating Account...' : 'Create Account & Continue'}
              </button>
            </div>

            <div className="pt-4 border-t text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => router.push('/auth/signin')}
                  className="text-gray-800 hover:text-black font-medium underline"
                >
                  Sign in
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    }>
      <SignupContent />
    </Suspense>
  );
}