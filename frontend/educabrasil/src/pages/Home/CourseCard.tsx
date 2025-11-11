import type { Course } from "../../types/course";

type Props = {
  course: Course;
  enrolled?: boolean;
  onOpen?: (c: Course) => void;
  onEnroll?: (c: Course) => void;
};

export default function CourseCard({ course, enrolled, onOpen, onEnroll }: Props) {
  return (
    <div className="course-card">
      <h3 className="course-title">{course.title}</h3>
      <p className="course-description">{course.description}</p>
      {course.nome_professor && (
        <div className="course-meta">Professor: {course.nome_professor}</div>
      )}
      <div className="course-actions">
        {enrolled ? (
          <>
            <span className="badge">Matriculado</span>
            <button className="button small" onClick={() => onOpen?.(course)}>
              Entrar no curso
            </button>
          </>
        ) : (
          <>
            <button className="button small" onClick={() => onOpen?.(course)}>
              Ver detalhes
            </button>
            <button className="button small secondary" onClick={() => onEnroll?.(course)}>
              Matricular-se
            </button>
          </>
        )}
      </div>
    </div>
  );
}
