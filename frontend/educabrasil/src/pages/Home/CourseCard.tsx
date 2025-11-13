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

      {course.nome_professor && (
        <div className="course-meta">Professor: {course.nome_professor}</div>
      )}

      <div className="course-actions">
        {/* Botão principal: entra ou vê detalhes */}
        <button
          className="button small"
          onClick={() => onOpen?.(course)}
        >
          {isEnrolled ? "Entrar no curso" : "Ver detalhes"}
        </button>

        {/* Botão de matrícula / matriculado */}
        {isEnrolled ? (
          <button className="button small enrolled" disabled>
            Matriculado
          </button>
        ) : (
          onEnroll && (
            <button
              className="button small secondary"
              onClick={() => onEnroll(course)}
            >
              Matricular-se
            </button>
          )
        )}
      </div>
    </div>
  );
}
