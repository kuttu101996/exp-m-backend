// Shared TypeScript types for the entire application
// All fields use snake_case naming convention

// Category type enum
export type category_type = 'income' | 'expense';

// Income source type enum
// export type income_source_type = 'salary' | 'freelance' | 'investment' | 'gift' | 'refund' | 'other';

export interface user_profile {
  user_id: string;
  user_name: string;
  user_email: string;
  user_phone?: string;
  google_id?: string;
  profile_picture?: string;
  auth_provider?: 'google' | 'email';
  is_first_login?: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface expense_category {
  category_id: string;
  user_id: string;
  category_name: string;
  category_icon?: string;
  category_color?: string;
  category_type: category_type;
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

export interface user_income {
  income_id: string;
  user_id: string;
  category_id: string;
  income_amount: number;
  income_description?: string;
  income_date: Date;
  // source_type?: income_source_type;
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
  category_type?: category_type;
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

// Income request types
export interface create_income_request {
  user_id: string;
  category_id: string;
  income_amount: number;
  income_description?: string;
  income_date: string | Date;
  // source_type?: income_source_type;
}

export interface update_income_request {
  category_id?: string;
  income_amount?: number;
  income_description?: string;
  income_date?: string | Date;
  // source_type?: income_source_type;
}

export interface income_query_params {
  user_id: string;
  start_date?: string;
  end_date?: string;
  category_id?: string;
  // source_type?: income_source_type;
  page?: number;
  page_size?: number;
}
