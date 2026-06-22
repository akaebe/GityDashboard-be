import { Schema, model, Document } from 'mongoose';
import { IAuditLog } from '../types';

export interface IAuditLogDocument extends IAuditLog, Document {}

const AuditLogSchema = new Schema<IAuditLogDocument>(
  {
    action: { type: String, required: true, index: true },
    actor: { type: String, required: true, index: true },
    role: { type: String, required: true },
    resource: { type: String, required: true },
    resourceType: { type: String, required: true },
    ipAddress: { type: String, required: true },
    region: { type: String, required: true, index: true },
    severity: { type: String, required: true, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], index: true },
    status: { type: String, required: true, enum: ['Resolved', 'Unresolved'], index: true },
    timestamp: { type: Date, required: true, index: true },
  },
  {
    timestamps: true, 
  }
);

// Compound text index for text search capability across action and actor fields
AuditLogSchema.index({ action: 'text', actor: 'text' });

export const AuditLog = model<IAuditLogDocument>('AuditLog', AuditLogSchema);