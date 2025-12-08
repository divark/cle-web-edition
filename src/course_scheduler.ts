export { Course, CourseScheduler, Term };

class Course {
  name: string;
  units: number;

  constructor(name: string, units: number) {
    this.name = name;
    this.units = units;
  }

  /// Returns the name for the given Course.
  get_name(): string {
    return this.name;
  }
}

class Term {
  units_limit: number;
  courses: Array<Course>;

  constructor(units_limit: number) {
    this.units_limit = units_limit;
    this.courses = Array<Course>();
  }

  addCourse(course: Course): void {
    this.courses.push(course);
  }

  /// Returns whether the given course name is found in the term.
  containsCourse(course_name: string): boolean {
    return (
      this.courses.find((course: Course) => course.get_name() == course_name) !=
      undefined
    );
  }
}

class CourseScheduler {
  term_limit: number;

  constructor(term_limit: number) {
    this.term_limit = term_limit;
  }

  schedule(courses: Array<Course>): Array<Term> {
    let termsPopulated = Array<Term>();

    let currentTerm = new Term(this.term_limit);
    courses.forEach((course) => {
      currentTerm.addCourse(course);
    });

    termsPopulated.push(currentTerm);

    return termsPopulated;
  }
}
