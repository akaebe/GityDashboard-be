import { AuditLog, IAuditLogDocument } from '../models/log.model';
import { IAuditLog } from '../types';

export class LogRepository {
  async insertMany(logs: IAuditLog[]): Promise<IAuditLogDocument[]> {
    // Mongoose insertMany is optimized for bulk inserts
    return await AuditLog.insertMany(logs);
  }

  async findWithFilters(
    filter: any,
    sortOptions: any,
    skip: number,
    limit: number
  ): Promise<{ data: IAuditLogDocument[]; total: number }> {
    const [total, data] = await Promise.all([
    AuditLog.countDocuments(filter),
    AuditLog.find(filter)
    .select('action actor role resource resourceType ipAddress region severity status timestamp')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean()
  ]);
    return { data, total };
  }
}