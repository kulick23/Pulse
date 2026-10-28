/**
 * Описание одной задачи в заказе
 */
export interface Task {
  name: string;
  description: string;
  is_done: boolean;
  is_read: boolean;
}

/**
 * Фильтры для получения запросов
 */
export interface GetRequestsFilters {
  user_id: number;
  ascending: boolean;
  is_closed: boolean;
  created_before: string; // ISO-строка, например new Date().toISOString()
  created_after: string; // ISO-строка
  with_description: boolean;
}

/**
 * Параметры для создания заказа
 */
export interface CreateOrderRequest {
  request_id: number; // <— вместо user_id
  user_id: number;
  name: string;
  tasks: Task[];
  product_id: number;
  quantity: number;
  delivery_address: string;
  comment: string;
  deadline_start: string; // ISO-строка, например new Date().toISOString()
  deadline_end: string; // ISO-строка
}

/**
 * Как сервер возвращает созданный заказ
 */
export interface CreateOrderResponse {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  delivery_address: string;
  comment: string;
  status: string;
  created_at: string;
}

/**
 * Ответ от API по одной заявке
 */
export interface OrderRequestResponse {
  id: number;
  user_id: number;
  description: string;
  link: string;
  is_closed: boolean;
  created_at: string; // ISO-строка
}

/**
 * Ответ от сервера для одного заказа
 */
export interface OrderInfo {
  id: number;
  user_id: number;
  name: string;
  description: string;
  deadline_start: string;
  deadline_end: string;
  is_payed: boolean;
  is_done: boolean;
  payment_cheque?: string;
  tasks: Task[];
}
