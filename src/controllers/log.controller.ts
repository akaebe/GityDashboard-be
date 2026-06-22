import { Request, Response } from 'express';
import { LogService } from '../services/log.service';
import { ILogQueryParams } from '../types';

export class LogController {
  private logService = new LogService();

  bulkUpload = async (req: Request, res: Response): Promise<void> => {
    try {
      const records = req.body;
      const result = await this.logService.processBulkUpload(records);
      res.status(201).json({
        success: true,
        message: `${result.length} audit logs successfully processed.`,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  getLogs = async (req: Request<{}, {}, {}, ILogQueryParams>, res: Response): Promise<void> => {
    try {
      const results = await this.logService.queryLogs(req.query);
      res.status(200).json({ success: true, ...results });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  getStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const severityFilter = req.query.severityFilter as string;
      const stats = await this.logService.getGlobalStats(severityFilter);
      res.status(200).json({ success: true, ...stats });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
}