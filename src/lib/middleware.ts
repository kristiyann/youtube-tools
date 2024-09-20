import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

type ServerAction<T extends unknown[], R> = (...args: T) => Promise<R>;

export function withAuth<T extends unknown[], R>(action: ServerAction<T, R>): ServerAction<T, R> {
  return async (...args: T): Promise<R> => {
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new Error('Unauthorized: No session found');
    }
    
    return action(...args);
  };
}