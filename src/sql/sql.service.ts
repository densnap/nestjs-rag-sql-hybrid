import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../common/supabase/supabase.service';

@Injectable()
export class SqlService {
  constructor(private supabase: SupabaseService) {}

  async execute(query: string) {
    if (query.toLowerCase().includes('shop')) {
      return this.supabase.getClient().from('shops').select('*');
    }

    if (query.toLowerCase().includes('order')) {
      return this.supabase.getClient().from('orders').select('*');
    }

    return { data: [], error: null };
  }
}