import { AuditLog, IAuditLogDocument } from '../models/log.model';
import { IAuditLog } from '../types';

export class LogRepository {
  async insertMany(logs: IAuditLog[]): Promise<IAuditLogDocument[]> {
    // Mongoose insertMany is optimized for bulk inserts
    return await AuditLog.insertMany(logs);
  }

  async getGlobalStats(filter: any): Promise<{ total: number; resolved: number; unresolved: number }> {
    const stats = await AuditLog.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          resolved: {
            $sum: { $cond: [{ $eq: ["$status", "Resolved"] }, 1, 0] }
          },
          unresolved: {
            $sum: { $cond: [{ $eq: ["$status", "Unresolved"] }, 1, 0] }
          }
        }
      }
    ]);

    if (stats.length === 0) {
      return { total: 0, resolved: 0, unresolved: 0 };
    }

    return {
      total: stats[0].total,
      resolved: stats[0].resolved,
      unresolved: stats[0].unresolved
    };
  }

  async findWithFilters(
    filter: any,
    sortOptions: any,
    skip: number,
    limit: number
  ): Promise<{ data: IAuditLogDocument[]; total: number }> {
    // FIXED: The destructuring array matches the execution order below perfectly now
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