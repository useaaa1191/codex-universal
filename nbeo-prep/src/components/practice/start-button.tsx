"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { createAttempt } from "@/lib/actions";
import { toast } from "@/components/ui/use-toast";
import type { CreateAttemptInput } from "@/lib/validators";

export function StartButton({
  params,
  children,
  ...props
}: { params: CreateAttemptInput } & ButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  async function go() {
    setLoading(true);
    try {
      const res = await createAttempt(params);
      router.push(`/session/${res.attemptId}`);
    } catch (e) {
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Could not start",
        description: e instanceof Error ? e.message : "Try again.",
      });
    }
  }

  return (
    <Button onClick={go} disabled={loading} {...props}>
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
}
