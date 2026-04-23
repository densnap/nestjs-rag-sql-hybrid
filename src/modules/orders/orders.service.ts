import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../common/supabase/supabase.service';

@Injectable()
export class OrdersService {
  constructor(private supabaseService: SupabaseService) {}

  async getOrdersByShop(shop_id: number) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('orders')
      .select('*')
      .eq('shop_id', shop_id);

    if (error) throw error;
    return data;
  }
}