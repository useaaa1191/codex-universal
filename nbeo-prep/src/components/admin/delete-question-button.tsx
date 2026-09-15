"use client";

import * as React from "react";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteQuestion } from "@/lib/actions";
import { toast } from "@/components/ui/use-toast";

export function DeleteQuestionButton({ id }: { id: string }) {
  const [loading, setLoading] = React.useState(false);
  const [confirm, setConfirm] = React.useState(false);

  async function onDelete() {
    setLoading(true);
    try {
      await deleteQuestion(id);
      toast({ variant: "success", title: "Question deleted" });
    } catch {
      toast({ variant: "destructive", title: "Delete failed" });
    } finally {
      setLoading(false);
      setConfirm(false);
    }
  }

  return (
    <Button
      variant={confirm ? "destructive" : "ghost"}
      size="icon"
      onClick={() => (confirm ? onDelete() : setConfirm(true))}
      onBlur={() => setConfirm(false)}
      disabled={loading}
      aria-label={confirm ? "Confirm delete" : "Delete question"}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
    </Button>
  );
}
