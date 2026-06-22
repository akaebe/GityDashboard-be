import { LogRepository } from '../repositories/log.repository';
import { IAuditLog, ILogQueryParams } from '../types';

export class LogService {
  private logRepository = new LogRepository();

  async processBulkUpload(logs: IAuditLog[]) {
    if (!Array.isArray(logs) || logs.length === 0) {
      throw new Error('Invalid payload. Logs must be a non-empty array.');
    }
    return await this.logRepository.insertMany(logs);
  }

  async queryLogs(params: ILogQueryParams) {
    const page = parseInt(params.page || '1', 10);
    const limit = parseInt(params.limit || '10', 10);
    const skip = (page - 1) * limit;

    const filter: any = {};

    // Exact matches for filtering
    if (params.severity) filter.severity = params.severity;
    if (params.status) filter.status = params.status;
    if (params.region) filter.region = params.region;

    // Server-side Text Search or Partial Match
    if (params.search) {
      filter.$or = [
        { action: { $regex: params.search, $options: 'i' } },
        { actor: { $regex: params.search, $options: 'i' } }
      ];
    }

    // Server-side sorting
    const sortBy = params.sortBy || 'timestamp';
    const sortOrder = params.sortOrder === 'asc' ? 1 : -1;
    const sortOptions = { [sortBy]: sortOrder };

    const { data, total } = await this.logRepository.findWithFilters(filter, sortOptions, skip, limit);

    return {
      metadata: {
        totalRecords: total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        limit
      },
      data
    };
  }
}