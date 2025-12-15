import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Clock, TrendingUp } from "lucide-react";

import { LiveScorePie } from "@/components/live-score-pie";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import {
  getApprovedResults,
  getLiveScores,
  getPendingResults,
  getPrograms,
  getStudents,
  getTeams,
} from "@/lib/data";
import { formatNumber } from "@/lib/utils";

async function getDashboardData() {
  const [programs, students, pending, approved, teams, liveScores] = await Promise.all([
    getPrograms(),
    getStudents(),
    getPendingResults(),
    getApprovedResults(),
    getTeams(),
    getLiveScores(),
  ]);

  return {
    stats: [
      { label: "Total Programs", value: programs.length, color: "bg-emerald-500" },
      { label: "Participants", value: students.length, color: "bg-teal-500" },
      { label: "Pending Results", value: pending.length, color: "bg-amber-500" },
      { label: "Approved Results", value: approved.length, color: "bg-green-500" },
    ],
    teams: teams,
    pending,
    approved,
    liveScores,
  };
}

export default async function AdminDashboardPage() {
  const data = await getDashboardData();
  const liveScoreMap = new Map(data.liveScores.map((item) => [item.team_id, item.total_points]));
  const enrichedTeams = data.teams.map((team) => ({
    ...team,
    livePoints: liveScoreMap.get(team.id) ?? team.total_points,
  }));
  const sortedTeams = [...enrichedTeams].sort((a, b) => b.livePoints - a.livePoints);
  const topTeam = sortedTeams[0];
  const runnerUp = sortedTeams[1];
  const totalPoints = sortedTeams.reduce((sum, team) => sum + team.livePoints, 0);
  const totalResults = data.pending.length + data.approved.length;
  const approvalRate = totalResults ? Math.round((data.approved.length / totalResults) * 100) : 0;
  const pendingRate = totalResults ? Math.round((data.pending.length / totalResults) * 100) : 0;

  return (
    <div className="space-y-5">
      <section className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 p-6 text-white shadow-xl shadow-emerald-500/20">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur-sm">
              <TrendingUp className="h-3 w-3" /> CulturaMeet Control
            </span>
            <span className="text-xs text-white/80">Approval rate • {approvalRate}%</span>
          </div>
          <h1 className="mt-4 text-xl md:text-2xl font-semibold leading-snug">
            Live overview of submissions, results, and team momentum.
          </h1>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-white/20 backdrop-blur-sm p-4">
              <p className="text-[10px] uppercase tracking-widest text-white/70">Current Leader</p>
              {topTeam ? (
                <>
                  <p className="mt-1 text-xl font-bold">{topTeam.name}</p>
                  <p className="text-sm text-white/80">{formatNumber(topTeam.livePoints)} pts</p>
                </>
              ) : (
                <p className="mt-1 text-sm text-white/70">No teams found.</p>
              )}
            </div>
            <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4">
              <p className="text-[10px] uppercase tracking-widest text-white/70">Pending Reviews</p>
              <p className="mt-1 text-xl font-bold">{data.pending.length}</p>
              <p className="text-sm text-white/80">{pendingRate}% of all submissions</p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href="/admin/pending-results"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-emerald-600 shadow-lg hover:bg-gray-50 transition-colors"
            >
              Review Pending <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/admin/approved-results"
              className="inline-flex items-center gap-1.5 rounded-xl border-2 border-white/40 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
            >
              View Approved
            </Link>
          </div>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Approval Rate</p>
              <p className="text-2xl font-bold text-gray-900">{approvalRate}%</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Pending Items</p>
              <p className="text-2xl font-bold text-gray-900">{data.pending.length}</p>
            </div>
          </div>
          <div className="mt-5 space-y-2">
            <p className="text-[10px] uppercase tracking-widest text-gray-400">Quick Links</p>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/admin/add-result"
                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                Submit Result <ArrowUpRight className="h-3 w-3" />
              </Link>
              <Link
                href="/admin/jury"
                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                Manage Jury
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {data.stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${stat.color}`} />
              <p className="text-[10px] uppercase tracking-widest text-gray-400">{stat.label}</p>
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl bg-white shadow-sm overflow-hidden">
          <LiveScorePie teams={data.teams} liveScores={liveScoreMap} />
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900">Insights</h3>
          <p className="mt-0.5 text-xs text-gray-500">
            Snapshot of live performance across all houses.
          </p>
          <div className="mt-4 space-y-4">
            <div className="rounded-xl bg-gray-50 p-3">
              <p className="text-[10px] uppercase tracking-widest text-gray-400">Runner Up</p>
              <p className="mt-0.5 text-lg font-bold text-gray-900">{runnerUp?.name ?? "—"}</p>
              {runnerUp && (
                <p className="text-xs text-gray-500">{formatNumber(runnerUp.livePoints)} pts</p>
              )}
            </div>
            <div className="rounded-xl bg-gray-50 p-3">
              <p className="text-[10px] uppercase tracking-widest text-gray-400">Total Points Logged</p>
              <p className="mt-0.5 text-lg font-bold text-gray-900">{formatNumber(totalPoints)}</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-3">
              <p className="text-[10px] uppercase tracking-widest text-gray-400">Pending Items</p>
              <p className="mt-0.5 text-lg font-bold text-gray-900">{data.pending.length}</p>
              <p className="text-xs text-gray-500">{pendingRate}% of submissions</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900">Team Highlights</h3>
          <p className="mt-0.5 text-xs text-gray-500">Quick roster overview</p>
          <div className="mt-4 space-y-2">
            {sortedTeams.slice(0, 5).map((team, index) => (
              <div
                key={team.id}
                className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full text-white text-sm font-bold ${index === 0 ? 'bg-emerald-500' : index === 1 ? 'bg-teal-500' : 'bg-gray-400'}`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{team.name}</p>
                    <p className="text-[10px] text-gray-500">Leader · {team.leader}</p>
                  </div>
                </div>
                <p className="text-lg font-bold text-emerald-600">{formatNumber(team.livePoints)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900">Latest Pending Results</h3>
          <p className="mt-0.5 text-xs text-gray-500">
            Approve or reject from the Pending Results tab.
          </p>
          <div className="mt-4 space-y-2">
            {data.pending.slice(0, 4).map((result) => (
              <div
                key={result.id}
                className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3"
              >
                <p className="text-[10px] text-amber-600 font-medium">Program #{result.program_id}</p>
                <p className="text-sm font-semibold text-gray-900">
                  Submitted by {result.submitted_by}
                </p>
                <p className="text-[10px] text-gray-500">
                  {new Date(result.submitted_at).toLocaleString()}
                </p>
              </div>
            ))}
            {data.pending.length === 0 && (
              <div className="rounded-xl bg-gray-50 px-4 py-6 text-center">
                <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500" />
                <p className="mt-2 text-sm text-gray-500">No pending entries!</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
