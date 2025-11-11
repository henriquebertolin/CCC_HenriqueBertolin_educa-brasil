import type { Course } from "../../types/course";
import CourseCard from "./CourseCard";

type Props = {
  title: string;
  subtitle?: string;
  courses: Course[];
  enrolledSet?: Set<string>; // ids matriculados para marcar na “todos”
  emptyMessage: string;
  onOpen?: (c: Course) => void;
  onEnroll?: (c: Course) => void;
};

export default function CourseSection({
  title, subtitle, courses, enrolledSet, emptyMessage, onOpen, onEnroll
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
          {courses.map((c) => (
            <CourseCard
              key={c.id}
              course={c}
              enrolled={enrolledSet?.has(c.id)}
              onOpen={onOpen}
              onEnroll={onEnroll}
            />
          ))}
        </div>
      )}
    </section>
  );
}
