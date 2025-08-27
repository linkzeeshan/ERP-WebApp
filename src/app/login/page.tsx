"use client";

import Image from "next/image";
import Link from "next/link";
import LoginForm from "./LoginForm";
import CompanyInfo from "../components/CompanyInfo";
import { useState, useEffect } from "react";

export default function LoginPage() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [particles, setParticles] = useState<Array<{
    left: string;
    top: string;
    animationDelay: string;
    animationDuration: string;
  }>>([]);

  useEffect(() => {
    setShowWelcome(true);
    
    // Generate random particle positions only on client side
    const particleData = Array.from({ length: 6 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 2}s`,
      animationDuration: `${2 + Math.random() * 2}s`
    }));
    setParticles(particleData);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {particles.map((particle, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-indigo-300 rounded-full animate-pulse"
            style={{
              left: particle.left,
              top: particle.top,
              animationDelay: particle.animationDelay,
              animationDuration: particle.animationDuration
            }}
          />
        ))}
      </div>

      <div className={`relative z-10 w-full max-w-md transform transition-all duration-1000 ${
        showWelcome ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}>
        {/* Main login card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20 hover:shadow-3xl transition-all duration-300">
          <div className="text-center mb-8">
            {/* Animated logo */}
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full blur-lg opacity-30 animate-pulse"></div>
              <img
                src="/sunflag-logo.jpg"
                alt="Sunflag Thailand"
                className="relative h-20 w-auto mx-auto transform hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Sunflag ERP
            </h1>
            <p className="text-sm text-gray-600 mb-1">Sign in to your account</p>
            <p className="text-xs text-gray-500 italic">Quality is our priority</p>
          </div>
          
          <LoginForm />
        </div>

        {/* Company info card */}
        <div className="mt-8 bg-white/60 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
          <CompanyInfo variant="full" />
        </div>

        
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="text-xs text-gray-500 text-center">
          <p>© 2024 Sunflag Thailand Ltd. All rights reserved.</p>
          <p className="mt-1">
            <span className="inline-flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              Rojana Industrial Park, Ayuthaya, Thailand
            </span>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
