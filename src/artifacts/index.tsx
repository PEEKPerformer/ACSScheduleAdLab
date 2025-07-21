import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, CheckCircle, Play, Clock3, ExternalLink, Zap } from 'lucide-react';

interface Presentation {
  name: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  room: string;
  session: string;
  color: string;
}

const presentations: Presentation[] = [
  {
    name: "Deep Shikha Srivastava",
    title: "Multi-scale assembly of 2D material-stabilized PolyHIPEs: Controlling conductive networks through hierarchical structuring",
    date: "2025-08-18",
    startTime: "08:00",
    endTime: "08:25",
    room: "Hall D - Room 7",
    session: "2D-Nanocomposites: Advancing the Synthesis of Extreme Materials",
    color: "from-rose-600 to-pink-700"
  },
  {
    name: "Brenden Ferland",
    title: "Self-assembled graphene-silicone networks for responsive sensing and smart materials",
    date: "2025-08-18",
    startTime: "14:50",
    endTime: "15:15",
    room: "Hall D - Room 7",
    session: "2D-Nanocomposites: Advancing the Synthesis of Extreme Materials",
    color: "from-blue-600 to-indigo-700"
  },
  {
    name: "Dr. Adamson",
    title: "Solvent interface trapping method (SITM): In situ exfoliation of graphite and boron nitride for scalable materials synthesis",
    date: "2025-08-18",
    startTime: "15:15",
    endTime: "15:40",
    room: "Hall D - Room 7",
    session: "2D-Nanocomposites: Advancing the Synthesis of Extreme Materials",
    color: "from-emerald-600 to-teal-700"
  },
  {
    name: "Mahdad Mahmoudi",
    title: "Templating mechanically robust polymer-graphene high internal phase emulsions",
    date: "2025-08-19",
    startTime: "08:25",
    endTime: "08:50",
    room: "Hall D - Room 7",
    session: "2D-Nanocomposites: Advancing the Synthesis of Extreme Materials",
    color: "from-orange-600 to-amber-700"
  },
  {
    name: "Nishadi Bandara",
    title: "Moisture enabled electric power generation using graphene-based hydrogels",
    date: "2025-08-19",
    startTime: "13:40",
    endTime: "14:00",
    room: "Digital Meeting",
    session: "Science and Engineering of Polymeric Materials",
    color: "from-purple-600 to-violet-700"
  },
  {
    name: "Rumesha Perera",
    title: "Metal-free graphene-based membranes for electrochemical CO2 reduction",
    date: "2025-08-19",
    startTime: "14:25",
    endTime: "14:50",
    room: "Hall D - Room 7",
    session: "2D-Nanocomposites: Advancing the Synthesis of Extreme Materials",
    color: "from-cyan-600 to-blue-700"
  },
  {
    name: "Jakiya Sultana Joya",
    title: "Thermoresponsive and electrically conductive Graphene-reinforced double-network hydrogels via Solvent Interfacial Trapping Method",
    date: "2025-08-20",
    startTime: "08:36",
    endTime: "08:48",
    room: "Hall D - Room 2",
    session: "Novel Applications of Polymeric Materials",
    color: "from-red-600 to-rose-700"
  }
];

