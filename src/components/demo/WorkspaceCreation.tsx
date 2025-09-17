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

  const roles = ['Owner', 'Developer', 'Producer/PM', 'Analyst'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.acceptTerms || !formData.acceptDataProcessing) {
      alert('Please accept the terms and data processing agreement to continue.');
      return;
    }
    onNext(formData);
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
    <div className="bg-section rounded-2xl p-8 border-2 border-black shadow-lg">
      <div className="w-14 h-14 bg-purple-300 rounded-full flex items-center justify-center mb-6 mx-auto">
        <HiUsers className="w-7 h-7 text-purple-900" />
      </div>
      <h2 className="text-3xl font-bold mb-6 text-center text-black">Create Your Account</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sign Up / Sign In Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          <button
            type="button"
            onClick={() => setIsSignUp(true)}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              isSignUp ? 'bg-white text-black shadow-sm' : 'text-gray-600'
            }`}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => setIsSignUp(false)}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
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
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="you@company.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder={isSignUp ? "Create a strong password" : "Enter your password"}
            />
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
                  onChange={(e) => setFormData(prev => ({ ...prev, workspaceName: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Awesome Games Studio"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Game Project
                </label>
                <input
                  type="text"
                  required
                  value={formData.gameProjectName}
                  onChange={(e) => setFormData(prev => ({ ...prev, gameProjectName: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Battle Royale Champions"
                />
              </div>
            </div>

            {/* Collaborators */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Team Members (Optional)
                </label>
                <button
                  type="button"
                  onClick={addCollaborator}
                  className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
                >
                  <HiPlus className="w-4 h-4" />
                  Add Collaborator
                </button>
              </div>

              <div className="space-y-3">
                {formData.collaborators.map((collaborator, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    <input
                      type="email"
                      value={collaborator.email}
                      onChange={(e) => updateCollaborator(index, 'email', e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="teammate@yourstudio.com"
                    />
                    <select
                      value={collaborator.role}
                      onChange={(e) => updateCollaborator(index, 'role', e.target.value)}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
            <div className="space-y-4 bg-gray-50 p-6 rounded-2xl border border-gray-200">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={(e) => setFormData(prev => ({ ...prev, acceptTerms: e.target.checked }))}
                  className="mt-1 mr-3 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="acceptTerms" className="text-sm text-gray-700">
                  I accept the{' '}
                  <a href="#" className="text-purple-600 hover:text-purple-700 underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-purple-600 hover:text-purple-700 underline">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="acceptDataProcessing"
                  checked={formData.acceptDataProcessing}
                  onChange={(e) => setFormData(prev => ({ ...prev, acceptDataProcessing: e.target.checked }))}
                  className="mt-1 mr-3 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="acceptDataProcessing" className="text-sm text-gray-700">
                  I consent to Nandi processing game analytics and player behavior data to optimize my store performance
                </label>
              </div>
            </div>
          </>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={onBack}
            className="border-2 border-black text-black px-8 py-4 rounded-full font-medium text-lg hover:bg-black hover:text-white transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            className="bg-black text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-gray-800 transition-colors"
          >
            {isSignUp ? 'Create Account & Continue' : 'Sign In'}
          </button>
        </div>
      </form>
    </div>
  );
}