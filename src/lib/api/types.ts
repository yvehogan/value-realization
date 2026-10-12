// Types for the Nexus API (https://www.nexus-api.somee.com/swagger). Keep in sync with the Swagger spec.

/** Every endpoint wraps its payload in this envelope. */
export type BaseResponse<T> = {
  isSuccess: boolean;
  responseCode: string | null;
  responseMessage: string | null;
  responseData: T;
  metaData: PageMeta | null;
};

export type PageMeta = {
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  /** Only on get-all-users */
  categoryCounts?: Record<"all" | "engineering" | "design" | "programs" | "others" | "unassigned", number>;
};

/** Validation errors arrive in `responseData` when `isSuccess` is false. */
export type FieldError = { field: string; errorMessage: string };

export type ProjectStatus = "AtRisk" | "Completed" | "NotStarted" | "OnHold" | "OnTrack";
export type Priority = "High" | "Medium" | "Low";
export type UpdateType = "ProgressUpdate" | "Milestone" | "ValueMetric";
export type Period = "Weekly" | "Monthly" | "Quarterly" | "Annually";
export type TeamCategory = "Design" | "Engineering" | "Others" | "Programs";
export type AccessRole = "Admin" | "SuperAdmin" | "User";
export type TeamRole =
  | "BackendEngineer"
  | "DesignLead"
  | "EngineeringLead"
  | "FrontendEngineer"
  | "HeadOfInnovation"
  | "LabManager"
  | "MobileEngineer"
  | "ProductDesigner"
  | "ProductManager"
  | "ProgramAnalyst"
  | "QAEngineer"
  | "RnDAnalyst"
  | "ScrumMaster"
  | "VentureAnalyst";

/* -------------------------------------------------------------------- Auth */

export type LoginModel = {
  email: string;
  fullName: string | null;
  staffID: string | null;
  teamRole: TeamRole | null;
  teamRoleName: string | null;
  category: TeamCategory | null;
  accessToken: string | null;
  refreshToken: string | null;
  roles: string[];
  expiry: string;
};

/* --------------------------------------------------------------- Dashboard */

export type DashboardMetric = { current: number; previous: number; change: number };

export type DashboardProjectType = {
  projectTypeId: string;
  name: string | null;
  projectCount: number;
  activeProjectCount: number;
  averageProgress: number;
};

export type DashboardUpdate = {
  updateId: string;
  projectId: string;
  projectName: string | null;
  authorId: string | null;
  authorName: string | null;
  authorInitials: string | null;
  updateType: UpdateType;
  summary: string | null;
  objectiveName: string | null;
  createdAtUtc: string;
};

export type Dashboard = {
  period: Period;
  periodStartUtc: string;
  activeProjects: DashboardMetric;
  objectivesProgress: DashboardMetric;
  projectsAtRisk: DashboardMetric;
  projectsNeedingAttention: number;
  projectTypes: DashboardProjectType[];
  recentUpdates: DashboardUpdate[];
};

/* -------------------------------------------------------------- Objectives */

export type Objective = {
  id: string;
  createdAtUtc: string;
  modifiedAtUtc: string | null;
  name: string | null;
  description: string | null;
  isActive: boolean;
};

export type CreateObjectiveInput = { name: string; description?: string };

/* ---------------------------------------------------------------- Projects */

export type AssignedUser = {
  id: string;
  fullName: string | null;
  email: string | null;
  department: string | null;
  initials: string | null;
};

export type ProjectType = { id: string; name: string | null };

export type ProjectListItem = {
  id: string;
  createdAtUtc: string;
  modifiedAtUtc: string | null;
  name: string | null;
  description: string | null;
  projectTypeId: string;
  projectTypeName: string | null;
  status: ProjectStatus;
  priority: Priority;
  progressPercentage: number;
  lastUpdatedAtUtc: string;
  assignedUsers: AssignedUser[];
};

/** An update as it appears inside a project's detail. */
export type ProjectUpdateFeedItem = {
  id: string;
  createdAtUtc: string;
  modifiedAtUtc: string | null;
  updateType: UpdateType;
  assignedUsers: AssignedUser[];
  updatedByUserId: string | null;
  updatedByName: string | null;
  updatedByInitials: string | null;
  projectStatus: ProjectStatus;
  progressPercentage: number | null;
  achievement: string | null;
  nextStep: string | null;
  blocker: string | null;
  evidenceAttachmentUrl: string | null;
  milestoneName: string | null;
  milestoneDate: string | null;
  objectiveId: string | null;
  objectiveName: string | null;
  metric: string | null;
};

