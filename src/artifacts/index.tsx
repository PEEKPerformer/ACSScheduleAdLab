import { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, MapPin, Users, CheckCircle, Play, Clock3, ExternalLink, Zap, X, BookOpen, CalendarPlus, ChevronDown } from 'lucide-react';
import abstractsData from '../data/abstracts.json';

interface Presentation {
  name: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  room: string;
  session: string;
  color: string;
  onlineLink?: string;
}

interface AbstractData {
  abstract: string;
  acsLink?: string;
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
    name: "Douglas Adamson",
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
    room: "Digital Session (Digital Meeting)",
    session: "Science and Engineering of Polymeric Materials",
    color: "from-purple-600 to-violet-700",
    onlineLink: "https://acs.digitellinc.com/live/35/session/569368/attend"
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

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<any[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticle = () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.2,
      color: (() => {
        const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];
        return colors[Math.floor(Math.random() * colors.length)];
      })(),
    });

    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < 80; i++) {
        particlesRef.current.push(createParticle());
      }
    };

    const updateParticles = () => {
      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      particles.forEach((particle, i) => {
        // Mouse interaction
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          const force = (100 - distance) / 100;
          particle.vx -= (dx / distance) * force * 0.01;
          particle.vy -= (dy / distance) * force * 0.01;
        }

        // Particle interactions
        particles.forEach((otherParticle, j) => {
          if (i !== j) {
            const pdx = otherParticle.x - particle.x;
            const pdy = otherParticle.y - particle.y;
            const pdistance = Math.sqrt(pdx * pdx + pdy * pdy);
            
            if (pdistance < 50 && pdistance > 0) {
              const force = (50 - pdistance) / 50;
              particle.vx -= (pdx / pdistance) * force * 0.002;
              particle.vy -= (pdy / pdistance) * force * 0.002;
            }
          }
        });

        // Apply velocity with damping
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.99;
        particle.vy *= 0.99;

        // Boundary conditions with gentle bounce
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.vx *= -0.5;
          particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.vy *= -0.5;
          particle.y = Math.max(0, Math.min(canvas.height, particle.y));
        }
      });
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const particles = particlesRef.current;
      
      // Draw connections
      particles.forEach((particle, i) => {
        particles.slice(i + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            const opacity = (100 - distance) / 100 * 0.2;
            ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        });
      });

      // Draw particles
      particles.forEach((particle) => {
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      
      ctx.globalAlpha = 1;
    };

    const animate = () => {
      updateParticles();
      drawParticles();
      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleResize = () => {
      resizeCanvas();
      initParticles();
    };

    resizeCanvas();
    initParticles();
    animate();

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-60"
      style={{ zIndex: 1 }}
    />
  );
};

