"use client";

import { handleLogin } from "./actions";
import { useState, useEffect } from "react";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useToast } from "../contexts/ToastContext";

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:from-indigo-400 disabled:to-purple-400 transform transition-all duration-200 hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-xl"
    >
      {pending ? (
        <div className="flex items-center">
          <LoadingSpinner size="sm" color="white" className="mr-3" />
          Signing in...
        </div>
      ) : (
        <div className="flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
          Sign in
        </div>
      )}
    </button>
  );
}

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin");
  const [isFormValid, setIsFormValid] = useState(true);
  const [shake, setShake] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'Enter') {
        const form = document.querySelector('form');
        if (form) {
          form.requestSubmit();
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  useEffect(() => {
    setIsFormValid(username.trim().length > 0 && password.trim().length > 0);
  }, [username, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    if (!isFormValid) {
      e.preventDefault();
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    e.preventDefault();
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      
      const result = await handleLogin(formData);
      
      if (result && !result.success) {
        showToast(result.error || "Login failed", "error");
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
      // If no result is returned, it means redirect was successful
    } catch (error: any) {
      // Check if this is a redirect error (successful login)
      if (error?.digest?.includes('NEXT_REDIRECT') || error?.message?.includes('NEXT_REDIRECT')) {
        // This is a successful redirect, don't show error
        return;
      }
      
      console.error('Login error:', error);
      showToast("An unexpected error occurred. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`mt-8 space-y-6 transition-all duration-300 ${shake ? 'animate-pulse' : ''}`}>
      <div className="space-y-4">
        <div className="relative group">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <div className="relative">
            <input
              id="username"
              name="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full px-4 py-3 bg-white border-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${
                username.trim().length > 0 
                  ? 'border-green-300 focus:border-green-500' 
                  : 'border-gray-300 focus:border-indigo-500'
              } ${shake ? 'border-red-300' : ''}`}
              placeholder="Enter your username"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              {username.trim().length > 0 && (
                <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </div>
        </div>

        <div className="relative group">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-3 bg-white border-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${
                password.trim().length > 0 
                  ? 'border-green-300 focus:border-green-500' 
                  : 'border-gray-300 focus:border-indigo-500'
              } ${shake ? 'border-red-300' : ''}`}
              placeholder="Enter your password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
            Remember me
          </label>
        </div>

        <div className="text-sm">
          <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
            Forgot your password?
          </a>
        </div>
      </div>

      <div>
        <SubmitButton pending={isLoading} />
      </div>

      {!isFormValid && shake && (
        <div className="text-red-600 text-sm text-center animate-pulse">
          Please fill in all required fields
        </div>
      )}

      <div className="text-center space-y-2">
        
        <p className="text-xs text-gray-500">
          💡 Tip: Press <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">Ctrl + Enter</kbd> to submit
        </p>
      </div>
    </form>
  );
}
