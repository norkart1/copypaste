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
      <section className="relative overflow-hidden min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl"></div>
        </div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>

        <div className="container mx-auto max-w-7xl relative z-10 flex-1 flex flex-col justify-center px-4 sm:px-6 md:px-8 py-16 md:py-20">
          <div className="flex flex-col items-center text-center space-y-8">
            {/* Logo */}
            <div className="relative w-24 h-24 md:w-32 md:h-32 mb-4">
              <Image
                src="/icon-512x512.png"
                alt="CulturaMeet Logo"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>

            {/* Badge */}
            <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-400/30 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 inline" />
              Cultural Festival Platform
            </Badge>

            {/* Main Title */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight">
                Cultura<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Meet</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                The modern platform for cultural festivals. Live scores, real-time results, and seamless team management.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Link href="/results">
                <Button size="lg" className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold px-8 py-6 text-lg rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all group">
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-12 w-full max-w-3xl">
              {[
                { label: "Teams", value: initialTeams.length.toString(), icon: Users },
                { label: "Live Updates", value: "Real-time", icon: Zap },
                { label: "Categories", value: "Multiple", icon: Trophy },
                { label: "Platform", value: "Modern", icon: Sparkles },
              ].map((stat, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 text-center">
                  <stat.icon className="w-5 h-5 text-indigo-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-slate-500 flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-slate-400 rounded-full animate-pulse"></div>
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
              <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 mb-4 text-sm">Platform Features</Badge>
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
                  color: "indigo"
                },
                { 
                  title: "Team Management", 
                  copy: "Complete team portal for registration, participant management, and performance tracking throughout the event.", 
                  tag: "Teams",
                  icon: Users,
                  color: "purple"
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
                  color: "emerald"
                },
              ].map((item) => (
                <Card key={item.title} className="bg-white border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 p-6 group">
                  <div className={`w-12 h-12 rounded-xl bg-${item.color}-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <item.icon className={`w-6 h-6 text-${item.color}-600`} />
                  </div>
                  <Badge className={`bg-${item.color}-50 text-${item.color}-700 border-${item.color}-200 mb-3 text-xs`}>{item.tag}</Badge>
                  <CardTitle className="text-xl text-slate-900 mb-3">{item.title}</CardTitle>
                  <CardDescription className="text-slate-600 leading-relaxed">{item.copy}</CardDescription>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Portal Access Section */}
      <section className="bg-slate-900 py-16 sm:py-20 md:py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 p-8 md:p-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="flex-1">
                <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-400/30 mb-4">Access Portals</Badge>
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
                  <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white w-full sm:w-auto">
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
                src="/icon-192x192.png"
                alt="CulturaMeet"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="text-slate-400 text-sm">CulturaMeet - Cultural Festival Platform</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/results" className="text-slate-400 hover:text-white text-sm transition-colors">
                Results
              </Link>
              <Link href="/scoreboard" className="text-slate-400 hover:text-white text-sm transition-colors">
                Scoreboard
              </Link>
              <Link href="/participant" className="text-slate-400 hover:text-white text-sm transition-colors">
                Participants
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