const ACSSchedule = () => {
  const [currentTime, setCurrentTime] = useState(new Date()); // Start with actual current time
  const [mounted, setMounted] = useState(false);
  const [selectedPresentation, setSelectedPresentation] = useState<Presentation | null>(null);
  const [showAbstractModal, setShowAbstractModal] = useState(false);
  const [showCalendarDropdown, setShowCalendarDropdown] = useState(false);
  const [cardCalendarDropdowns, setCardCalendarDropdowns] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Close calendar dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Close modal dropdown
      if (showCalendarDropdown && !target.closest('.calendar-dropdown-container')) {
        setShowCalendarDropdown(false);
      }
      
      // Close any open card dropdowns
      if (Object.values(cardCalendarDropdowns).some(Boolean) && !target.closest('.card-calendar-dropdown')) {
        setCardCalendarDropdowns({});
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCalendarDropdown, cardCalendarDropdowns]);

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

  const handleCardClick = (presentation: Presentation) => {
    setSelectedPresentation(presentation);
    setShowAbstractModal(true);
  };

  const closeModal = () => {
    setShowAbstractModal(false);
    setSelectedPresentation(null);
    setShowCalendarDropdown(false);
  };

  const toggleCardCalendarDropdown = (index: number) => {
    setCardCalendarDropdowns(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const extractSessionId = (acsLink: string): string | null => {
    const match = acsLink.match(/\/session\/(\d+)/);
    return match ? match[1] : null;
  };

  const createCalendarUrl = (acsLink: string, format: 'ics' | 'google'): string | null => {
    const sessionId = extractSessionId(acsLink);
    if (!sessionId) return null;
    return `https://acs.digitellinc.com/live/35/session/${sessionId}/calendar?format=${format}`;
  };

  const getAbstractData = (presenterName: string): AbstractData | null => {
    return (abstractsData as Record<string, AbstractData>)[presenterName] || null;
  };

  const isOnlinePresentation = (room: string) => {
    return room.toLowerCase().includes('digital') || room.toLowerCase().includes('online');
  };

  const highlightScientificTerms = (text: string) => {
    const keyPhrases = [
      'novel graphene-silicone composite',
      'stable electrical responsiveness during repeated mechanical deformation cycles',
      'stable gauge factor of ~2.2',
      'Solvent Interface Trapping Method (SITM)',
      'thermodynamically driven exfoliation mechanism',
      'bicontinuous network of overlapping graphene sheets',
      'combination of two different particulate 2D surfactants',
      'tunable gradient conductive and insulating domains',
      'homogeneous integration of both 2D surfactants',
      'emulsifying needles to generate highly monodisperse polymer-graphene HIPEs',
      'increased compressive strength by a factor of 2.3 and doubled Young\'s modulus',
      'polydispersity index (PDI < 0.1)',
      'Moist-Electric Generator (MEG)',
      'gradient distribution of functional groups',
      'ion concentration gradient',
      'high open circuit voltage of 0.74 V',
      'increased voltage of 18.4 V by integrating multiple MEG units in series',
      'graphene-polyamide composite membrane',
      'electrically conductive active membranes',
      'resistor-capacitor network',
      'conductive double network (DN) hydrogel',
      'pristine graphene-coated poly (N-isopropylacrylamide) (PNIPAM) spheres',
      'intrinsic percolating graphene network',
      'lower critical solution temperature (LCST)',
      'light an LED and power an LCD calculator',
      'moisture-to-electricity conversion'
    ];
    
    const highlightColors = [
      'bg-blue-100 text-blue-900',
      'bg-emerald-100 text-emerald-900',
      'bg-purple-100 text-purple-900',
      'bg-orange-100 text-orange-900',
      'bg-rose-100 text-rose-900',
      'bg-indigo-100 text-indigo-900',
      'bg-teal-100 text-teal-900',
      'bg-amber-100 text-amber-900'
    ];
    
    let highlightedText = text;
    
    // Sort by length (longest first) to avoid partial matches
    keyPhrases.sort((a, b) => b.length - a.length);
    
    keyPhrases.forEach((phrase, index) => {
      const escapedPhrase = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escapedPhrase, 'gi');
      const colorClass = highlightColors[index % highlightColors.length];
      highlightedText = highlightedText.replace(regex, `<span class="${colorClass} px-1 rounded font-medium">$&</span>`);
    });
    
    return highlightedText;
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 relative overflow-hidden">
      {/* Interactive Particle Background */}
      <ParticleBackground />
      
      {/* Abstract Modal */}
      {showAbstractModal && selectedPresentation && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4" onClick={closeModal}>
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden shadow-2xl animate-[slideUp_0.3s_ease-out] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className={`bg-gradient-to-r ${selectedPresentation.color} p-3 sm:p-6 text-white relative`}>
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 p-1.5 sm:p-2 hover:bg-white/20 rounded-full transition-colors duration-300"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <div className="pr-8 sm:pr-12">
                <div className="flex items-center gap-3 mb-3">
                  <BookOpen className="w-6 h-6" />
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                    {selectedPresentation.session}
                  </span>
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold mb-2 drop-shadow-lg">
                  {selectedPresentation.name}
                </h2>
                <h3 className="text-lg lg:text-xl text-white/90 mb-4 leading-relaxed drop-shadow-md">
                  {selectedPresentation.title}
                </h3>
                <div className="flex flex-wrap gap-4 text-sm text-white/80">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(selectedPresentation.date)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatTime(selectedPresentation.startTime)} - {formatTime(selectedPresentation.endTime)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedPresentation.room}</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-white/20">
                  <div className="flex items-center gap-3 flex-wrap">
                    {(() => {
                      const abstractData = getAbstractData(selectedPresentation.name);
                      return abstractData?.acsLink ? (
                        <a
                          href={abstractData.acsLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 hover:scale-105 group"
                        >
                          <ExternalLink className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          View ACS Abstract
                        </a>
                      ) : null;
                    })()}
                    
                    {(() => {
                      const abstractData = getAbstractData(selectedPresentation.name);
                      return abstractData?.acsLink ? (
                        <div className="relative calendar-dropdown-container">
                          <button
                            onClick={() => setShowCalendarDropdown(!showCalendarDropdown)}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 hover:scale-105 group shadow-lg"
                          >
                            <CalendarPlus className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                            Add to Calendar
                            <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${showCalendarDropdown ? 'rotate-180' : ''}`} />
                          </button>
                          
                          {showCalendarDropdown && (
                            <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50 min-w-[200px] animate-[slideUp_0.2s_ease-out]">
                              <div className="p-1">
                                <a
                                  href={createCalendarUrl(abstractData.acsLink, 'google') || '#'}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors duration-200 group text-slate-700"
                                >
                                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                    <Calendar className="w-4 h-4 text-white" />
                                  </div>
                                  <div>
                                    <div className="font-medium text-sm">Google Calendar</div>
                                    <div className="text-xs text-slate-500">Add to Google</div>
                                  </div>
                                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-600 ml-auto transition-colors duration-200" />
                                </a>
                                
                                <a
                                  href={createCalendarUrl(abstractData.acsLink, 'ics') || '#'}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-indigo-50 transition-colors duration-200 group text-slate-700"
                                >
                                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <Calendar className="w-4 h-4 text-white" />
                                  </div>
                                  <div>
                                    <div className="font-medium text-sm">Outlook / iCal</div>
                                    <div className="text-xs text-slate-500">Download .ics file</div>
                                  </div>
                                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 ml-auto transition-colors duration-200" />
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : null;
                    })()}
                    
                    {selectedPresentation.onlineLink && (
                      <a
                        href={selectedPresentation.onlineLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 hover:scale-105 group shadow-lg"
                      >
                        <Play className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                        View Online
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="p-3 sm:p-6 flex-1 overflow-y-auto">
              {(() => {
                const abstractData = getAbstractData(selectedPresentation.name);
                return abstractData ? (
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-2 sm:mb-3 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                      Abstract
                    </h4>
                    <div 
                      className="text-slate-700 leading-relaxed text-sm sm:text-base whitespace-pre-line"
                      dangerouslySetInnerHTML={{
                        __html: highlightScientificTerms(abstractData.abstract)
                      }}
                    />
                  </div>
                ) : (
                  <div className="text-center py-4 sm:py-8">
                    <BookOpen className="w-8 h-8 sm:w-12 sm:h-12 text-slate-400 mx-auto mb-2 sm:mb-4" />
                    <p className="text-slate-600 text-base sm:text-lg font-medium">Abstract not available</p>
                    <p className="text-slate-500 text-xs sm:text-sm mt-1 sm:mt-2">
                      Abstract content for this presentation hasn't been added yet.
                    </p>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-8 bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-slate-200 animate-[slideDown_0.8s_ease-out]">
          <div className="text-center lg:text-left mb-4 lg:mb-0">
            <div className="flex flex-col items-center lg:items-start gap-4">
              <img 
                src="src/logo4_horizontal.webp" 
                alt="Adamson Lab Logo" 
                className="h-24 lg:h-32 w-auto object-contain drop-shadow-md hover:scale-105 transition-transform duration-300"
              />
              <div>
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
          <div onClick={() => handleCardClick(currentPresentation)} className={`mb-8 bg-gradient-to-r ${currentPresentation.color} rounded-3xl p-8 shadow-xl text-white transform hover:scale-[1.02] transition-all duration-500 animate-[slideUp_0.8s_ease-out_0.4s_both] cursor-pointer group`}>
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
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-2xl lg:text-3xl font-bold animate-[fadeInUp_0.6s_ease-out_0.6s_both] drop-shadow-lg">{currentPresentation.name}</div>
                  <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 animate-float">
                    <BookOpen className="w-6 h-6 text-white/80" />
                  </div>
                </div>
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
          <div onClick={() => handleCardClick(nextPresentation)} className={`mb-8 bg-gradient-to-r ${nextPresentation.color} rounded-3xl p-8 shadow-xl text-white transform hover:scale-[1.02] transition-all duration-500 animate-[slideUp_0.8s_ease-out_0.4s_both] cursor-pointer group`}>
            <div className="flex items-start gap-4">
              <div className="bg-white/20 p-3 rounded-2xl">
                <Clock3 className="w-8 h-8 animate-spin" style={{ animationDuration: '3s' }} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wide">Next Up</span>
                  <span className="bg-white/30 px-2 py-1 rounded-full text-xs font-medium animate-pulse">in {getTimeUntilNext(nextPresentation)}</span>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-2xl lg:text-3xl font-bold animate-[fadeInUp_0.6s_ease-out_0.6s_both] drop-shadow-lg">{nextPresentation.name}</div>
                  <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 animate-float">
                    <BookOpen className="w-6 h-6 text-white/80" />
                  </div>
                </div>
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
                onClick={() => handleCardClick(presentation)}
                className={`bg-gradient-to-br ${presentation.color} rounded-3xl p-6 shadow-lg text-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ${config.opacity} ${config.transform} cursor-pointer group`}
                style={{ 
                  animationDelay: `${index * 150}ms`,
                  animationFillMode: 'both'
                }}
                title="Click to view abstract"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold hover:scale-105 transition-transform duration-300 drop-shadow-lg">
                        {presentation.name}
                      </h3>
                      <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 animate-bounce">
                        <BookOpen className="w-4 h-4 text-white/80" />
                      </div>
                    </div>
                    {isOnlinePresentation(presentation.room) && (
                      <div className="mb-2">
                        <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse inline-block">
                          ONLINE PRESENTATION
                        </div>
                      </div>
                    )}
                    <p className="text-white/90 text-sm leading-relaxed line-clamp-3 drop-shadow-md">
                      {presentation.title}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className={`${config.badgeColor} px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 shrink-0 hover:scale-110 transition-transform duration-300`}>
                      <StatusIcon className="w-3 h-3" />
                      {config.badgeText}
                    </div>
                    {(() => {
                      const abstractData = getAbstractData(presentation.name);
                      return abstractData?.acsLink ? (
                        <div className="relative card-calendar-dropdown">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCardCalendarDropdown(index);
                            }}
                            className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 hover:scale-105 flex items-center gap-1"
                          >
                            <CalendarPlus className="w-3 h-3" />
                            Add to Calendar
                            <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${cardCalendarDropdowns[index] ? 'rotate-180' : ''}`} />
                          </button>
                          
                          {cardCalendarDropdowns[index] && (
                            <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden z-50 min-w-[160px] animate-[slideUp_0.2s_ease-out]">
                              <a
                                href={createCalendarUrl(abstractData.acsLink, 'google') || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-2 px-3 py-2 hover:bg-blue-50 transition-colors duration-200 text-slate-700 text-sm"
                              >
                                <div className="w-4 h-4 bg-blue-500 rounded flex items-center justify-center">
                                  <Calendar className="w-2.5 h-2.5 text-white" />
                                </div>
                                Google Calendar
                              </a>
                              
                              <a
                                href={createCalendarUrl(abstractData.acsLink, 'ics') || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-2 px-3 py-2 hover:bg-indigo-50 transition-colors duration-200 text-slate-700 text-sm"
                              >
                                <div className="w-4 h-4 bg-indigo-500 rounded flex items-center justify-center">
                                  <CalendarPlus className="w-2.5 h-2.5 text-white" />
                                </div>
                                Outlook / iCal
                              </a>
                            </div>
                          )}
                        </div>
                      ) : null;
                    })()}
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
                
                {presentation.onlineLink && (
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <a
                      href={presentation.onlineLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 hover:scale-105 group shadow-lg w-full justify-center"
                    >
                      <Play className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                      Join Online Presentation
                    </a>
                  </div>
                )}
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
        
        .animate-float {
          animation: float 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ACSSchedule;