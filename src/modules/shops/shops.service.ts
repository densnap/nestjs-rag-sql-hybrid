import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../common/supabase/supabase.service';

@Injectable()
export class ShopsService {
  constructor(private supabaseService: SupabaseService) {
    console.log('✅ Supabase injected');
  }

  async getAllShops() {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('shops')
      .select('*');
    
    console.log('DATA:', data);
    console.log('ERROR:', error);


    if (error) throw error;
    return data;
  }

  async updateShop(shop_id: number, updates: any) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('shops')
      .update(updates)
      .eq('shop_id', shop_id);

    if (error) throw error;
    return data;
  }
}