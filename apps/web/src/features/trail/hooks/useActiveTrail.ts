import { useQuery } from '@tanstack/react-query';
import { trailService } from '../services/trail.service';

export function useActiveTrail() {
  return useQuery({
    queryKey: ['trail', 'active'],
    queryFn: () => trailService.getActiveTrail(),
  });
}
