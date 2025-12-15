import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Clock } from "lucide-react";

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
      { label: "Total Programs", value: programs.length },
      { label: "Participants", value: students.length },
      { label: "Pending Results", value: pending.length },
      { label: "Approved Results", value: approved.length },
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
        <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-purple-900/60 via-fuchsia-900/40 to-teal-900/30 p-6 text-white shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Badge tone="cyan" className="text-[10px] px-2 py-0.5">CulturaMeet Control</Badge>
            <span className="text-xs text-white/60">Approval rate • {approvalRate}%</span>
          </div>
          <h1 className="mt-4 text-xl md:text-2xl font-medium leading-snug">
            Live overview of submissions, results, and team momentum.
          </h1>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-white/10 backdrop-blur-sm p-3">
              <p className="text-[10px] uppercase tracking-widest text-white/60">Current Leader</p>
              {topTeam ? (
                <>
                  <p className="mt-1 text-lg font-semibold">{topTeam.name}</p>
                  <p className="text-xs text-white/60">{formatNumber(topTeam.livePoints)} pts</p>
                </>
              ) : (
                <p className="mt-1 text-xs text-white/60">No teams found.</p>
              )}
            </div>
            <div className="rounded-xl bg-white/5 backdrop-blur-sm p-3">
              <p className="text-[10px] uppercase tracking-widest text-white/60">Pending Reviews</p>
              <p className="mt-1 text-lg font-semibold">{data.pending.length}</p>
              <p className="text-xs text-white/60">{pendingRate}% of all submissions</p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href="/admin/pending-results"
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-4 py-2 text-xs font-medium text-white backdrop-blur hover:bg-white/25 transition-colors"
            >
              Review Pending <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/admin/approved-results"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 px-4 py-2 text-xs font-medium text-white/80 hover:text-white hover:border-white/30 transition-colors"
            >
              View Approved
            </Link>
          </div>
        </div>
        <div className="rounded-2xl border border-white/5 bg-slate-900/60 backdrop-blur-sm p-5">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <div>
              <p className="text-xs text-white/50">Approval Rate</p>
              <p className="text-xl font-semibold text-white">{approvalRate}%</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Clock className="h-4 w-4 text-amber-400" />
            <div>
              <p className="text-xs text-white/50">Pending Items</p>
              <p className="text-xl font-semibold text-white">{data.pending.length}</p>
            </div>
          </div>
          <div className="mt-5 space-y-2">
            <p className="text-[10px] uppercase tracking-widest text-white/50">Quick Links</p>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/admin/add-result"
                className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/70 hover:text-white hover:border-white/20 transition-colors"
              >
                Submit Result <ArrowUpRight className="h-3 w-3" />
              </Link>
              <Link
                href="/admin/jury"
                className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/70 hover:text-white hover:border-white/20 transition-colors"
              >
                Manage Jury
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {data.stats.map((stat) => (
          <Card key={stat.label} className="rounded-xl border-white/5 bg-slate-900/60 backdrop-blur-sm p-4 text-white">
            <p className="text-[10px] uppercase tracking-widest text-white/50">{stat.label}</p>
            <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 bg-slate-900/60 border-white/5 rounded-xl backdrop-blur-sm">
          <LiveScorePie teams={data.teams} liveScores={liveScoreMap} />
        </Card>
        <Card className="bg-slate-900/60 border-white/5 rounded-xl backdrop-blur-sm p-5 text-white">
          <CardTitle className="text-base">Insights</CardTitle>
          <CardDescription className="mt-0.5 text-xs text-white/60">
            Snapshot of live performance across all houses.
          </CardDescription>
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/40">Runner Up</p>
              <p className="mt-0.5 text-lg font-semibold">{runnerUp?.name ?? "—"}</p>
              {runnerUp && (
                <p className="text-xs text-white/60">{formatNumber(runnerUp.livePoints)} pts</p>
              )}
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/40">Total Points Logged</p>
              <p className="mt-0.5 text-lg font-semibold">{formatNumber(totalPoints)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/40">Pending Items</p>
              <p className="mt-0.5 text-lg font-semibold">{data.pending.length}</p>
              <p className="text-xs text-white/60">{pendingRate}% of submissions</p>
            </div>
          </div>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card className="bg-slate-900/60 border-white/5 rounded-xl backdrop-blur-sm p-5">
          <CardTitle className="text-base">Team Highlights</CardTitle>
          <CardDescription className="mt-0.5 text-xs text-white/60">Quick roster overview</CardDescription>
          <div className="mt-4 space-y-2">
            {sortedTeams.slice(0, 5).map((team) => (
              <div
                key={team.id}
                className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium text-white">{team.name}</p>
                  <p className="text-[10px] text-white/50">Leader · {team.leader}</p>
                </div>
                <p className="text-lg font-bold text-amber-300">{formatNumber(team.livePoints)}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-slate-900/60 border-white/5 rounded-xl backdrop-blur-sm p-5">
          <CardTitle className="text-base">Latest Pending Results</CardTitle>
          <CardDescription className="mt-0.5 text-xs text-white/60">
            Approve or reject from the Pending Results tab.
          </CardDescription>
          <div className="mt-4 space-y-2">
            {data.pending.slice(0, 4).map((result) => (
              <div
                key={result.id}
                className="rounded-lg border border-white/5 bg-white/5 px-3 py-2"
              >
                <p className="text-[10px] text-white/50">Program #{result.program_id}</p>
                <p className="text-sm font-medium text-white">
                  Submitted by {result.submitted_by}
                </p>
                <p className="text-[10px] text-white/40">
                  {new Date(result.submitted_at).toLocaleString()}
                </p>
              </div>
            ))}
            {data.pending.length === 0 && (
              <p className="text-xs text-white/50">No pending entries.</p>
            )}
          </div>
        </Card>
      </section>
    </div>
  );
}
