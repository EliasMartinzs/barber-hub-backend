import { Request } from 'express';
import type { SessionType } from 'src/auth/types/session.interface';

export interface AuthRequest extends Request {
  session: SessionType | null;
}
