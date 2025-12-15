"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Card } from "@/components/ui/card";
import { Users, Edit2, Trash2, Phone } from "lucide-react";
import type { Team } from "@/lib/types";

interface TeamCardWrapperProps {
  team: Team;
  studentCount: number;
  updateAction: (formData: FormData) => Promise<void>;
  deleteAction: (formData: FormData) => Promise<void>;
  presetColors: { name: string; value: string }[];
}

export function TeamCardWrapper({
  team,
  studentCount,
  updateAction,
  deleteAction,
  presetColors,
}: TeamCardWrapperProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedColor, setSelectedColor] = useState(team.color);

  const handleDelete = async () => {
    setIsDeleting(true);
    const formData = new FormData();
    formData.append("id", team.id);
    await deleteAction(formData);
    setIsDeleting(false);
    setShowDeleteModal(false);
  };

  return (
    <>
      <Card className="relative overflow-hidden">
        <div 
          className="absolute top-0 left-0 right-0 h-2"
          style={{ backgroundColor: team.color }}
        />
        <div className="pt-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-white">{team.name}</h3>
              <p className="text-sm text-white/60">Leader: {team.leader}</p>
            </div>
            <div 
              className="w-8 h-8 rounded-full border-2 border-white/20"
              style={{ backgroundColor: team.color }}
            />
          </div>
          
          <p className="text-sm text-white/70 mt-2 line-clamp-2">{team.description}</p>
          
          <div className="flex items-center gap-4 mt-4 text-sm text-white/60">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{studentCount} students</span>
            </div>
            <div className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              <span className="truncate max-w-[120px]">{team.contact}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
            <span className="text-xs text-white/40 font-mono">{team.id}</span>
            <div className="flex-1" />
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowEditModal(true)}
              className="p-2"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowDeleteModal(true)}
              className="p-2 text-red-400 hover:text-red-300"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      <Modal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Team"
        actions={
          <>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button type="submit" form="edit-team-form">
              Save Changes
            </Button>
          </>
        }
      >
        <form id="edit-team-form" action={updateAction} className="space-y-4">
          <input type="hidden" name="id" value={team.id} />
          <input type="hidden" name="color" value={selectedColor} />
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Team Name
            </label>
            <Input name="name" defaultValue={team.name} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Team Leader
            </label>
            <Input name="leader" defaultValue={team.leader} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Description
            </label>
            <Input name="description" defaultValue={team.description} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Contact
            </label>
            <Input name="contact" defaultValue={team.contact} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Leader Photo URL
            </label>
            <Input name="leader_photo" defaultValue={team.leader_photo} />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Portal Password
            </label>
            <Input name="portal_password" defaultValue={team.portal_password || ""} />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Team Color
            </label>
            <div className="flex items-center gap-2">
              <input 
                type="color" 
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-12 h-10 p-1 cursor-pointer rounded border border-white/20"
              />
              <div className="flex gap-1 flex-wrap">
                {presetColors.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                      selectedColor === preset.value ? "border-white scale-110" : "border-white/30"
                    }`}
                    style={{ backgroundColor: preset.value }}
                    title={preset.name}
                    onClick={() => setSelectedColor(preset.value)}
                  />
                ))}
              </div>
            </div>
          </div>
        </form>
      </Modal>

      <Modal
        open={showDeleteModal}
        onClose={() => !isDeleting && setShowDeleteModal(false)}
        title="Delete Team"
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </>
        }
      >
        <p className="text-white/80">
          Are you sure you want to delete <strong>{team.name}</strong>? This action cannot be undone.
        </p>
        {studentCount > 0 && (
          <p className="mt-2 text-sm text-amber-300">
            Warning: This team has {studentCount} student{studentCount !== 1 ? "s" : ""} assigned. 
            You must reassign or remove all students before deleting this team.
          </p>
        )}
      </Modal>
    </>
  );
}
