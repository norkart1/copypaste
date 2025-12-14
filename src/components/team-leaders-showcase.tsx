"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import Image from "next/image";
import { Crown, ChevronLeft, ChevronRight, Phone, Mail, Quote, Sparkles } from "lucide-react";
import type { Team } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TeamLeadersShowcaseProps {
  teams: Team[];
}

// Team color mappings with richer palettes
const TEAM_COLORS: Record<string, { primary: string; gradient: string; light: string; accent: string; shadow: string }> = {
  SAMARQAND: {
    primary: "#D72638",
    gradient: "from-[#D72638] via-[#E94E5E] to-[#B01E2E]",
    light: "#FFF1F2",
    accent: "#FFD1D5",
    shadow: "shadow-red-500/20",
  },
  NAHAVAND: {
    primary: "#1E3A8A",
    gradient: "from-[#1E3A8A] via-[#3B82F6] to-[#172554]",
    light: "#EFF6FF",
    accent: "#BFDBFE",
    shadow: "shadow-blue-500/20",
  },
  YAMAMA: {
    primary: "#7C3AED",
    gradient: "from-[#7C3AED] via-[#8B5CF6] to-[#6D28D9]",
    light: "#F5F3FF",
    accent: "#DDD6FE",
    shadow: "shadow-violet-500/20",
  },
  QURTUBA: {
    primary: "#FACC15",
    gradient: "from-[#FACC15] via-[#FDE047] to-[#CA8A04]",
    light: "#FEFCE8",
    accent: "#FEF08A",
    shadow: "shadow-yellow-500/20",
  },
  MUQADDAS: {
    primary: "#059669",
    gradient: "from-[#059669] via-[#10B981] to-[#047857]",
    light: "#ECFDF5",
    accent: "#A7F3D0",
    shadow: "shadow-emerald-500/20",
  },
  BUKHARA: {
    primary: "#FB923C",
    gradient: "from-[#FB923C] via-[#F97316] to-[#C2410C]",
    light: "#FFF7ED",
    accent: "#FED7AA",
    shadow: "shadow-orange-500/20",
  },
};

function parseLeaders(leaderString: string): string[] {
  return leaderString
    .split(/[&,]/)
    .map((name) => name.trim())
    .filter(Boolean);
}

function isValidImageUrl(url: string | undefined | null): boolean {
  if (!url) return false;
  return /^(https?:\/\/|\/)/i.test(url);
}

function getLeaderPhoto(leaderPhoto: string | undefined | null, leaderIndex: number): string {
  if (!isValidImageUrl(leaderPhoto)) {
    return `https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80&seed=${leaderIndex}`;
  }
  if (leaderPhoto?.includes('?')) {
    return leaderPhoto;
  }
  return `${leaderPhoto}?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`;
}

