import type { Course } from "../../types/course";

type Props = {
  course: Course;
  enrolled?: boolean;
  onOpen?: (c: Course) => void;
  onEnroll?: (c: Course) => void;
};

export default function CourseCard({ course, enrolled, onOpen, onEnroll }: Props) {
  const isEnrolled = !!enrolled;

  return (
    <div className="course-card">
      <h3 className="course-title">{course.title}</h3>
      <p className="course-description">{course.description}</p>

      {/* 🔥 Barra de progresso – só para cursos matriculados */}
      {isEnrolled && typeof course.porcentagem === "number" && (
        <div className="progress-wrapper">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${course.porcentagem}%` }}
            />
          </div>
          <span className="progress-text">
            {course.porcentagem}% concluído
          </span>
        </div>
      )}

      <div className="course-actions">
        {isEnrolled ? (
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
            {onEnroll && (
              <button
                className="button small secondary"
                onClick={() => onEnroll(course)}
              >
                Matricular-se
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
