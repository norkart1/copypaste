"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { LiveScorePulse } from "@/components/live-score-pulse";
import { TeamLeadersShowcase } from "@/components/team-leaders-showcase";
import { useScoreboardUpdates } from "@/hooks/use-realtime";
import { useRouter } from "next/navigation";
import type { Team } from "@/lib/types";
import { Trophy, Users, BarChart3, Zap, ArrowRight, Sparkles } from "lucide-react";

interface HomeRealtimeProps {
  teams: Team[];
  liveScores: Map<string, number>;
}

export function HomeRealtime({ teams: initialTeams, liveScores: initialLiveScores }: HomeRealtimeProps) {
  const router = useRouter();

  useScoreboardUpdates(() => {
    router.refresh();
  });

  return (
    <main className="space-y-0">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 flex flex-col">
        {/* Animated background elements with festival colors */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl animate-pulse delay-500"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-600/10 rounded-full blur-3xl"></div>
        </div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(20,184,166,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>

        <div className="container mx-auto max-w-7xl relative z-10 flex-1 flex flex-col justify-center px-4 sm:px-6 md:px-8 py-16 md:py-20">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            {/* Left - Cultural Festival Image */}
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[450px] lg:h-[450px] flex-shrink-0">
              <Image
                src="/festival-logo.png"
                alt="CulturaMeet - Cultural Festival"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>

            {/* Right - Content */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
              {/* Badge */}
              <Badge className="bg-teal-500/20 text-teal-300 border-teal-400/30 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 mr-1.5 inline" />
                Cultural Festival Platform
              </Badge>

              {/* Main Title */}
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight">
                  Cultura<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-orange-400 to-amber-400">Meet</span>
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl text-slate-300 max-w-xl leading-relaxed">
                  The modern platform for cultural festivals. Live scores, real-time results, and seamless team management.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Link href="/results">
                  <Button size="lg" className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold px-8 py-6 text-lg rounded-xl shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 transition-all group">
                    View Results
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/scoreboard">
                  <Button size="lg" variant="outline" className="border-slate-600 text-slate-200 hover:bg-slate-800 hover:text-white px-8 py-6 text-lg rounded-xl">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Live Scoreboard
                  </Button>
                </Link>
              </div>

              {/* Stats Preview */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 w-full max-w-2xl">
                {[
                  { label: "Teams", value: initialTeams.length.toString(), icon: Users, color: "teal" },
                  { label: "Live Updates", value: "Real-time", icon: Zap, color: "orange" },
                  { label: "Categories", value: "Multiple", icon: Trophy, color: "amber" },
                  { label: "Platform", value: "Modern", icon: Sparkles, color: "teal" },
                ].map((stat, index) => (
                  <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 text-center hover:bg-white/10 transition-colors">
                    <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color === 'teal' ? 'text-teal-400' : stat.color === 'orange' ? 'text-orange-400' : 'text-amber-400'}`} />
                    <p className="text-xl font-bold text-white">{stat.value}</p>
                    <p className="text-sm text-slate-400">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-teal-500/50 flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-teal-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Live Score Pulse Section */}
      <section className="bg-slate-50 py-16 sm:py-20 md:py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <LiveScorePulse teams={initialTeams} liveScores={initialLiveScores} />
        </div>
      </section>

      {/* Team Leaders Section */}
      <section className="bg-white py-16 sm:py-20 md:py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <TeamLeadersShowcase teams={initialTeams} />
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-16 sm:py-20 md:py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <div className="space-y-12">
            <div className="text-center max-w-3xl mx-auto">
              <Badge className="bg-teal-100 text-teal-700 border-teal-200 mb-4 text-sm">Platform Features</Badge>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                Everything You Need
              </h2>
              <p className="text-slate-600 text-lg md:text-xl leading-relaxed">
                CulturaMeet provides all the tools for running successful cultural festivals with transparency and real-time engagement.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { 
                  title: "Live Scoring", 
                  copy: "Real-time score updates as results are approved. Teams and participants stay connected to every moment.", 
                  tag: "Real-time",
                  icon: Zap,
                  color: "teal"
                },
                { 
                  title: "Team Management", 
                  copy: "Complete team portal for registration, participant management, and performance tracking throughout the event.", 
                  tag: "Teams",
                  icon: Users,
                  color: "orange"
                },
                { 
                  title: "Fair Judging", 
                  copy: "Transparent scoring system with admin approvals. Every result is verified before being published.", 
                  tag: "Transparent",
                  icon: Trophy,
                  color: "amber"
                },
                { 
                  title: "Instant Results", 
                  copy: "View results by program category with detailed breakdowns. Download and share result posters instantly.", 
                  tag: "Results",
                  icon: BarChart3,
                  color: "coral"
                },
              ].map((item) => (
                <Card key={item.title} className="bg-white border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 p-6 group">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${
                    item.color === 'teal' ? 'bg-teal-100' : 
                    item.color === 'orange' ? 'bg-orange-100' : 
                    item.color === 'amber' ? 'bg-amber-100' : 'bg-rose-100'
                  }`}>
                    <item.icon className={`w-6 h-6 ${
                      item.color === 'teal' ? 'text-teal-600' : 
                      item.color === 'orange' ? 'text-orange-600' : 
                      item.color === 'amber' ? 'text-amber-600' : 'text-rose-600'
                    }`} />
                  </div>
                  <Badge className={`mb-3 text-xs ${
                    item.color === 'teal' ? 'bg-teal-50 text-teal-700 border-teal-200' : 
                    item.color === 'orange' ? 'bg-orange-50 text-orange-700 border-orange-200' : 
                    item.color === 'amber' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>{item.tag}</Badge>
                  <CardTitle className="text-xl text-slate-900 mb-3">{item.title}</CardTitle>
                  <CardDescription className="text-slate-600 leading-relaxed">{item.copy}</CardDescription>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Portal Access Section */}
      <section className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 py-16 sm:py-20 md:py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-white/10 p-8 md:p-12 backdrop-blur-sm">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="flex-1">
                <Badge className="bg-teal-500/20 text-teal-300 border-teal-400/30 mb-4">Access Portals</Badge>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  CulturaMeet Control Center
                </h2>
                <p className="text-slate-300 text-lg leading-relaxed max-w-2xl">
                  Access dedicated portals for admins, jury members, and team coordinators. 
                  Each role has tailored tools for managing the festival experience.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/admin/login">
                  <Button variant="outline" className="border-slate-600 text-slate-200 hover:bg-slate-700 hover:text-white w-full sm:w-auto">
                    Admin Portal
                  </Button>
                </Link>
                <Link href="/jury/login">
                  <Button variant="outline" className="border-slate-600 text-slate-200 hover:bg-slate-700 hover:text-white w-full sm:w-auto">
                    Jury Portal
                  </Button>
                </Link>
                <Link href="/team/login">
                  <Button className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white w-full sm:w-auto">
                    Team Portal
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-8 border-t border-slate-800">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/festival-logo.png"
                alt="CulturaMeet"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <span className="text-slate-400 text-sm">CulturaMeet - Cultural Festival Platform</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/results" className="text-slate-400 hover:text-teal-400 text-sm transition-colors">
                Results
              </Link>
              <Link href="/scoreboard" className="text-slate-400 hover:text-teal-400 text-sm transition-colors">
                Scoreboard
              </Link>
              <Link href="/participant" className="text-slate-400 hover:text-teal-400 text-sm transition-colors">
                Participants
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
