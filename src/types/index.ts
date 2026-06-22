export interface IAuditLog {
  action: string;
  actor: string;
  role: string;
  resource: string;
  resourceType: 'USER' | string; // Can be expanded
  ipAddress: string;
  region: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'Resolved' | 'Unresolved';
  timestamp: Date;
}

export interface ILogQueryParams {
  page?: string;
  limit?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  severity?: string;
  status?: string;
  region?: string;
  action?: string;
  role?: string;
}