/**
 * React Query hooks wrapping all ISIN API endpoints.
 * Use these in components instead of calling api.ts directly.
 */
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi, tasksApi, submissionsApi, passportsApi, recruiterApi } from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import type { Task, Submission, SkillPassport, CandidateResult, SearchQuery } from "@/types";

// ─── Query Keys ──────────────────────────────────────
export const queryKeys = {
  profile: ["profile"] as const,
  tasks: (filters?: Record<string, string>) => ["tasks", filters] as const,
  task: (id: string) => ["task", id] as const,
  submissions: ["submissions"] as const,
  submission: (id: string) => ["submission", id] as const,
  passport: ["passport"] as const,
  passportPublic: (id: string) => ["passport", id] as const,
  skills: ["skills"] as const,
  recruiterSearch: (query: SearchQuery) => ["recruiter", query] as const,
};

// ─── Auth Hooks ──────────────────────────────────────

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();

  return useMutation({
    mutationFn: (data: { email: string; password: string }) => authApi.login(data),
    onSuccess: (res) => {
      setAuth(res.data.user, res.data.access_token);
      // Also set cookie for middleware
      document.cookie = `isin_token=${res.data.access_token};path=/;max-age=3600;SameSite=Lax`;
      router.push("/dashboard");
    },
  });
}

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();

  return useMutation({
    mutationFn: (data: { email: string; password: string; full_name: string; college?: string }) =>
      authApi.register(data),
    onSuccess: (res) => {
      setAuth(res.data.user, res.data.access_token);
      document.cookie = `isin_token=${res.data.access_token};path=/;max-age=3600;SameSite=Lax`;
      router.push("/dashboard");
    },
  });
}

export function useProfile() {
  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: () => authApi.getProfile().then((r) => r.data),
    retry: false,
  });
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();
  const router = useRouter();

  return () => {
    logout();
    document.cookie = "isin_token=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    queryClient.clear();
    router.push("/login");
  };
}

// ─── Task Hooks ──────────────────────────────────────

export function useTasks(filters?: { difficulty?: string; task_type?: string }) {
  return useQuery<Task[]>({
    queryKey: queryKeys.tasks(filters as Record<string, string>),
    queryFn: () => tasksApi.list(filters).then((r) => r.data),
  });
}

export function useTask(id: string) {
  return useQuery<Task>({
    queryKey: queryKeys.task(id),
    queryFn: () => tasksApi.get(id).then((r) => r.data),
    enabled: !!id,
  });
}

export function useGenerateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => tasksApi.generate(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });
}

// ─── Submission Hooks ────────────────────────────────

export function useSubmit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { task_id: string; code: string; language?: string }) =>
      submissionsApi.submit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
      queryClient.invalidateQueries({ queryKey: ["passport"] });
    },
  });
}

export function useSubmission(id: string) {
  return useQuery<Submission>({
    queryKey: queryKeys.submission(id),
    queryFn: () => submissionsApi.get(id).then((r) => r.data),
    enabled: !!id,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      // Poll while processing
      if (status === "pending" || status === "running" || status === "evaluating") {
        return 2000;
      }
      return false;
    },
  });
}

export function useMySubmissions() {
  return useQuery<Submission[]>({
    queryKey: queryKeys.submissions,
    queryFn: () => submissionsApi.listMine().then((r) => r.data),
  });
}

// ─── Passport Hooks ──────────────────────────────────

export function useMyPassport() {
  return useQuery<SkillPassport>({
    queryKey: queryKeys.passport,
    queryFn: () => passportsApi.getMine().then((r) => r.data),
    retry: false,
  });
}

export function usePublicPassport(passportId: string) {
  return useQuery<SkillPassport>({
    queryKey: queryKeys.passportPublic(passportId),
    queryFn: () => passportsApi.getPublic(passportId).then((r) => r.data),
    enabled: !!passportId,
  });
}

export function useMySkills() {
  return useQuery({
    queryKey: queryKeys.skills,
    queryFn: () => passportsApi.getMySkills().then((r) => r.data),
  });
}

// ─── Recruiter Hooks ─────────────────────────────────

export function useRecruiterSearch(query: SearchQuery) {
  return useQuery<CandidateResult[]>({
    queryKey: queryKeys.recruiterSearch(query),
    queryFn: () => recruiterApi.search(query).then((r) => r.data),
    enabled: false, // Manual trigger via refetch
  });
}
