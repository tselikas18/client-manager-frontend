export interface Client {
  _id?: string;
  id?: string;
  user_id?: string;
  name: string;
  phone?: string;
  email?: string;
  amount_owed?: number;
  notes?: string;
  created_at?: string | Date;
  updated_at?: string | Date;
}

export interface Supplier {
  _id?: string;
  id?: string;
  user_id?: string;
  name: string;
  phone?: string;
  email?: string;
  amount_owed?: number;
  notes?: string;
  created_at?: string | Date;
  updated_at?: string | Date;
}

export type AuthResult = { success: true } | { success: false; error: string };