export function TeamLeadersShowcase({ teams }: TeamLeadersShowcaseProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  // Configuration
  const CARD_WIDTH = 340;
  const GAP = 32;

  // Handle resize to keep centering correct
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? teams.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % teams.length);
  };

  // Calculate the center position
  useEffect(() => {
    if (!isDragging && containerWidth > 0) {
      const centerOffset = (containerWidth - CARD_WIDTH) / 2;
      const targetX = centerOffset - (currentIndex * (CARD_WIDTH + GAP));
      animate(x, targetX, {
        type: "spring",
        stiffness: 150,
        damping: 20,
        mass: 0.8
      });
    }
  }, [currentIndex, isDragging, containerWidth, x]);

  const handleDragEnd = () => {
    setIsDragging(false);
    const currentX = x.get();
    const centerOffset = (containerWidth - CARD_WIDTH) / 2;
    // Reverse calculation to find index
    // x = centerOffset - (index * (width + gap))
    // index * (width + gap) = centerOffset - x
    // index = (centerOffset - x) / (width + gap)
    const rawIndex = (centerOffset - currentX) / (CARD_WIDTH + GAP);
    const newIndex = Math.round(rawIndex);
    const clampedIndex = Math.max(0, Math.min(newIndex, teams.length - 1));

    setCurrentIndex(clampedIndex);
  };

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      {/* Abstract Background Shapes */}


      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-100 shadow-sm"
          >
            <Crown className="w-4 h-4 text-[#8B4513]" />
            <span className="text-xs font-bold tracking-[0.2em] text-gray-500 uppercase">Team Captains</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-serif text-gray-900 tracking-tight"
          >
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B4513] to-[#D2691E]">Visionaries</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto font-light"
          >
            Meet the inspiring leaders guiding their teams towards excellence
          </motion.p>
        </div>

        {/* Carousel Container */}
        <div className="relative" ref={containerRef}>
          {/* Navigation Buttons (Desktop) */}
          <div className="absolute top-1/2 -translate-y-1/2 -left-4 z-20 hidden lg:block">
            <button
              onClick={handlePrev}
              className="p-4 rounded-full bg-white shadow-xl border border-gray-100 text-gray-700 hover:text-[#8B4513] hover:scale-110 transition-all disabled:opacity-50"
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 -right-4 z-20 hidden lg:block">
            <button
              onClick={handleNext}
              className="p-4 rounded-full bg-white shadow-xl border border-gray-100 text-gray-700 hover:text-[#8B4513] hover:scale-110 transition-all disabled:opacity-50"
              disabled={currentIndex === teams.length - 1}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Draggable Track */}
          <div className="overflow-hidden py-12 -my-12">
            <motion.div
              style={{ x }}
              drag="x"
              dragConstraints={{
                left: -((teams.length - 1) * (CARD_WIDTH + GAP)),
                right: 0
              }}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={handleDragEnd}
              className="flex items-center cursor-grab active:cursor-grabbing"
            >
              {teams.map((team, index) => {
                const leaders = parseLeaders(team.leader);
                const colors = TEAM_COLORS[team.name] || {
                  primary: "#6B7280",
                  gradient: "from-gray-500 via-gray-600 to-gray-700",
                  light: "#F9FAFB",
                  accent: "#E5E7EB",
                  shadow: "shadow-gray-500/20",
                };

                const isActive = index === currentIndex;

                return (
                  <motion.div
                    key={team.id}
                    className="shrink-0 relative"
                    style={{
                      width: CARD_WIDTH,
                      marginRight: index === teams.length - 1 ? 0 : GAP
                    }}
                    animate={{
                      scale: isActive ? 1 : 0.9,
                      opacity: isActive ? 1 : 0.6,
                      y: isActive ? 0 : 20,
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    {/* Card - Modern Dark Glass Design */}
                    <div className={cn(
                      "relative rounded-3xl overflow-hidden transition-all duration-500 group",
                      isActive ? "shadow-2xl" : "shadow-lg"
                    )}
                    style={{
                      background: `linear-gradient(135deg, ${colors.primary}15, ${colors.primary}05)`,
                      border: `1px solid ${colors.primary}30`
                    }}
                    >
                      {/* Glass Background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-xl" />
                      
                      {/* Accent Glow */}
                      <div 
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full blur-3xl opacity-30"
                        style={{ backgroundColor: colors.primary }}
                      />

                      {/* Content */}
                      <div className="relative px-6 py-8 text-center">
                        {/* Team Badge */}
                        <div className="mb-6">
                          <span 
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase"
                            style={{ 
                              backgroundColor: `${colors.primary}20`,
                              color: colors.primary,
                              border: `1px solid ${colors.primary}40`
                            }}
                          >
                            <Crown className="w-3 h-3" />
                            {team.name}
                          </span>
                        </div>

                        {/* Avatar */}
                        <div className="relative inline-block mb-6">
                          <div 
                            className="w-28 h-28 rounded-2xl overflow-hidden bg-slate-700 relative z-10 shadow-xl"
                            style={{ border: `3px solid ${colors.primary}` }}
                          >
                            <Image
                              src={getLeaderPhoto(team.leader_photo, 0)}
                              alt={leaders[0]}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          </div>
                          {/* Floating Crown Badge */}
                          <div 
                            className="absolute -bottom-2 -right-2 z-20 p-2.5 rounded-xl shadow-lg"
                            style={{ backgroundColor: colors.primary }}
                          >
                            <Crown className="w-4 h-4 text-white" />
                          </div>
                        </div>

                        {/* Names */}
                        <div className="mb-5">
                          <h3 className="text-xl font-bold text-white mb-2">
                            {leaders.length > 1 ? (
                              <span className="flex flex-col">
                                <span>{leaders[0]}</span>
                                <span className="text-base text-slate-400 font-medium">& {leaders[1]}</span>
                              </span>
                            ) : (
                              leaders[0]
                            )}
                          </h3>
                          <div 
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
                            style={{ backgroundColor: `${colors.primary}15`, color: colors.primary }}
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>Team Captain</span>
                          </div>
                        </div>

                        {/* Quote */}
                        <div className="relative mb-6 px-2">
                          <p className="text-slate-400 text-sm leading-relaxed">
                            "{team.description || "Leading with passion, inspiring with action."}"
                          </p>
                        </div>

                        {/* Stats Row */}
                        <div className="flex justify-center gap-6 mb-6 py-4 border-y border-slate-700/50">
                          <div className="text-center">
                            <div className="text-lg font-bold text-white">3</div>
                            <div className="text-xs text-slate-500">Members</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold" style={{ color: colors.primary }}>Top 4</div>
                            <div className="text-xs text-slate-500">Rank</div>
                          </div>
                        </div>

                        {/* Contact Action */}
                        <button
                          className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-[1.02]"
                          style={{
                            backgroundColor: colors.primary,
                            color: 'white'
                          }}
                        >
                          <Mail className="w-4 h-4" />
                          <span>View Profile</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Progress Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {teams.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  currentIndex === idx ? "w-8 bg-[#8B4513]" : "w-2 bg-gray-300 hover:bg-gray-400"
                )}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
