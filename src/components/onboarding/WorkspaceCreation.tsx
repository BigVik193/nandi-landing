'use client';

import { useState } from 'react';
import { HiUsers, HiPlus, HiX } from 'react-icons/hi';

interface WorkspaceCreationProps {
  onNext: (data: any) => void;
  onBack: () => void;
}

export default function WorkspaceCreation({ onNext, onBack }: WorkspaceCreationProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    workspaceName: '',
    gameProjectName: '',
    collaborators: [{ email: '', role: 'Developer' }],
    acceptTerms: false,
    acceptDataProcessing: false
  });

  const [isSignUp, setIsSignUp] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const roles = ['Owner', 'Developer', 'Producer/PM', 'Analyst'];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (isSignUp && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (isSignUp) {
      if (!formData.workspaceName) {
        newErrors.workspaceName = 'Studio/Company name is required';
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
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      onNext(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addCollaborator = () => {
    setFormData(prev => ({
      ...prev,
      collaborators: [...prev.collaborators, { email: '', role: 'Developer' }]
    }));
  };

  const updateCollaborator = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      collaborators: prev.collaborators.map((collab, i) => 
        i === index ? { ...collab, [field]: value } : collab
      )
    }));
  };

  const removeCollaborator = (index: number) => {
    setFormData(prev => ({
      ...prev,
      collaborators: prev.collaborators.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 max-w-2xl mx-auto">
      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
        <HiUsers className="w-6 h-6 text-gray-600" />
      </div>
      <h2 className="text-2xl font-bold mb-6 text-center text-black">Create Your Account</h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Sign Up / Sign In Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-5">
          <button
            type="button"
            onClick={() => setIsSignUp(true)}
            className={`flex-1 py-2 px-3 rounded-md font-medium transition-colors ${
              isSignUp ? 'bg-white text-black shadow-sm' : 'text-gray-600'
            }`}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => setIsSignUp(false)}
            className={`flex-1 py-2 px-3 rounded-md font-medium transition-colors ${
              !isSignUp ? 'bg-white text-black shadow-sm' : 'text-gray-600'
            }`}
          >
            Sign In
          </button>
        </div>

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
              placeholder={isSignUp ? "Create a strong password" : "Enter your password"}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>
        </div>

        {isSignUp && (
          <>
            {/* Workspace and Project Names */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Studio/Company Name
                </label>
                <input
                  type="text"
                  required
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

            {/* Collaborators */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Team Members (Optional)
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, collaborators: [{ email: '', role: 'Developer' }] }));
                    }}
                    className="text-gray-500 hover:text-gray-600 text-sm font-medium"
                  >
                    Skip for now
                  </button>
                  <button
                    type="button"
                    onClick={addCollaborator}
                    className="text-gray-600 hover:text-gray-700 font-medium flex items-center gap-1"
                  >
                    <HiPlus className="w-4 h-4" />
                    Add Collaborator
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {formData.collaborators.map((collaborator, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <input
                      type="email"
                      value={collaborator.email}
                      onChange={(e) => updateCollaborator(index, 'email', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      placeholder="teammate@yourstudio.com"
                    />
                    <select
                      value={collaborator.role}
                      onChange={(e) => updateCollaborator(index, 'role', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    >
                      {roles.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                    {formData.collaborators.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCollaborator(index)}
                        className="text-red-600 hover:text-red-700 font-medium px-2 flex items-center justify-center"
                      >
                        <HiX className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
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
                  className="mt-1 mr-3 w-4 h-4 text-gray-600 border-gray-300 rounded focus:ring-gray-500"
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
                  className="mt-1 mr-3 w-4 h-4 text-gray-600 border-gray-300 rounded focus:ring-gray-500"
                />
                <label htmlFor="acceptDataProcessing" className="text-sm text-gray-700">
                  I consent to Nandi processing game analytics and player behavior data to optimize my store performance
                </label>
              </div>
              {errors.acceptDataProcessing && (
                <p className="ml-7 text-sm text-red-600">{errors.acceptDataProcessing}</p>
              )}
            </div>
          </>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-5">
          <button
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {isSubmitting 
              ? 'Creating Account...' 
              : isSignUp ? 'Create Account & Continue' : 'Sign In'
            }
          </button>
        </div>
      </form>
    </div>
  );
}