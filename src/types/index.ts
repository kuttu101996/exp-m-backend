// Shared TypeScript types for the entire application
// All fields use snake_case naming convention

export interface user_profile {
  user_id: string;
  user_name: string;
  user_email: string;
  user_phone?: string;
  created_at: Date;
  updated_at: Date;
}

export interface expense_category {
  category_id: string;
  user_id: string;
  category_name: string;
  category_icon?: string;
  category_color?: string;
  is_default: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface expense_sub_category {
  sub_category_id: string;
  category_id: string;
  sub_category_name: string;
  created_at: Date;
  updated_at: Date;
}

export interface user_expense {
  expense_id: string;
  user_id: string;
  category_id: string;
  sub_category_id?: string;
  expense_amount: number;
  expense_description?: string;
  expense_date: Date;
  payment_method?: string;
  created_at: Date;
  updated_at: Date;
}

// API Response types
export interface api_response<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface pagination_meta {
  total_count: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// Analytics types
export interface expense_summary {
  total_amount: number;
  expense_count: number;
  period_start: Date;
  period_end: Date;
}

export interface category_breakdown {
  category_id: string;
  category_name: string;
  total_amount: number;
  expense_count: number;
  percentage: number;
}

export interface analytics_response {
  summary: expense_summary;
  category_breakdown: category_breakdown[];
}

// Request body types
export interface create_category_request {
  user_id: string;
  category_name: string;
  category_icon?: string;
  category_color?: string;
}

export interface create_sub_category_request {
  category_id: string;
  sub_category_name: string;
}

export interface create_expense_request {
  user_id: string;
  category_id: string;
  sub_category_id?: string;
  expense_amount: number;
  expense_description?: string;
  expense_date: string | Date;
  payment_method?: string;
}

export interface update_expense_request {
  category_id?: string;
  sub_category_id?: string;
  expense_amount?: number;
  expense_description?: string;
  expense_date?: string | Date;
  payment_method?: string;
}

// Query parameter types
export interface expense_query_params {
  user_id: string;
  start_date?: string;
  end_date?: string;
  category_id?: string;
  sub_category_id?: string;
  page?: number;
  page_size?: number;
}

export interface analytics_query_params {
  user_id: string;
  start_date: string;
  end_date: string;
  group_by?: 'day' | 'week' | 'month';
}
