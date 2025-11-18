import type { Course } from "../../types/course";
import CourseCard from "./CourseCard";

type Props = {
  title: string;
  subtitle?: string;
  courses: Course[];
  enrolledSet?: Set<string>;
  emptyMessage: string;
  onOpen?: (c: Course) => void;
  onEnroll?: (c: Course) => void;
};

export default function CourseSection({
  title,
  subtitle,
  courses,
  enrolledSet,
  emptyMessage,
  onOpen,
  onEnroll
}: Props) {
  return (
    <section className="courses-section">
      <div className="courses-header">
        <h2 className="courses-title">{title}</h2>
        {subtitle && <span className="courses-subtitle">{subtitle}</span>}
      </div>

      {courses.length === 0 ? (
        <p className="courses-subtitle">{emptyMessage}</p>
      ) : (
        <div className="course-grid">
          {courses.map((c) => {
            const isEnrolled = enrolledSet?.has(c.id) ?? false;

            return (
              <CourseCard
                key={c.id}
                course={c}
                enrolled={isEnrolled}
                onOpen={onOpen}
                // só permite "Matricular-se" se ainda NÃO estiver matriculado
                onEnroll={!isEnrolled ? onEnroll : undefined}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
