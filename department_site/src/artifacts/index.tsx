import { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, MapPin, Users, CheckCircle, Play, Clock3, ExternalLink, Zap, GraduationCap, FileImage, X, BookOpen } from 'lucide-react';
import abstractsData from '../data/abstracts.json';

interface Presentation {
  name: string;
  lab: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  room: string;
  building: string;
  color: string;
  isSymposium?: boolean;
  isExternalSpeaker?: boolean;
  isDuplicate?: boolean;
  isPosterSession?: boolean;
  onlineLink?: string;
}

interface AbstractData {
  abstract: string;
  acsLink?: string;
}

// Color schemes - same color for each lab, plus symposium
const labColors = {
  'Adamson Lab': 'from-blue-600 to-indigo-700',
  'Burke Lab': 'from-emerald-600 to-green-700', 
  'Sotzing Lab': 'from-purple-600 to-violet-700',
  'Lin Lab': 'from-orange-600 to-amber-700',
  'Nieh Lab': 'from-red-600 to-rose-700',
  '60th Anniversary Symposium': 'from-amber-500 to-orange-600'
};

// Parse the CSV data and symposium data
const presentations: Presentation[] = [
  // Student presentations
  {
    name: "Deep Shikha Srivastava",
    lab: "Adamson Lab",
    title: "Multi-scale Assembly of 2D Material-stabilized PolyHIPEs: Controlling Conductive Networks through Hierarchical Structuring",
    date: "2025-08-18",
    startTime: "08:00",
    endTime: "08:25",
    room: "Hall D, room 7",
    building: "Walter E. Washington Convention Center",
    color: labColors['Adamson Lab']
  },
  {
    name: "Cassidy Soard",
    lab: "Burke Lab",
    title: "Synthesis of silk-based polymer-grafted nanoparticles",
    date: "2025-08-20",
    startTime: "08:45",
    endTime: "09:00",
    room: "River Birch Room A",
    building: "The Westin DC Downtown",
    color: labColors['Burke Lab']
  },
  {
    name: "Brenden Ferland",
    lab: "Adamson Lab",
    title: "Self-assembled graphene-silicone networks for responsive sensing and smart materials",
    date: "2025-08-18",
    startTime: "14:50",
    endTime: "15:15",
    room: "Hall D, room 7",
    building: "Walter E. Washington Convention Center",
    color: labColors['Adamson Lab']
  },
  {
    name: "Douglas Adamson",
    lab: "Adamson Lab",
    title: "Solvent interface trapping method (SITM): In situ exfoliation of graphite and boron nitride for scalable materials synthesis",
    date: "2025-08-18",
    startTime: "15:15",
    endTime: "15:40",
    room: "Hall D, room 7",
    building: "Walter E. Washington Convention Center",
    color: labColors['Adamson Lab']
  },
  {
    name: "Vishwa Suthar",
    lab: "Sotzing Lab",
    title: "Poly cannabinoids: biodegradable coatings for fruit preservation",
    date: "2025-08-18",
    startTime: "12:00",
    endTime: "14:00",
    room: "Hall C",
    building: "Walter E. Washington Convention Center",
    color: labColors['Sotzing Lab'],
    isPosterSession: true
  },
  {
    name: "Vishwa Suthar",
    lab: "Sotzing Lab",
    title: "Poly cannabinoids: biodegradable coatings for fruit preservation",
    date: "2025-08-18",
    startTime: "20:00",
    endTime: "22:00",
    room: "Hall C",
    building: "Walter E. Washington Convention Center",
    color: labColors['Sotzing Lab'],
    isPosterSession: true
  },
  {
    name: "Mahdad Mahmoudi",
    lab: "Adamson Lab",
    title: "Templating Mechanically Robust Polymer-Graphene High Internal Phase Emulsions",
    date: "2025-08-19",
    startTime: "08:25",
    endTime: "08:50",
    room: "Hall D, room 7",
    building: "Walter E. Washington Convention Center",
    color: labColors['Adamson Lab']
  },
  {
    name: "Jianan Mao",
    lab: "Lin Lab",
    title: "Designing β-sheet-rich random Copolypeptides for tunable hydrogels with diverse mechanical and responsive properties",
    date: "2025-08-19",
    startTime: "10:30",
    endTime: "10:50",
    room: "Room 103A",
    building: "Walter E. Washington Convention Center",
    color: labColors['Lin Lab']
  },
  {
    name: "Rumesha Perera",
    lab: "Adamson Lab",
    title: "Metal-Free Graphene-Based Membranes for Electrochemical CO₂ Reduction",
    date: "2025-08-19",
    startTime: "14:25",
    endTime: "14:50",
    room: "Hall D, room 7",
    building: "Walter E. Washington Convention Center",
    color: labColors['Adamson Lab']
  },
  {
    name: "Abrar Ali Sitab",
    lab: "Lin Lab",
    title: "Designing Synthetic Block Copolypeptides for Solvent-Free Thermal Induction and Tunable β-Sheet Nanocrystals",
    date: "2025-08-19",
    startTime: "14:36",
    endTime: "14:48",
    room: "Hall D, room 2",
    building: "Walter E. Washington Convention Center",
    color: labColors['Lin Lab']
  },
  {
    name: "Megan Welch",
    lab: "Burke Lab",
    title: "Covalent Crosslinking of Protein-Cellulose Hydrogels for Culture Scaffolds",
    date: "2025-08-19",
    startTime: "18:00",
    endTime: "20:00",
    room: "Hall C",
    building: "Walter E. Washington Convention Center",
    color: labColors['Burke Lab'],
    isPosterSession: true
  },
  {
    name: "Jakiya Sultana Joya",
    lab: "Adamson Lab",
    title: "Thermoresponsive and electrically conductive Graphene-reinforced double-network hydrogels via Solvent Interfacial Trapping Method",
    date: "2025-08-20",
    startTime: "08:36",
    endTime: "08:48",
    room: "Hall D, room 2",
    building: "Walter E. Washington Convention Center",
    color: labColors['Adamson Lab']
  },
  {
    name: "Mohak Desai",
    lab: "Sotzing Lab",
    title: "Scale up of High Temperature Polyimide and Polyolefin Dielectrics, Film Processing and Testing",
    date: "2025-08-20",
    startTime: "11:40",
    endTime: "12:00",
    room: "Hall D, room 7",
    building: "Walter E. Washington Convention Center",
    color: labColors['Sotzing Lab']
  },
  {
    name: "Faheem Hassan",
    lab: "Nieh Lab",
    title: "Small angle x-ray scattering (SAXS) analysis of modified PNA for antisense",
    date: "2025-08-20",
    startTime: "17:00",
    endTime: "17:12",
    room: "Hall D, room 1",
    building: "Walter E. Washington Convention Center",
    color: labColors['Nieh Lab']
  },
  {
    name: "Justin Amengual",
    lab: "Nieh Lab",
    title: "Quantifying the sergeant-soldier effect in covalent block copolypeptides via kinetic and thermodynamic analysis",
    date: "2025-08-21",
    startTime: "09:20",
    endTime: "09:40",
    room: "Hall D, room 1",
    building: "Walter E. Washington Convention Center",
    color: labColors['Nieh Lab']
  },
  
  // 60th Anniversary Symposium
  {
    name: "Montgomery Shaw",
    lab: "60th Anniversary Symposium",
    title: "History of the Polymer Program at the University of Connecticut",
    date: "2025-08-18",
    startTime: "08:00",
    endTime: "08:25",
    room: "Hall D, room 8",
    building: "Walter E. Washington Convention Center",
    color: labColors['60th Anniversary Symposium'],
    isSymposium: true,
    isExternalSpeaker: false
  },
  {
    name: "Stephen Cheng",
    lab: "60th Anniversary Symposium", 
    title: "Superlattice Engineering in Giant Molecules",
    date: "2025-08-18",
    startTime: "08:25",
    endTime: "08:55",
    room: "Hall D, room 8",
    building: "Walter E. Washington Convention Center",
    color: labColors['60th Anniversary Symposium'],
    isSymposium: true,
    isExternalSpeaker: true
  },
  {
    name: "Andrey Dobrynin",
    lab: "60th Anniversary Symposium",
    title: "Polymer Networks: Design, Synthesis, and Forensics",
    date: "2025-08-18",
    startTime: "08:55",
    endTime: "09:25",
    room: "Hall D, room 8", 
    building: "Walter E. Washington Convention Center",
    color: labColors['60th Anniversary Symposium'],
    isSymposium: true,
    isExternalSpeaker: true
  },
  {
    name: "Chinedum Osuji",
    lab: "60th Anniversary Symposium",
    title: "Ion Transport in Self-Assembled Membranes with 1-nm Scale Pores",
    date: "2025-08-18",
    startTime: "09:25",
    endTime: "10:05",
    room: "Hall D, room 8",
    building: "Walter E. Washington Convention Center", 
    color: labColors['60th Anniversary Symposium'],
    isSymposium: true,
    isExternalSpeaker: true
  },
  {
    name: "Jan Michael Carrillo",
    lab: "60th Anniversary Symposium",
    title: "Simulating Charged Soft Matter Systems: From Polyelectrolytes to Lipid Bilayers",
    date: "2025-08-18",
    startTime: "10:05",
    endTime: "10:35",
    room: "Hall D, room 8",
    building: "Walter E. Washington Convention Center",
    color: labColors['60th Anniversary Symposium'],
    isSymposium: true,
    isExternalSpeaker: true
  },
  {
    name: "Brian Benicewicz",
    lab: "60th Anniversary Symposium",
    title: "Polybenzimidazole Fuel Cell Membranes for Aviation and Heavy-Duty Transportation",
    date: "2025-08-18",
    startTime: "10:35",
    endTime: "11:05",
    room: "Hall D, room 8",
    building: "Walter E. Washington Convention Center",
    color: labColors['60th Anniversary Symposium'],
    isSymposium: true,
    isExternalSpeaker: true
  },
  {
    name: "Sangyon Ju, Je-Hyun Oh, Yoonbeen Kang",
    lab: "60th Anniversary Symposium",
    title: "Kinetics and Mechanisms of Sodium-Catalyzed MoS2 Growth and Etching in Chemical Vapor Deposition",
    date: "2025-08-18",
    startTime: "11:05",
    endTime: "11:35",
    room: "Hall D, room 8",
    building: "Walter E. Washington Convention Center",
    color: labColors['60th Anniversary Symposium'],
    isSymposium: true,
    isExternalSpeaker: false
  },
  {
    name: "Yang Qin",
    lab: "60th Anniversary Symposium",
    title: "Ordered MOF@Polymer OMAP Membranes for Gas Separation",
    date: "2025-08-18", 
    startTime: "11:35",
    endTime: "12:00",
    room: "Hall D, room 8",
    building: "Walter E. Washington Convention Center",
    color: labColors['60th Anniversary Symposium'],
    isSymposium: true,
    isExternalSpeaker: false
  },
  {
    name: "Ed Samulski",
    lab: "60th Anniversary Symposium",
    title: "Several Polymer Problems Resolved at UConn",
    date: "2025-08-18",
    startTime: "14:00", 
    endTime: "14:30",
    room: "Hall D, room 8",
    building: "Walter E. Washington Convention Center",
    color: labColors['60th Anniversary Symposium'],
    isSymposium: true,
    isExternalSpeaker: true
  },
  {
    name: "Suk-Kyun Ahn",
    lab: "60th Anniversary Symposium",
    title: "Liquid Crystal Elastomers for Muscles, Textiles, and Haptics",
    date: "2025-08-18",
    startTime: "14:30",
    endTime: "15:00",
    room: "Hall D, room 8",
    building: "Walter E. Washington Convention Center",
    color: labColors['60th Anniversary Symposium'],
    isSymposium: true,
    isExternalSpeaker: true
  },
  {
    name: "Benjamin Hsiao",
    lab: "60th Anniversary Symposium", 
    title: "Zero-Waste NanoCellulose Technologies to Enhance the Nexus of Food-Water-Infrastructure",
    date: "2025-08-18",
    startTime: "15:00",
    endTime: "15:30",
    room: "Hall D, room 8",
    building: "Walter E. Washington Convention Center",
    color: labColors['60th Anniversary Symposium'],
    isSymposium: true,
    isExternalSpeaker: true
  },
  {
    name: "Luyi Sun",
    lab: "60th Anniversary Symposium",
    title: "Smart Soft-Materials with Multiscale Architecture and Dynamic Surface Topographies",
    date: "2025-08-18",
    startTime: "15:30",
    endTime: "16:05",
    room: "Hall D, room 8",
    building: "Walter E. Washington Convention Center", 
    color: labColors['60th Anniversary Symposium'],
    isSymposium: true,
    isExternalSpeaker: false
  },
  {
    name: "Patrick Mather",
    lab: "60th Anniversary Symposium",
    title: "Processing and Properties of New Electrospun Soft Composites", 
    date: "2025-08-18",
    startTime: "16:05",
    endTime: "16:35",
    room: "Hall D, room 8",
    building: "Walter E. Washington Convention Center",
    color: labColors['60th Anniversary Symposium'],
    isSymposium: true,
    isExternalSpeaker: true
  },
  {
    name: "Kelly Burke",
    lab: "60th Anniversary Symposium",
    title: "Synthetic Modifications of Silk Fibroin Protein for Responsive Biomaterials",
    date: "2025-08-18",
    startTime: "16:35",
    endTime: "17:05",
    room: "Hall D, room 8",
    building: "Walter E. Washington Convention Center",
    color: labColors['60th Anniversary Symposium'],
    isSymposium: true,
    isExternalSpeaker: false
  },
  {
    name: "N. Sanjeeva Murthy",
    lab: "60th Anniversary Symposium",
    title: "X-Ray Scattering Work That Began at UConn",
    date: "2025-08-18",
    startTime: "17:05",
    endTime: "17:35",
    room: "Hall D, room 8",
    building: "Walter E. Washington Convention Center",
    color: labColors['60th Anniversary Symposium'],
    isSymposium: true,
    isExternalSpeaker: true
  },
  
  // Dual entries for UConn faculty (Kelly Burke also appears under her lab)
  {
    name: "Kelly Burke",
    lab: "Burke Lab",
    title: "Synthetic Modifications of Silk Fibroin Protein for Responsive Biomaterials",
    date: "2025-08-18",
    startTime: "16:35",
    endTime: "17:05",
    room: "Hall D, room 8", 
    building: "Walter E. Washington Convention Center",
    color: labColors['Burke Lab'],
    isSymposium: true,
    isExternalSpeaker: false,
    isDuplicate: true  // Flag to handle filtering
  },
  {
    name: "Nishadi Bandara",
    lab: "Adamson Lab",
    title: "Moisture enabled electric power generation using graphene-based hydrogels",
    date: "2025-08-19",
    startTime: "13:40",
    endTime: "14:00",
    room: "Digital Session (Digital Meeting)",
    building: "Online Presentation",
    color: labColors['Adamson Lab'],
    onlineLink: "https://acs.digitellinc.com/live/35/session/569368/attend"
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
      color: Math.random() > 0.5 ? '#3b82f6' : '#8b5cf6',
    });

    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < 200; i++) {
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
          particle.vx -= (dx / distance) * force * 0.05;
          particle.vy -= (dy / distance) * force * 0.05;
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
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);
  const [sortBy, setSortBy] = useState<'time' | 'lab'>('time');
  const [selectedLab, setSelectedLab] = useState<string | null>(null);
  const [selectedPresentation, setSelectedPresentation] = useState<Presentation | null>(null);
  const [showAbstractModal, setShowAbstractModal] = useState(false);

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

  const getTimeUntilNext = (presentation: Presentation) => {
    const timeUntil = getPresentationDateTime(presentation).getTime() - currentTime.getTime();
    const hours = Math.floor(timeUntil / (1000 * 60 * 60));
    const minutes = Math.floor((timeUntil % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m`;
    return 'Starting soon';
  };

  const getTimeUntilPresentation = (presentation: Presentation) => {
    const now = currentTime;
    const startTime = getPresentationDateTime(presentation);
    const endTime = getPresentationEndDateTime(presentation);
    
    if (now >= endTime) return 'Completed';
    if (now >= startTime && now < endTime) return 'Live now!';
    
    const timeUntil = startTime.getTime() - now.getTime();
    const days = Math.floor(timeUntil / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeUntil % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeUntil % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `in ${days}d ${hours}h`;
    if (hours > 0) return `in ${hours}h ${minutes}m`;
    if (minutes > 0) return `in ${minutes}m`;
    return 'Starting soon';
  };

  const getBuildingLink = (building: string) => {
    const buildingLinks: Record<string, string> = {
      'The Westin DC Downtown': 'https://maps.app.goo.gl/WrqYQzEcwqA7Qnmm8',
      'Walter E. Washington Convention Center': 'https://maps.app.goo.gl/P6i5u33VLHoSnyVt5'
    };
    return buildingLinks[building] || '#';
  };

  const isOnlinePresentation = (building: string) => {
    return building === 'Online Presentation';
  };

  const getLabButtonColors = (lab: string, isSelected: boolean) => {
    const labColorMap: Record<string, { selected: string; unselected: string; text: string }> = {
      'Adamson Lab': {
        selected: 'bg-blue-100/80 border-blue-200/80 text-blue-700',
        unselected: 'bg-blue-50/50 border-blue-100/50 text-blue-600 hover:bg-blue-100/60',
        text: 'text-blue-700'
      },
      'Burke Lab': {
        selected: 'bg-emerald-100/80 border-emerald-200/80 text-emerald-700',
        unselected: 'bg-emerald-50/50 border-emerald-100/50 text-emerald-600 hover:bg-emerald-100/60',
        text: 'text-emerald-700'
      },
      'Sotzing Lab': {
        selected: 'bg-purple-100/80 border-purple-200/80 text-purple-700',
        unselected: 'bg-purple-50/50 border-purple-100/50 text-purple-600 hover:bg-purple-100/60',
        text: 'text-purple-700'
      },
      'Lin Lab': {
        selected: 'bg-orange-100/80 border-orange-200/80 text-orange-700',
        unselected: 'bg-orange-50/50 border-orange-100/50 text-orange-600 hover:bg-orange-100/60',
        text: 'text-orange-700'
      },
      'Nieh Lab': {
        selected: 'bg-red-100/80 border-red-200/80 text-red-700',
        unselected: 'bg-red-50/50 border-red-100/50 text-red-600 hover:bg-red-100/60',
        text: 'text-red-700'
      }
    };

    const colors = labColorMap[lab];
    if (!colors) {
      return isSelected 
        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
        : 'bg-slate-50 text-slate-600 hover:bg-slate-100';
    }

    return isSelected ? colors.selected : colors.unselected;
  };

  // Group presentations by lab for summary (avoid double counting)
  const labCounts = presentations.reduce((acc, p) => {
    // Skip duplicate entries (same name, date, time)
    const key = `${p.name}-${p.date}-${p.startTime}`;
    if (!acc.seen) acc.seen = new Set();
    if (acc.seen.has(key)) return acc;
    acc.seen.add(key);
    
    acc[p.lab] = (acc[p.lab] || 0) + 1;
    return acc;
  }, { seen: new Set() } as Record<string, any>);
  
  // Clean up the seen set from the counts
  delete labCounts.seen;

  // Sort and filter presentations
  const filteredPresentations = selectedLab 
    ? presentations.filter(p => {
        if (selectedLab === 'Burke Lab') {
          // For Burke Lab, show the Burke Lab version of Kelly Burke, not the symposium version
          if (p.name === 'Kelly Burke') {
            return p.lab === 'Burke Lab';
          }
        } else if (selectedLab === '60th Anniversary Symposium') {
          // For Symposium, show the symposium version of Kelly Burke, not the Burke Lab version
          if (p.name === 'Kelly Burke') {
            return p.lab === '60th Anniversary Symposium';
          }
        }
        return p.lab === selectedLab;
      })
    : presentations.filter(p => !p.isDuplicate); // When showing all, exclude duplicates
    
  const findCurrentPresentations = () => {
    return filteredPresentations.filter(p => getStatus(p) === 'current');
  };

  const findNextPresentations = () => {
    const now = currentTime;
    const nextTimes = filteredPresentations
      .filter(p => getPresentationDateTime(p) > now)
      .map(p => getPresentationDateTime(p).getTime());
    
    if (nextTimes.length === 0) return [];
    
    const earliestTime = Math.min(...nextTimes);
    return filteredPresentations.filter(p => 
      getPresentationDateTime(p).getTime() === earliestTime
    );
  };

  const sortedPresentations = [...filteredPresentations].sort((a, b) => {
    if (sortBy === 'lab') {
      if (a.lab !== b.lab) return a.lab.localeCompare(b.lab);
      return getPresentationDateTime(a).getTime() - getPresentationDateTime(b).getTime();
    }
    return getPresentationDateTime(a).getTime() - getPresentationDateTime(b).getTime();
  }).filter(p => {
    // When sorting by lab, exclude symposium presentations unless specifically viewing symposium
    if (sortBy === 'lab' && selectedLab !== '60th Anniversary Symposium') {
      return p.lab !== '60th Anniversary Symposium';
    }
    return true;
  });

  const statusCounts = filteredPresentations.reduce((acc, p) => {
    const status = getStatus(p);
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, { completed: 0, current: 0, upcoming: 0 });

  const currentPresentations = findCurrentPresentations();
  const nextPresentations = findNextPresentations();

  const handleCardClick = (presentation: Presentation) => {
    setSelectedPresentation(presentation);
    setShowAbstractModal(true);
  };

  const closeModal = () => {
    setShowAbstractModal(false);
    setSelectedPresentation(null);
  };

  const highlightScientificTerms = (text: string) => {
    // Comprehensive list organized by presenter to ensure nothing is missed
    const keyPhrasesByPresenter = {
      'Deep Shikha Srivastava': [
        'combination of two different particulate 2D surfactants',
        'tunable gradient conductive and insulating domains',
        '3D-printable material systems',
        'homogeneous integration of both 2D surfactants',
        'new insight into the design of functional composite materials'
      ],
      'Cassidy Soard': [
        'silk nanoparticles enhanced with surface-grafted methacrylate polymers',
        'platform for customizable nanoparticles',
        'enhanced cell targeting applications',
        'end-functionalized using click chemistry',
        'confirmed noncytotoxic'
      ],
      'Brenden Ferland': [
        'novel graphene-silicone composite',
        'stable electrical responsiveness during repeated mechanical deformation cycles',
        'precise tuning of mechanical properties',
        'rapid heating above 150 °C',
        'electrically conductive pathways at relatively low filler concentrations',
        'stable gauge factor of ~2.2'
      ],
      'Douglas Adamson': [
        'Solvent Interface Trapping Method (SITM)',
        'thermodynamically driven exfoliation mechanism',
        'sensors and filters',
        'open cell foam structures',
        'bicontinuous network of overlapping graphene sheets'
      ],
      'Vishwa Suthar': [
        'Poly (CBD adipate) and cannabidiol composites for fruit preservation',
        'weight loss for the control strawberry was ~5% higher',
        'minimal cytotoxicity with cell viability above 80%',
        'higher antioxidant activity compared to poly lactic acid',
        'renewable plant-based materials',
        'complete hydrolysis under basic condition and heat'
      ],
      'Mahdad Mahmoudi': [
        'emulsifying needles to generate highly monodisperse polymer-graphene HIPEs',
        'control over droplet size, lowering the polydispersity index (PDI < 0.1)',
        'increased compressive strength by a factor of 2.3 and doubled Young\'s modulus',
        'dramatically improving composite uniformity and mechanical performance',
        'fine-tuning the mechanical performance'
      ],
      'Jianan Mao': [
        'helix-guided "sergeants-and-soldiers" NCA polymerization strategy',
        'β-sheet-rich hydrogels with highly tunable viscoelastic properties',
        'enhanced pH stability, self-healing, and improved mechanical response',
        'injectable hydrogels capable of encapsulating and releasing water-soluble cargos',
        'truly random incorporation of multiple amino acids'
      ],
      'Rumesha Perera': [
        'graphene-polyamide composite membrane',
        'electrically conductive active membranes',
        'facilitates electrochemical reactions without a counter electrode',
        'reduction of CO2 is more efficient without the gold nanoparticles',
        'spontaneously exfoliates graphite into graphene',
        'quantifying the production of CO2 reduction products'
      ],
      'Abrar Ali Sitab': [
        'solvent-free α-helix to β-sheet transformations in block copolypeptides',
        'thermomechanical processing',
        'two-stage compression molding protocol',
        'enhanced mechanical extensibility',
        '"sergeant–soldier" effect'
      ],
      'Megan Welch': [
        'oxidized paper cellulose (DAC) hydrogels',
        'crosslinked with proteins at various concentrations',
        'hydrogels are degradable',
        'tissue engineering or cellular agriculture',
        'find the most effective oxidation method',
        'investigating in vitro cytocompatibility'
      ],
      'Jakiya Sultana Joya': [
        'conductive double network (DN) hydrogel',
        'pristine graphene-coated poly (N-isopropylacrylamide) (PNIPAM) spheres without chemical modifications',
        'substantial increases in modulus and toughness above the LCST',
        'flexible strain sensors, wearable electronics, temperature-responsive biomedical devices, and intelligent packaging applications',
        'simplicity, eco-friendly processing, tunable properties, and robust mechanical performance'
      ],
      'Mohak Desai': [
        'excellent dielectric performance at high electric field and high temperature',
        'possible melt processibility when synthesized at a larger scale',
        'Replacement of biaxially oriented polypropylene (BOPP)',
        'high enough molecular weight to be able to make entanglements',
        'high energy density capacitors'
      ],
      'Faheem Hassan': [
        'small-angle X-ray scattering (SAXS) analysis',
        'morphology and antisense efficiency of modified PNAs are drastically different and seemingly strongly correlated',
        'SAXS can be a powerful tool to identify nanoscale morphology',
        'high stability and efficacy yet suffers from low solubility'
      ],
      'Justin Amengual': [
        'introduces the sergeant-soldier principle—previously applied to supramolecular chiral polymers—into a novel covalent system',
        'develop a predictive model to map critical parameters in the conversion mechanism',
        'hierarchical biomaterials and synthetic silk mimetics',
        'accelerated aggregation'
      ],
      'Montgomery Shaw': [
        '60 years old',
        'oldest active member',
        'history of UConn Polymer Program',
        'witnessed nearly 50 of those years'
      ],
      'Stephen Cheng': [
        'Inverse design and inverse thinking',
        '"Molecular Lego" approach',
        'generate a spectrum of unconventional superlattices',
        'Frank–Kasper phases',
        'newly discovered decagonal quasicrystals',
        'rationally fabricated by scalable-preparation and easy-to-process materials'
      ],
      'Andrey Dobrynin': [
        'design polymer networks with programmable mechanical properties',
        'encode mechanical properties of different soft materials',
        'fuses together theory, computer simulations, synthesis and experimental studies',
        'reproducing mechanical properties of assorted biological gels and tissues',
        'combination of AI tools for encoding of network\'s mechanical properties'
      ],
      'Chinedum Osuji': [
        'Polymers with precisely-sized pores',
        'deconvoluting size-exclusion and affinity-based mechanisms',
        'charged hydrated nanoporous polymers',
        'elucidate anion and water transport',
        'strong correlations of ion polarizability with conductivity',
        'mechanically and chemically resilient materials',
        'new light on transport under nanoscale confinement'
      ],
      'Jan Michael Carrillo': [
        'simulations of polyelectrolyte chains and polyelectrolyte brushes',
        'simulations of multiscale models of polyelectrolyte and polyzwitterion brushes',
        'exploring flexoelectric effects and lens formation in lipid membranes',
        'interplay between long-range electrostatic interactions and short-range van der Waals interactions',
        'insights into neutron scattering experiments'
      ],
      'Brian Benicewicz': [
        'sol-gel process for fabricating PA doped membranes',
        'new post-processing technique that improves the mechanical stability',
        'fuel cell performance at higher temperatures, pressures and current densities',
        'surprising improvement in mechanical durability and expanded operating window',
        'heavy duty transportation applications'
      ],
      'Sangyon Ju, Je-Hyun Oh, Yoonbeen Kang': [
        'integrated CVD microscope and kinetic Monte Carlo (KMC) simulations',
        'three key growth phases—growth, steady-state, and etching',
        'enhanced diffusion kinetics and uniform film growth',
        'scalable nanomaterial synthesis',
        'next-generation electronic and catalytic applications'
      ],
      'Yang Qin': [
        'composite membranes containing orderly arranged MOF nanochannels',
        'ordered MOF@polymer (OMAP) membranes',
        'CO2/N2 separation efficiencies far exceeding those of traditional membranes',
        'tailor-design MOF materials for CO2 separation',
        'synergistically realize the functions of MOFs and polymers'
      ],
      'Ed Samulski': [
        'folded-chain crystal habit',
        'rheoNMR',
        'microscopic structure of the folded-chain crystal habit',
        'detection residual nuclear dipolar interactions in sheared polymer melts'
      ],
      'Suk-Kyun Ahn': [
        'liquid crystal elastomers (LCEs)',
        'reversible and programmable shape changes',
        '(re)programmable artificial muscles, textile actuators, and haptic display',
        'intelligent and adaptive manner',
        'unique anisotropic properties and inherent sensitivity'
      ],
      'Benjamin Hsiao': [
        'close the nutrient cycle using zero-waste nitro-oxidation processing (NOP) technologies',
        'rapidly upcycling natural organic waste into reproducible, sustainable, and safe fertilizers',
        'improve the water hold capacity',
        'sterilizing all harmful human pathogens',
        'stable but biodegradable biogels'
      ],
      'Luyi Sun': [
        'instantaneous and reversible fashions in optical, electrical, mechanical, and/or shape deformation signals',
        'function-orientated structural design',
        'versatile, tunable, adaptable, and interactive stimuli-responsive properties',
        'bioinspired design and surface engineering with multiscale architecture',
        'pave new routes for designing next-generation smart soft materials'
      ],
      'Patrick Mather': [
        'tough, elastic, anisotropic rubber-rubber composites',
        'fiber orientation was achieved at high drum collector rotation speeds',
        '10–20× more fracture-resistant',
        'biomedical and biomimicry fields',
        'increased toughness and reduced stiffness'
      ],
      'Kelly Burke': [
        'reversible assembly of hydrogels to permit cell encapsulation and enhanced recovery',
        'generation of brush-like polymer architectures on silk fibroin',
        'tunable mechanical properties and degradation profiles',
        'low immunogenicity',
        'controlled drug delivery surfaces'
      ],
      'N. Sanjeeva Murthy': [
        'explore structure of disparate materials that are now called soft matter',
        'foundational training at the Institute of Materials Science',
        'unlimited access to the newly acquired small- and wide-angle X-ray scattering instrumentation',
        'actively engaged in research on materials, properties and applications throughout my career'
      ],
      'Nishadi Bandara': [
        'polymer graphene hydrogel-based Moist-Electric Generator (MEG)',
        'gradient distribution of functional groups',
        'ion concentration gradient',
        'solvent interfacial trapping method',
        'cost-effective, and eco-friendly approach',
        'high open circuit voltage of 0.74 V',
        'increased voltage of 18.4 V by integrating multiple MEG units in series',
        'light an LED and power an LCD calculator',
        'simplifies fabrication while improving scalability and practicality',
        'moisture-to-electricity conversion'
      ]
    };

    // Flatten all phrases into a single array
    const keyPhrases = Object.values(keyPhrasesByPresenter).flat();
    
    // Nice color palette for highlights
    const highlightColors = [
      'bg-blue-100 text-blue-900',      // Blue
      'bg-emerald-100 text-emerald-900', // Green
      'bg-purple-100 text-purple-900',   // Purple
      'bg-orange-100 text-orange-900',   // Orange
      'bg-rose-100 text-rose-900',       // Rose/Pink
      'bg-indigo-100 text-indigo-900',   // Indigo
      'bg-teal-100 text-teal-900',       // Teal
      'bg-amber-100 text-amber-900',     // Amber
      'bg-cyan-100 text-cyan-900',       // Cyan
      'bg-pink-100 text-pink-900'        // Pink
    ];
    
    let highlightedText = text;
    
    // Sort by length (longest first) to avoid partial matches
    keyPhrases.sort((a, b) => b.length - a.length);
    
    keyPhrases.forEach((phrase, index) => {
      // Escape special regex characters but keep the phrase intact
      const escapedPhrase = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escapedPhrase, 'gi');
      const colorClass = highlightColors[index % highlightColors.length];
      highlightedText = highlightedText.replace(regex, `<span class="${colorClass} px-1 rounded font-medium">$&</span>`);
    });
    
    return highlightedText;
  };


  const getAbstractData = (presenterName: string): AbstractData | null => {
    return (abstractsData as Record<string, AbstractData>)[presenterName] || null;
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
                {/* Mobile-optimized header */}
                <div className="sm:hidden">
                  {/* Mobile: Compact layout */}
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-4 h-4" />
                    <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-medium">
                      {selectedPresentation.lab}
                    </span>
                    {selectedPresentation.isPosterSession && (
                      <span className="bg-white/30 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <FileImage className="w-3 h-3" />
                        POSTER
                      </span>
                    )}
                    {selectedPresentation.building !== 'Walter E. Washington Convention Center' && (
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        isOnlinePresentation(selectedPresentation.building) 
                          ? 'bg-blue-500 text-white animate-pulse' 
                          : 'bg-yellow-400 text-yellow-900'
                      }`}>
                        {isOnlinePresentation(selectedPresentation.building) ? 'ONLINE' : 'OFF-SITE'}
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg font-bold mb-1 drop-shadow-lg leading-tight">
                    {selectedPresentation.name}
                  </h2>
                  <h3 className="text-sm text-white/90 mb-2 leading-tight drop-shadow-md">
                    {selectedPresentation.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 text-xs text-white/80 mb-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(selectedPresentation.date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(selectedPresentation.startTime)}-{formatTime(selectedPresentation.endTime)}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="bg-white/20 px-2 py-1 rounded-full inline-flex items-center gap-1">
                      <Clock3 className="w-3 h-3" />
                      <span className="font-medium text-xs">
                        {getTimeUntilPresentation(selectedPresentation)}
                      </span>
                    </div>
                    {(() => {
                      const abstractData = getAbstractData(selectedPresentation.name);
                      return abstractData?.acsLink ? (
                        <a
                          href={abstractData.acsLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white px-2 py-1 rounded-full font-medium text-xs transition-all duration-300"
                        >
                          <ExternalLink className="w-3 h-3" />
                          ACS
                        </a>
                      ) : null;
                    })()}
                  </div>
                </div>

                {/* Desktop: Original layout */}
                <div className="hidden sm:block">
                  <div className="flex items-center gap-3 mb-3">
                    <BookOpen className="w-6 h-6" />
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                      {selectedPresentation.lab}
                    </span>
                    {selectedPresentation.isPosterSession && (
                      <span className="bg-white/30 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                        <FileImage className="w-4 h-4" />
                        POSTER
                      </span>
                    )}
                    {selectedPresentation.building !== 'Walter E. Washington Convention Center' && (
                      <span className={`px-3 py-1 rounded-full text-sm font-bold animate-pulse ${
                        isOnlinePresentation(selectedPresentation.building) 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-yellow-400 text-yellow-900'
                      }`}>
                        {isOnlinePresentation(selectedPresentation.building) ? 'ONLINE' : 'OFF-SITE'}
                      </span>
                    )}
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
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <a 
                        href={getBuildingLink(selectedPresentation.building)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:underline transition-colors duration-300 font-medium"
                      >
                        {selectedPresentation.building}
                      </a>
                      {selectedPresentation.building !== 'Walter E. Washington Convention Center' && (
                        <span className="font-bold text-yellow-200 ml-1">⚠️ Different Location</span>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/20">
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="bg-white/20 px-4 py-2 rounded-full inline-flex items-center gap-2">
                        <Clock3 className="w-4 h-4" />
                        <span className="font-medium text-sm">
                          {getTimeUntilPresentation(selectedPresentation)}
                        </span>
                      </div>
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
        <div className="flex flex-col items-center mb-8 bg-white/80 backdrop-blur-sm rounded-3xl p-4 lg:p-6 shadow-lg border border-slate-200 animate-[slideDown_0.8s_ease-out]">
          <div className="text-center mb-4">
            <h1 className="text-2xl lg:text-4xl font-bold text-slate-900 mb-2 tracking-tight">
              UConn Polymer Program
            </h1>
            <div className="flex flex-col items-center gap-2">
              <p className="text-slate-600 text-base lg:text-lg">
                {selectedLab === '60th Anniversary Symposium' 
                  ? '60th Anniversary Symposium' 
                  : selectedLab 
                    ? `${selectedLab} - ACS Fall 2025` 
                    : 'ACS Fall 2025 Schedule'
                }
              </p>
              <a 
                href="https://polymer.ims.uconn.edu/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline transition-all duration-300 hover:gap-2"
              >
                Polymer Program <ExternalLink className="w-3 h-3 transition-transform duration-300" />
              </a>
            </div>
            <p className="text-slate-500 text-sm mt-1">Institute of Materials Science</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 lg:gap-4 animate-[fadeIn_1s_ease-out_0.3s_both]">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-3 py-2 lg:px-4 lg:py-3 hover:scale-105 transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4" />
                <span className="font-bold text-base lg:text-lg tabular-nums">{statusCounts.completed}</span>
                <span className="text-xs lg:text-sm">Done</span>
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl px-3 py-2 lg:px-4 lg:py-3 hover:scale-105 transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-2 text-amber-700">
                <Play className="w-3 h-3 lg:w-4 lg:h-4" />
                <span className="font-bold text-base lg:text-lg tabular-nums">{statusCounts.current}</span>
                <span className="text-xs lg:text-sm">Live</span>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-2xl px-3 py-2 lg:px-4 lg:py-3 hover:scale-105 transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-2 text-blue-700">
                <Clock3 className="w-3 h-3 lg:w-4 lg:h-4" />
                <span className="font-bold text-base lg:text-lg tabular-nums">{statusCounts.upcoming}</span>
                <span className="text-xs lg:text-sm">Next</span>
              </div>
            </div>
            {selectedLab && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 lg:px-4 lg:py-3">
                <div className="flex items-center gap-2 text-slate-700">
                  <GraduationCap className="w-3 h-3 lg:w-4 lg:h-4" />
                  <span className="text-xs lg:text-sm font-medium">{selectedLab}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Lab Summary - Compact */}
        <div className="mb-6 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-slate-200 animate-[slideUp_0.8s_ease-out_0.2s_both]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-slate-600" />
              <span className="text-sm font-medium text-slate-700">Filter & Sort:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSortBy('time')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                  sortBy === 'time' 
                    ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Time
              </button>
              <button
                onClick={() => setSortBy('lab')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                  sortBy === 'lab' 
                    ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Lab
              </button>
              <div className="w-px h-6 bg-slate-300"></div>
              <button
                onClick={() => setSelectedLab(null)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                  selectedLab === null
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                All ({Object.values(labCounts).reduce((a: number, b: number) => a + b, 0)})
              </button>
              {Object.entries(labCounts)
                .filter(([lab]) => lab !== '60th Anniversary Symposium')
                .map(([lab, count]) => (
                <button
                  key={lab}
                  onClick={() => setSelectedLab(lab)}
                  className={`px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 border ${getLabButtonColors(lab, selectedLab === lab)} hover:scale-105`}
                >
                  {lab.replace(' Lab', '')}: {count}
                </button>
              ))}
              <div className="w-px h-6 bg-amber-300"></div>
              <button
                onClick={() => setSelectedLab('60th Anniversary Symposium')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                  selectedLab === '60th Anniversary Symposium'
                    ? 'bg-amber-100 text-amber-700 border border-amber-200 shadow-sm' 
                    : 'bg-amber-50 text-amber-600 hover:bg-amber-100 hover:scale-105'
                }`}
              >
                🎉 60th Anniversary ({labCounts['60th Anniversary Symposium']})
              </button>
            </div>
          </div>
        </div>

        {/* Hero Banner - Current Presentations */}
        {currentPresentations.length > 0 && (
          <div className="mb-8 space-y-4">
            {currentPresentations.length > 1 && (
              <div className="text-center">
                <span className="bg-white/90 text-slate-700 px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                  {currentPresentations.length} presentations happening now
                </span>
              </div>
            )}
            {currentPresentations.map((presentation, index) => {
              const isOffSite = presentation.building !== 'Walter E. Washington Convention Center';
              return (
              <div key={`${presentation.name}-${presentation.startTime}`} onClick={() => handleCardClick(presentation)} className={`bg-gradient-to-r ${presentation.color} rounded-3xl p-8 shadow-xl text-white transform hover:scale-[1.02] transition-all duration-500 animate-[slideUp_0.8s_ease-out_0.4s_both] cursor-pointer`}>
                <div className="flex items-start gap-4">
                  <div className="bg-white/20 p-3 rounded-2xl animate-bounce">
                    <Zap className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="bg-white/20 px-3 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide animate-pulse">
                        {presentation.isPosterSession ? 'Poster Session Live' : 'Live Now'}
                      </span>
                      <span className="bg-white/30 px-3 py-1 rounded-full text-sm font-medium">
                        {presentation.lab}
                      </span>
                      {isOffSite && (
                        <span className={`px-3 py-1 rounded-full text-sm font-bold animate-pulse ${
                          isOnlinePresentation(presentation.building) 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-yellow-400 text-yellow-900'
                        }`}>
                          {isOnlinePresentation(presentation.building) ? 'ONLINE' : 'OFF-SITE'}
                        </span>
                      )}
                      {currentPresentations.length > 1 && (
                        <span className="bg-white/30 px-3 py-1 rounded-full text-sm font-medium">
                          {index + 1} of {currentPresentations.length}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-center mb-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-ping animation-delay-100"></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-ping animation-delay-200"></div>
                      </div>
                    </div>
                    <div className="text-2xl lg:text-3xl font-bold mb-2 animate-[fadeInUp_0.6s_ease-out_0.6s_both] drop-shadow-lg">{presentation.name}</div>
                    <div className="text-white/90 text-base lg:text-lg mb-4 leading-relaxed animate-[fadeInUp_0.6s_ease-out_0.8s_both] drop-shadow-md">{presentation.title}</div>
                    <div className="flex flex-wrap gap-4 text-sm text-white/80 animate-[fadeInUp_0.6s_ease-out_1s_both]">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(presentation.startTime)} - {formatTime(presentation.endTime)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{presentation.room}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <a 
                          href={getBuildingLink(presentation.building)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:underline hover:text-white transition-colors duration-300"
                        >
                          {presentation.building}
                        </a>
                        {isOffSite && <span className="font-bold text-yellow-200 ml-1">⚠️ Different Location</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )})}
          </div>
        )}

        {/* Hero Banner - Next Presentations */}
        {nextPresentations.length > 0 && (
          <div className="mb-8 space-y-4">
            {nextPresentations.length > 1 && (
              <div className="text-center">
                <span className="bg-white/90 text-slate-700 px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                  {nextPresentations.length} presentations starting {getTimeUntilNext(nextPresentations[0])}
                </span>
              </div>
            )}
            {nextPresentations.map((presentation, index) => {
              const isOffSite = presentation.building !== 'Walter E. Washington Convention Center';
              return (
              <div key={`${presentation.name}-${presentation.startTime}`} onClick={() => handleCardClick(presentation)} className={`bg-gradient-to-r ${presentation.color} rounded-3xl p-8 shadow-xl text-white transform hover:scale-[1.02] transition-all duration-500 animate-[slideUp_0.8s_ease-out_0.4s_both] cursor-pointer`}>
                <div className="flex items-start gap-4">
                  <div className="bg-white/20 p-3 rounded-2xl">
                    <Clock3 className="w-8 h-8 animate-spin" style={{ animationDuration: '3s' }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="bg-white/20 px-3 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide">
                        {presentation.isPosterSession ? 'Upcoming Poster Session' : 'Up Next'}
                      </span>
                      <span className="bg-white/30 px-3 py-1 rounded-full text-sm font-medium">
                        {presentation.lab}
                      </span>
                      {isOffSite && (
                        <span className={`px-3 py-1 rounded-full text-sm font-bold animate-pulse ${
                          isOnlinePresentation(presentation.building) 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-yellow-400 text-yellow-900'
                        }`}>
                          {isOnlinePresentation(presentation.building) ? 'ONLINE' : 'OFF-SITE'}
                        </span>
                      )}
                      {nextPresentations.length > 1 && (
                        <span className="bg-white/30 px-3 py-1 rounded-full text-sm font-medium">
                          {index + 1} of {nextPresentations.length}
                        </span>
                      )}
                      {index === 0 && (
                        <span className="bg-white/30 px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                          in {getTimeUntilNext(presentation)}
                        </span>
                      )}
                    </div>
                    <div className="text-2xl lg:text-3xl font-bold mb-2 animate-[fadeInUp_0.6s_ease-out_0.6s_both] drop-shadow-lg">{presentation.name}</div>
                    <div className="text-white/90 text-base lg:text-lg mb-4 leading-relaxed animate-[fadeInUp_0.6s_ease-out_0.8s_both] drop-shadow-md">{presentation.title}</div>
                    <div className="flex flex-wrap gap-4 text-sm text-white/80 animate-[fadeInUp_0.6s_ease-out_1s_both]">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(presentation.date)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(presentation.startTime)} - {formatTime(presentation.endTime)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{presentation.room}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <a 
                          href={getBuildingLink(presentation.building)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:underline hover:text-white transition-colors duration-300"
                        >
                          {presentation.building}
                        </a>
                        {isOffSite && <span className="font-bold text-yellow-200 ml-1">⚠️ Different Location</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )})}
          </div>
        )}

        {currentPresentations.length === 0 && nextPresentations.length === 0 && (
          <div className="mb-8 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-8 shadow-xl text-white animate-[slideUp_0.8s_ease-out_0.4s_both]">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-2xl animate-bounce">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div>
                <div className="text-2xl lg:text-3xl font-bold mb-1 drop-shadow-lg">
                  {selectedLab ? `All ${selectedLab} presentations completed!` : 'All presentations completed!'}
                </div>
                <div className="text-white/80 drop-shadow-md">
                  {selectedLab ? `Great work from ${selectedLab}! 🎉` : 'Outstanding work from the entire UConn Polymer Program! 🎉'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Presentations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {sortedPresentations.map((presentation, index) => {
            const status = getStatus(presentation);
            const isOffSite = presentation.building !== 'Walter E. Washington Convention Center';
            
            const statusConfig = {
              completed: {
                opacity: 'opacity-60',
                transform: 'scale-95',
                icon: CheckCircle,
                badgeText: 'Complete',
                badgeColor: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
                animation: ''
              },
              current: {
                opacity: 'opacity-100',
                transform: 'scale-105 ring-4 ring-white/50',
                icon: Play,
                badgeText: presentation.isPosterSession ? 'Poster Live' : 'Live Now',
                badgeColor: 'bg-white text-slate-900 border border-white shadow-lg animate-pulse',
                animation: ''
              },
              upcoming: {
                opacity: 'opacity-90',
                transform: 'scale-100',
                icon: Clock3,
                badgeText: 'Upcoming',
                badgeColor: 'bg-slate-100 text-slate-700 border border-slate-200',
                animation: ''
              }
            };

            const config = statusConfig[status];
            const StatusIcon = config.icon;

            return (
              <div
                key={index}
                onClick={() => handleCardClick(presentation)}
                className={`bg-gradient-to-br ${presentation.color} rounded-3xl p-6 shadow-lg text-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ${config.opacity} ${config.transform} group relative cursor-pointer`}
                style={{ 
                  animationDelay: `${index * 150}ms`,
                  animationFillMode: 'both'
                }}
                title="Click to view abstract"
              >
                {/* Hover tooltip */}
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm text-slate-900 px-4 py-2 rounded-xl text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-20 shadow-lg border border-white/50">
                  {getTimeUntilPresentation(presentation)}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white/95 rotate-45 -mt-1"></div>
                </div>

                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold hover:scale-105 transition-transform duration-300 drop-shadow-lg">
                        {presentation.name}
                      </h3>
                      {isOffSite && (
                        <div className={`px-2 py-1 rounded-full text-xs font-bold animate-pulse ${
                          isOnlinePresentation(presentation.building) 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-yellow-400 text-yellow-900'
                        }`}>
                          {isOnlinePresentation(presentation.building) ? 'ONLINE' : 'OFF-SITE'}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="bg-white/20 text-white/90 px-2 py-1 rounded-md text-xs font-medium inline-block">
                        {presentation.lab}
                      </div>
                      {presentation.isPosterSession && (
                        <div className="bg-white/30 text-white px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                          <FileImage className="w-3 h-3" />
                          POSTER
                        </div>
                      )}
                    </div>
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
                    <span className="leading-tight">
                      <a 
                        href={getBuildingLink(presentation.building)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:underline transition-colors duration-300"
                      >
                        {presentation.building}
                      </a>
                      {isOffSite && <span className="font-bold text-yellow-200 ml-1">⚠️ Different Location</span>}
                    </span>
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
      `}</style>
    </div>
  );
};

export default ACSSchedule;