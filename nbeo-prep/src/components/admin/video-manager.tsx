"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2, PlaySquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDuration } from "@/lib/utils";
import { addVideo, deleteVideo } from "@/lib/actions";
import { toast } from "@/components/ui/use-toast";

interface VideoRow {
  id: string;
  title: string;
  category: string;
  youtubeId: string;
  durationSec: number;
  isFree: boolean;
  partSubtitle: string | null;
}

const PART_OPTIONS = [
  { value: "none", label: "No part" },
  { value: "PART_1", label: "Part 1" },
  { value: "PART_2", label: "Part 2" },
  { value: "PART_3", label: "Part 3" },
];

export function VideoManager({ videos }: { videos: VideoRow[] }) {
  const router = useRouter();
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [youtubeId, setYoutubeId] = React.useState("");
  const [category, setCategory] = React.useState("Lesson");
  const [minutes, setMinutes] = React.useState("10");
  const [partSlug, setPartSlug] = React.useState("none");
  const [isFree, setIsFree] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  async function add() {
    if (title.trim().length < 2 || youtubeId.trim().length < 3) {
      toast({ variant: "destructive", title: "Title and YouTube ID are required" });
      return;
    }
    setSaving(true);
    try {
      await addVideo({
        title: title.trim(),
        description: description.trim() || title.trim(),
        youtubeId: youtubeId.trim(),
        category: category.trim() || "Lesson",
        durationSec: Math.round(Number(minutes) * 60) || 0,
        partSlug: partSlug === "none" ? undefined : (partSlug as "PART_1" | "PART_2" | "PART_3"),
        isFree,
      });
      toast({ variant: "success", title: "Video added" });
      setTitle("");
      setDescription("");
      setYoutubeId("");
      setMinutes("10");
      setIsFree(false);
      router.refresh();
    } catch (e) {
      toast({ variant: "destructive", title: "Add failed", description: e instanceof Error ? e.message : undefined });
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    setDeletingId(id);
    try {
      await deleteVideo(id);
      toast({ variant: "success", title: "Video removed" });
      router.refresh();
    } catch (e) {
      toast({ variant: "destructive", title: "Delete failed", description: e instanceof Error ? e.message : undefined });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="text-base">Add a video</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="v-title">Title</Label>
            <Input id="v-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Goldmann tonometry technique" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="v-desc">Description</Label>
            <Textarea id="v-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="v-yt">YouTube ID</Label>
              <Input id="v-yt" value={youtubeId} onChange={(e) => setYoutubeId(e.target.value)} placeholder="dQw4w9WgXcQ" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="v-cat">Category</Label>
              <Input id="v-cat" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Clinical Skills" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="v-min">Duration (minutes)</Label>
              <Input id="v-min" type="number" min={0} value={minutes} onChange={(e) => setMinutes(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Part</Label>
              <Select value={partSlug} onValueChange={setPartSlug}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PART_OPTIONS.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="text-sm font-medium">Free preview</p>
              <p className="text-xs text-muted-foreground">Viewable by free-tier users</p>
            </div>
            <Switch checked={isFree} onCheckedChange={setIsFree} />
          </div>
          <Button onClick={add} disabled={saving} className="w-full">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Add video
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">{videos.length} videos in library</p>
        {videos.map((v) => (
          <Card key={v.id}>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <PlaySquare className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{v.title}</p>
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  <Badge variant="outline" className="text-[10px]">{v.category}</Badge>
                  {v.partSubtitle && <Badge variant="secondary" className="text-[10px]">{v.partSubtitle}</Badge>}
                  {v.isFree && <Badge variant="success" className="text-[10px]">Free</Badge>}
                  <span className="text-xs text-muted-foreground">{formatDuration(v.durationSec)}</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => remove(v.id)}
                disabled={deletingId === v.id}
                aria-label={`Delete ${v.title}`}
              >
                {deletingId === v.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