export type ProjectDetail = ProjectListItem & {
  startDate: string;
  targetDate: string;
  updates: ProjectUpdateFeedItem[];
  milestones: ProjectUpdateFeedItem[];
  value: ProjectUpdateFeedItem[];
};

export type Project = {
  id: string;
  name: string | null;
  description: string | null;
  projectTypeId: string;
  status: ProjectStatus;
  priority: Priority;
  startDate: string;
  targetDate: string;
  assignedUserIds: string[];
};

export type CreateProjectInput = {
  name: string;
  description?: string;
  projectTypeId: string;
  priority: Priority;
  /** yyyy-mm-dd */
  startDate: string;
  /** yyyy-mm-dd */
  targetDate: string;
  assignedUserIds: string[];
};

export type ProjectFilters = {
  Year?: number;
  ProjectTypeId?: string;
  AssignedUserId?: string;
  Status?: ProjectStatus;
  PageNumber?: number;
  PageSize?: number;
  SearchKey?: string;
};

/** An update in the cross-project feed. */
export type ProjectUpdateListItem = Omit<ProjectUpdateFeedItem, "assignedUsers"> & {
  projectId: string;
  projectName: string | null;
  projectTypeId: string;
  projectTypeName: string | null;
};

export type UpdateFilters = {
  Year?: number;
  ProjectId?: string;
  ProjectTypeId?: string;
  UpdateType?: UpdateType;
  PageNumber?: number;
  PageSize?: number;
  SearchKey?: string;
};

/** Fields for create-project-update; sent as multipart form data. */
export type CreateProjectUpdateInput = {
  updateType: UpdateType;
  projectStatus?: ProjectStatus;
  progressPercentage?: number;
  achievement?: string;
  nextStep?: string;
  blocker?: string;
  evidence?: File;
  milestoneName?: string;
  /** yyyy-mm-dd */
  milestoneDate?: string;
  objectiveId?: string;
  metric?: string;
};

/* ------------------------------------------------------------------- Users */

export type TeamMemberProject = { id: string; name: string | null; status: ProjectStatus };

export type TeamMember = {
  id: string;
  fullName: string | null;
  email: string | null;
  department: string | null;
  initials: string | null;
  teamRole: TeamRole | null;
  teamRoleName: string | null;
  category: TeamCategory | null;
  activeProjectCount: number;
  activeProjects: TeamMemberProject[];
};

export type UserFilters = {
  Department?: string;
  TeamRole?: TeamRole;
  Category?: TeamCategory;
  PageNumber?: number;
  PageSize?: number;
  SearchKey?: string;
};

export type UserDetail = {
  id: string;
  fullName: string | null;
  email: string | null;
  department: string | null;
  initials: string | null;
  teamRole: TeamRole | null;
  teamRoleName: string | null;
  category: TeamCategory | null;
  stats: {
    activeInitiatives: number;
    onTrack: number;
    completed: number;
    updatesSubmitted: number;
    objectivesContributed: number;
  };
  currentResponsibilities: {
    projectId: string;
    projectName: string | null;
    projectTypeName: string | null;
    responsibility: string | null;
    progressPercentage: number;
    status: ProjectStatus;
  }[];
  recentActivity: {
    updateId: string;
    projectId: string;
    projectName: string | null;
    updateType: UpdateType;
    summary: string | null;
    projectStatus: ProjectStatus;
    progressPercentage: number | null;
    objectiveId: string | null;
    objectiveName: string | null;
    createdAtUtc: string;
  }[];
};

export type ProfileUserInput = {
  email: string;
  fullName: string;
  teamRole: TeamRole;
  department?: string;
  staffID?: string;
  role: AccessRole;
  isActive?: boolean;
};

/* ------------------------------------------------------- Value realization */

export type ValueRealization = {
  id: string;
  createdAtUtc: string;
  modifiedAtUtc: string | null;
  value: string | null;
  projectId: string;
  projectName: string | null;
  objectiveId: string | null;
  objectiveName: string | null;
  responsiblePersons: AssignedUser[];
};

export type ValueFilters = {
  Year?: number;
  ProjectId?: string;
  ObjectiveId?: string;
  PageNumber?: number;
  PageSize?: number;
  SearchKey?: string;
};
