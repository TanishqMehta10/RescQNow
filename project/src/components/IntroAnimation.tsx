import React, { useState, useEffect } from 'react';
import { Shield, MapPin, AlertTriangle, Users, Globe, Zap } from 'lucide-react';

interface IntroAnimationProps {
  onComplete: () => void;
}

const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const steps = [
    {
      icon: Shield,
      title: "Smart Tourist Safety",
      subtitle: "AI-Powered Protection System",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: MapPin,
      title: "Real-Time Monitoring",
      subtitle: "Geo-Fencing & Location Tracking",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: AlertTriangle,
      title: "Emergency Response",
      subtitle: "Instant SOS & Alert System",
      color: "from-red-500 to-orange-600"
    },
    {
      icon: Users,
      title: "Crowd Analytics",
      subtitle: "AI-Powered Density Monitoring",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: Globe,
      title: "Blockchain Security",
      subtitle: "Digital Identity Verification",
      color: "from-cyan-500 to-blue-600"
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        // Start fade out animation
        setIsVisible(false);
        setTimeout(() => {
          onComplete();
        }, 1000);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [currentStep, steps.length, onComplete]);

  const currentStepData = steps[currentStep];
  const IconComponent = currentStepData.icon;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-1000 ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-20 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-8">
        {/* Logo Animation */}
        <div className="mb-8">
          <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-r ${currentStepData.color} shadow-2xl transform transition-all duration-1000 animate-bounce`}>
            <IconComponent className="w-16 h-16 text-white" />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4 transform transition-all duration-1000">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 animate-fade-in">
            ResQNow
          </h1>
          
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-semibold text-white/90 animate-slide-up">
              {currentStepData.title}
            </h2>
            <p className="text-lg md:text-xl text-white/70 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              {currentStepData.subtitle}
            </p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-12 flex justify-center space-x-3">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-500 ${
                index === currentStep 
                  ? `bg-gradient-to-r ${currentStepData.color} scale-125` 
                  : index < currentStep 
                    ? 'bg-white/60' 
                    : 'bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Skip Button */}
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onComplete, 500);
          }}
          className="absolute top-8 right-8 text-white/60 hover:text-white transition-colors duration-300 text-sm font-medium"
        >
          Skip Intro
        </button>
      </div>

      {/* Bottom Wave Animation */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-24 text-white/10"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
            className="animate-pulse"
            fill="currentColor"
          />
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
            className="animate-pulse"
            style={{ animationDelay: '1s' }}
            fill="currentColor"
          />
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            className="animate-pulse"
            style={{ animationDelay: '2s' }}
            fill="currentColor"
          />
        </svg>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 1s ease-out;
        }
      `}</style>
    </div>
  );
};

export default IntroAnimation;