export type Course = {
  id: string;
  title: string;
  description: string;
  teacher_id?: string;
  is_published?: boolean;
  created_at?: string;
  nome_professor?: string;
  email_professor?: string;
  porcentagem?: number;
};
