"use client";

import { keepPreviousData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "./client";
import type {
  CreateObjectiveInput,
  CreateProjectInput,
  CreateProjectUpdateInput,
  Dashboard,
  Objective,
  PageMeta,
  Period,
  Project,
  ProjectDetail,
  ProjectFilters,
  ProjectListItem,
  ProjectType,
  ProjectUpdateListItem,
  ProfileUserInput,
  TeamMember,
  UpdateFilters,
  UserDetail,
  UserFilters,
  ValueFilters,
  ValueRealization,
} from "./types";

/** Lists the UI shows in full ask for this many rows (the API paginates everything). */
export const FULL_PAGE = 100;

export const queryKeys = {
  dashboard: (period: Period) => ["dashboard", period] as const,
  objectives: ["objectives"] as const,
  projectTypes: ["project-types"] as const,
  projects: (filters: ProjectFilters) => ["projects", filters] as const,
  project: (id: string) => ["project", id] as const,
  updates: (filters: UpdateFilters) => ["updates", filters] as const,
  users: (filters: UserFilters) => ["users", filters] as const,
  user: (id: string) => ["user", id] as const,
  value: (filters: ValueFilters) => ["value", filters] as const,
};

/* ----------------------------------------------------------------- Queries */

export function useDashboard(period: Period = "Annually") {
  return useQuery({
    queryKey: queryKeys.dashboard(period),
    queryFn: ({ signal }) =>
      apiRequest<Dashboard>("dashboard/summary", { query: { period, recentUpdatesLimit: 5 }, signal }).then((r) => r.data),
  });
}

export function useObjectives() {
  return useQuery({
    queryKey: queryKeys.objectives,
    queryFn: ({ signal }) => apiRequest<Objective[]>("objectives/get-active-objectives", { signal }).then((r) => r.data),
    staleTime: 5 * 60_000,
  });
}

export function useProjectTypes() {
  return useQuery({
    queryKey: queryKeys.projectTypes,
    queryFn: ({ signal }) => apiRequest<ProjectType[]>("projects/get-all-project-types", { signal }).then((r) => r.data),
    staleTime: Infinity,
  });
}

export function useProjects(filters: ProjectFilters = {}, { enabled = true } = {}) {
  const query = { PageSize: FULL_PAGE, ...filters };
  return useQuery({
    queryKey: queryKeys.projects(query),
    queryFn: ({ signal }) => apiRequest<ProjectListItem[]>("projects/get-all-projects", { query, signal }),
    placeholderData: keepPreviousData,
    enabled,
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: queryKeys.project(id),
    queryFn: ({ signal }) => apiRequest<ProjectDetail>(`projects/project-by-id/${id}`, { signal }).then((r) => r.data),
    enabled: !!id,
  });
}

/** Cross-project update feed, loaded a page at a time. */
export function useUpdatesFeed(filters: Omit<UpdateFilters, "PageNumber"> = {}) {
  const query = { PageSize: 20, ...filters };
  return useInfiniteQuery({
    queryKey: queryKeys.updates(query),
    queryFn: ({ pageParam, signal }) =>
      apiRequest<ProjectUpdateListItem[]>("projects/get-all-updates", { query: { ...query, PageNumber: pageParam }, signal }),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.meta?.hasNext ? last.meta.currentPage + 1 : undefined),
  });
}

export function useUsers(filters: UserFilters = {}) {
  const query = { PageSize: FULL_PAGE, ...filters };
  return useQuery({
    queryKey: queryKeys.users(query),
    queryFn: ({ signal }) => apiRequest<TeamMember[]>("users/get-all-users", { query, signal }),
    placeholderData: keepPreviousData,
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: queryKeys.user(id),
    queryFn: ({ signal }) => apiRequest<UserDetail>(`users/user-detail/${id}`, { signal }).then((r) => r.data),
    enabled: !!id,
  });
}

export function useValueRealization(filters: ValueFilters = {}) {
  const query = { PageSize: FULL_PAGE, ...filters };
  return useQuery({
    queryKey: queryKeys.value(query),
    queryFn: ({ signal }) => apiRequest<ValueRealization[]>("valuerealization/get-value-realization", { query, signal }),
  });
}

/* --------------------------------------------------------------- Mutations */

export function useCreateProject() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateProjectInput) =>
      apiRequest<Project>("projects/create-project", { method: "POST", json: input }).then((r) => r.data),
    onSuccess: () => {
      for (const key of ["projects", "dashboard", "users", "user"]) client.invalidateQueries({ queryKey: [key] });
    },
  });
}

export function useCreateProjectUpdate(projectId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateProjectUpdateInput) => {
      const form = new FormData();
      const fields: Record<string, string | number | File | undefined> = {
        ProjectId: projectId,
        UpdateType: input.updateType,
        ProjectStatus: input.projectStatus,
        ProgressPercentage: input.progressPercentage,
        Achievement: input.achievement,
        NextStep: input.nextStep,
        Blocker: input.blocker,
        EvidenceAttachmentFile: input.evidence,
        MilestoneName: input.milestoneName,
        MilestoneDate: input.milestoneDate,
        ObjectiveId: input.objectiveId,
        Metric: input.metric,
      };
      for (const [key, value] of Object.entries(fields)) {
        if (value !== undefined && value !== "") form.append(key, value instanceof File ? value : String(value));
      }
      return apiRequest(`projects/create-project-update/${projectId}`, { method: "POST", form }).then((r) => r.data);
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: queryKeys.project(projectId) });
      for (const key of ["projects", "updates", "dashboard", "value", "user", "users"]) client.invalidateQueries({ queryKey: [key] });
    },
  });
}

export function useCreateObjective() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateObjectiveInput) =>
      apiRequest<Objective>("objectives/create-objective", { method: "POST", json: input }).then((r) => r.data),
    onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.objectives }),
  });
}

export function useProfileUser() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: ProfileUserInput) => apiRequest("users/profile-user", { method: "POST", json: input }),
    onSuccess: () => client.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useDeleteUser() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => apiRequest<boolean>(`users/delete-user/${userId}`, { method: "DELETE" }),
    onSuccess: (_data, userId) => {
      client.removeQueries({ queryKey: queryKeys.user(userId) });
      // Drop them from cached team lists now; the refetch below can take a few seconds.
      client.setQueriesData<{ data: TeamMember[]; meta: PageMeta | null }>({ queryKey: ["users"] }, (old) =>
        old ? { ...old, data: old.data.filter((u) => u.id !== userId) } : old,
      );
      client.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