const FloatingOrb = ({ delay = 0, duration = 20 }) => (
  <div 
    className="fixed pointer-events-none opacity-20"
    style={{
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${delay}s`,
      animationDuration: `${duration}s`
    }}
  >
    <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-ping"></div>
  </div>
);

const ACSSchedule = () => {
  const [currentTime, setCurrentTime] = useState(new Date('2025-08-18T15:25:00')); // Simulating during Dr. Adamson's talk
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getPresentationDateTime = (presentation: Presentation) => {
    const [year, month, day] = presentation.date.split('-');
    const [hour, minute] = presentation.startTime.split(':');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute));
  };

  const getPresentationEndDateTime = (presentation: Presentation) => {
    const [year, month, day] = presentation.date.split('-');
    const [hour, minute] = presentation.endTime.split(':');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute));
  };

  const getStatus = (presentation: Presentation) => {
    const now = currentTime;
    const startTime = getPresentationDateTime(presentation);
    const endTime = getPresentationEndDateTime(presentation);
    
    if (now >= endTime) return 'completed';
    if (now >= startTime && now < endTime) return 'current';
    return 'upcoming';
  };

  const formatTime = (timeString: string) => {
    const [hour, minute] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hour), parseInt(minute));
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatDateShort = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric' 
    });
  };

  const findCurrentPresentation = () => {
    return presentations.find(p => getStatus(p) === 'current');
  };

  const findNextPresentation = () => {
    const now = currentTime;
    return presentations.find(p => {
      const startTime = getPresentationDateTime(p);
      return startTime > now;
    });
  };

  const getTimeUntilNext = (presentation: Presentation) => {
    const timeUntil = getPresentationDateTime(presentation).getTime() - currentTime.getTime();
    const hours = Math.floor(timeUntil / (1000 * 60 * 60));
    const minutes = Math.floor((timeUntil % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m`;
    return 'Starting soon';
  };

  const statusCounts = presentations.reduce((acc, p) => {
    const status = getStatus(p);
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, { completed: 0, current: 0, upcoming: 0 });

  const currentPresentation = findCurrentPresentation();
  const nextPresentation = findNextPresentation();

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 relative overflow-hidden">
      {/* Floating Orbs */}
      {Array.from({ length: 6 }, (_, i) => (
        <FloatingOrb key={i} delay={i * 3} duration={15 + Math.random() * 10} />
      ))}
      
      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-8 bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-slate-200 animate-[slideDown_0.8s_ease-out]">
          <div className="text-center lg:text-left mb-4 lg:mb-0">
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2 tracking-tight">
              Adamson Group
            </h1>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <p className="text-slate-600 text-lg">
                ACS Fall 2025 Schedule
              </p>
              <a 
                href="https://adamson.ims.uconn.edu/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline transition-all duration-300 hover:gap-2"
              >
                Group Website <ExternalLink className="w-3 h-3 transition-transform duration-300" />
              </a>
            </div>
          </div>
          
          <div className="flex gap-4 animate-[fadeIn_1s_ease-out_0.3s_both]">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 hover:scale-105 transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle className="w-4 h-4" />
                <span className="font-bold text-lg tabular-nums">{statusCounts.completed}</span>
                <span className="text-sm">Done</span>
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 hover:scale-105 transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-2 text-amber-700">
                <Play className="w-4 h-4" />
                <span className="font-bold text-lg tabular-nums">{statusCounts.current}</span>
                <span className="text-sm">Live</span>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-2xl px-4 py-3 hover:scale-105 transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-2 text-blue-700">
                <Clock3 className="w-4 h-4" />
                <span className="font-bold text-lg tabular-nums">{statusCounts.upcoming}</span>
                <span className="text-sm">Next</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Banner */}
        {currentPresentation && (
          <div className={`mb-8 bg-gradient-to-r ${currentPresentation.color} rounded-3xl p-8 shadow-xl text-white transform hover:scale-[1.02] transition-all duration-500 animate-[slideUp_0.8s_ease-out_0.4s_both]`}>
            <div className="flex items-start gap-4">
              <div className="bg-white/20 p-3 rounded-2xl animate-bounce">
                <Zap className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wide animate-pulse">Live Now</span>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-ping animation-delay-100"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-ping animation-delay-200"></div>
                  </div>
                </div>
                <div className="text-2xl lg:text-3xl font-bold mb-2 animate-[fadeInUp_0.6s_ease-out_0.6s_both] drop-shadow-lg">{currentPresentation.name}</div>
                <div className="text-white/90 text-base lg:text-lg mb-4 leading-relaxed animate-[fadeInUp_0.6s_ease-out_0.8s_both] drop-shadow-md">{currentPresentation.title}</div>
                <div className="flex flex-wrap gap-4 text-sm text-white/80 animate-[fadeInUp_0.6s_ease-out_1s_both]">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatTime(currentPresentation.startTime)} - {formatTime(currentPresentation.endTime)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{currentPresentation.room}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!currentPresentation && nextPresentation && (
          <div className={`mb-8 bg-gradient-to-r ${nextPresentation.color} rounded-3xl p-8 shadow-xl text-white transform hover:scale-[1.02] transition-all duration-500 animate-[slideUp_0.8s_ease-out_0.4s_both]`}>
            <div className="flex items-start gap-4">
              <div className="bg-white/20 p-3 rounded-2xl">
                <Clock3 className="w-8 h-8 animate-spin" style={{ animationDuration: '3s' }} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wide">Next Up</span>
                  <span className="bg-white/30 px-2 py-1 rounded-full text-xs font-medium animate-pulse">in {getTimeUntilNext(nextPresentation)}</span>
                </div>
                <div className="text-2xl lg:text-3xl font-bold mb-2 animate-[fadeInUp_0.6s_ease-out_0.6s_both] drop-shadow-lg">{nextPresentation.name}</div>
                <div className="text-white/90 text-base lg:text-lg mb-4 leading-relaxed animate-[fadeInUp_0.6s_ease-out_0.8s_both] drop-shadow-md">{nextPresentation.title}</div>
                <div className="flex flex-wrap gap-4 text-sm text-white/80 animate-[fadeInUp_0.6s_ease-out_1s_both]">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(nextPresentation.date)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatTime(nextPresentation.startTime)} - {formatTime(nextPresentation.endTime)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{nextPresentation.room}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!currentPresentation && !nextPresentation && (
          <div className="mb-8 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-8 shadow-xl text-white animate-[slideUp_0.8s_ease-out_0.4s_both]">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-2xl animate-bounce">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div>
                <div className="text-2xl lg:text-3xl font-bold mb-1 drop-shadow-lg">All presentations completed!</div>
                <div className="text-white/80 drop-shadow-md">Fantastic work, everyone! 🎉</div>
              </div>
            </div>
          </div>
        )}

        {/* Presentations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {presentations.map((presentation, index) => {
            const status = getStatus(presentation);
            
            const statusConfig = {
              completed: {
                opacity: 'opacity-60',
                transform: 'scale-95',
                icon: CheckCircle,
                badgeText: 'Complete',
                badgeColor: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
                animation: '' // Removed constant animation
              },
              current: {
                opacity: 'opacity-100',
                transform: 'scale-105 ring-4 ring-white/50',
                icon: Play,
                badgeText: 'Live Now',
                badgeColor: 'bg-white text-slate-900 border border-white shadow-lg animate-pulse',
                animation: '' // Moved pulse to badge instead of whole card
              },
              upcoming: {
                opacity: 'opacity-90',
                transform: 'scale-100',
                icon: Clock3,
                badgeText: 'Upcoming',
                badgeColor: 'bg-slate-100 text-slate-700 border border-slate-200',
                animation: '' // Removed constant animation
              }
            };

            const config = statusConfig[status];
            const StatusIcon = config.icon;

            return (
              <div
                key={index}
                className={`bg-gradient-to-br ${presentation.color} rounded-3xl p-6 shadow-lg text-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ${config.opacity} ${config.transform}`}
                style={{ 
                  animationDelay: `${index * 150}ms`,
                  animationFillMode: 'both'
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 pr-4">
                    <h3 className="text-xl font-bold mb-2 hover:scale-105 transition-transform duration-300 drop-shadow-lg">
                      {presentation.name}
                    </h3>
                    <p className="text-white/90 text-sm leading-relaxed line-clamp-3 drop-shadow-md">
                      {presentation.title}
                    </p>
                  </div>
                  <div className={`${config.badgeColor} px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 shrink-0 hover:scale-110 transition-transform duration-300`}>
                    <StatusIcon className="w-3 h-3" />
                    {config.badgeText}
                  </div>
                </div>

                <div className="space-y-3 text-sm text-white/90 drop-shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 hover:scale-105 transition-transform duration-300">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDateShort(presentation.date)}</span>
                    </div>
                    <div className="flex items-center gap-1 hover:scale-105 transition-transform duration-300">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(presentation.startTime)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 hover:scale-105 transition-transform duration-300">
                    <MapPin className="w-4 h-4" />
                    <span>{presentation.room}</span>
                  </div>
                  <div className="flex items-start gap-1 text-xs text-white/70 hover:text-white/90 transition-colors duration-300">
                    <Users className="w-3 h-3 mt-0.5 shrink-0" />
                    <span className="leading-tight">{presentation.session}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animation-delay-100 {
          animation-delay: 100ms;
        }
        
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        
        .animation-delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </div>
  );
};

export default ACSSchedule;