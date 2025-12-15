import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  createTeam,
  deleteTeamById,
  getTeams,
  updateTeamById,
  getStudents,
} from "@/lib/data";
import { redirectWithToast } from "@/lib/actions";
import { TeamCardWrapper } from "@/components/team-card-wrapper";

const teamSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Team name must be at least 2 characters"),
  leader: z.string().min(2, "Leader name is required"),
  leader_photo: z.string().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color"),
  description: z.string().min(5, "Description is required"),
  contact: z.string().min(5, "Contact info is required"),
  portal_password: z.string().optional(),
});

async function upsertTeam(formData: FormData, mode: "create" | "update") {
  const parsed = teamSchema.safeParse({
    id: formData.get("id") ?? undefined,
    name: String(formData.get("name") ?? "").trim(),
    leader: String(formData.get("leader") ?? "").trim(),
    leader_photo: String(formData.get("leader_photo") ?? "").trim() || undefined,
    color: String(formData.get("color") ?? "#1E3A8A").trim(),
    description: String(formData.get("description") ?? "").trim(),
    contact: String(formData.get("contact") ?? "").trim(),
    portal_password: String(formData.get("portal_password") ?? "").trim() || undefined,
  });
  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((issue) => issue.message).join(", "));
  }
  const payload = parsed.data;

  if (mode === "create") {
    await createTeam({
      name: payload.name,
      leader: payload.leader,
      leader_photo: payload.leader_photo,
      color: payload.color,
      description: payload.description,
      contact: payload.contact,
      portal_password: payload.portal_password,
    });
  } else {
    if (!payload.id) throw new Error("Team ID required");
    await updateTeamById(payload.id, {
      name: payload.name,
      leader: payload.leader,
      leader_photo: payload.leader_photo,
      color: payload.color,
      description: payload.description,
      contact: payload.contact,
      portal_password: payload.portal_password,
    });
  }

  revalidatePath("/admin/teams");
}

async function deleteTeamAction(formData: FormData) {
  "use server";
  try {
    const id = String(formData.get("id") ?? "");
    await deleteTeamById(id);
    revalidatePath("/admin/teams");
    redirectWithToast("/admin/teams", "Team deleted successfully!", "success");
  } catch (error: any) {
    if (error?.digest === "NEXT_REDIRECT" || error?.message === "NEXT_REDIRECT") {
      throw error;
    }
    revalidatePath("/admin/teams");
    redirectWithToast("/admin/teams", error?.message || "Failed to delete team", "error");
  }
}

async function createTeamAction(formData: FormData) {
  "use server";
  try {
    await upsertTeam(formData, "create");
    revalidatePath("/admin/teams");
    redirectWithToast("/admin/teams", "Team created successfully!", "success");
  } catch (error: any) {
    if (error?.digest === "NEXT_REDIRECT" || error?.message === "NEXT_REDIRECT") {
      throw error;
    }
    revalidatePath("/admin/teams");
    redirectWithToast("/admin/teams", error?.message || "Failed to create team", "error");
  }
}

async function updateTeamAction(formData: FormData) {
  "use server";
  try {
    await upsertTeam(formData, "update");
    revalidatePath("/admin/teams");
    redirectWithToast("/admin/teams", "Team updated successfully!", "success");
  } catch (error: any) {
    if (error?.digest === "NEXT_REDIRECT" || error?.message === "NEXT_REDIRECT") {
      throw error;
    }
    revalidatePath("/admin/teams");
    redirectWithToast("/admin/teams", error?.message || "Failed to update team", "error");
  }
}

const PRESET_COLORS = [
  { name: "Red", value: "#D72638" },
  { name: "Blue", value: "#1E3A8A" },
  { name: "Purple", value: "#7C3AED" },
  { name: "Yellow", value: "#FACC15" },
  { name: "Green", value: "#059669" },
  { name: "Orange", value: "#FB923C" },
  { name: "Pink", value: "#EC4899" },
  { name: "Teal", value: "#14B8A6" },
];

export default async function TeamsManagementPage() {
  const [teams, students] = await Promise.all([
    getTeams(),
    getStudents(),
  ]);

  const studentCounts = new Map<string, number>();
  students.forEach((student) => {
    const count = studentCounts.get(student.team_id) || 0;
    studentCounts.set(student.team_id, count + 1);
  });

  return (
    <div className="space-y-8">
      <Card>
        <CardTitle>Add Team</CardTitle>
        <CardDescription className="mt-2">
          Create a new team for the cultural festival.
        </CardDescription>
        <form action={createTeamAction} className="mt-6 grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input name="name" placeholder="Team Name (e.g., SAMARQAND)" required />
            <Input name="leader" placeholder="Team Leader Name" required />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Input name="description" placeholder="Team Description" required />
            <Input name="contact" placeholder="Contact Info (phone/email)" required />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Input name="leader_photo" placeholder="Leader Photo URL (optional)" />
            <Input name="portal_password" placeholder="Portal Password (optional)" />
            <div className="flex items-center gap-2">
              <Input name="color" type="color" defaultValue="#1E3A8A" className="w-16 h-10 p-1 cursor-pointer" />
              <div className="flex gap-1 flex-wrap">
                {PRESET_COLORS.slice(0, 6).map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    className="w-6 h-6 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform"
                    style={{ backgroundColor: preset.value }}
                    title={preset.name}
                    onClick={(e) => {
                      const colorInput = e.currentTarget.closest('form')?.querySelector('input[name="color"]') as HTMLInputElement;
                      if (colorInput) colorInput.value = preset.value;
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          <Button type="submit" className="w-full md:w-auto">Create Team</Button>
        </form>
      </Card>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => (
          <TeamCardWrapper
            key={team.id}
            team={team}
            studentCount={studentCounts.get(team.id) || 0}
            updateAction={updateTeamAction}
            deleteAction={deleteTeamAction}
            presetColors={PRESET_COLORS}
          />
        ))}
      </div>
      {teams.length === 0 && (
        <Card>
          <CardTitle>No Teams Yet</CardTitle>
          <CardDescription>
            Create your first team to get started with the cultural festival.
          </CardDescription>
        </Card>
      )}
    </div>
  );
}
