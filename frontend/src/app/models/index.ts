export interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  products?: Product[];
  products_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  category_id: number;
  user_id?: number;
  category?: Category;
  user?: User;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
