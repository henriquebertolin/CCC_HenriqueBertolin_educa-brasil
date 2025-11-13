export type Lesson = {
  id: string;
  id_curso: string;
  titulo: string;
  descricao: string;
  is_video: boolean;
  position: number;
  is_published: boolean;
  estimated_sec: number;
  video_url: string | null;
  material_url: string | null;
  material_text: string | null;
};
