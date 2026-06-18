export interface AuditLogResponse {
  id: number;
  action: string;
  entityName: string;
  entityId: number;
  performedBy: string;
  details: string;
  timestamp: string;
}