export { Course, CourseScheduler, Term };

class Course {
  name: string;
  units: number;

  constructor(name: string, units: number) {
    this.name = name;
    this.units = units;
  }

  /**
   *
   * @returns The name for the Course.
   */
  get_name(): string {
    return this.name;
  }

  /**
   *
   * @returns The number of units for the Course.
   */
  get_units(): number {
    return this.units;
  }
}

class Term {
  courses: Array<Course>;

  units: number;
  units_limit: number;

  constructor(units_limit: number) {
    this.courses = Array<Course>();

    this.units = 0;
    this.units_limit = units_limit;
  }

  /**
   *
   * @returns How many units are being used from the currently added courses.
   */
  get_units(): number {
    return this.units;
  }

  /**
   *
   * @returns The limit of course units until this term is full.
   */
  get_unit_limit(): number {
    return this.units_limit;
  }

  /**
   * Returns whether the course was able to fit into the term or not.
   * @param course
   */
  addCourse(course: Course): boolean {
    let fitsInTerm =
      course.get_units() + this.get_units() <= this.get_unit_limit();
    if (!fitsInTerm) {
      return false;
    }

    this.courses.push(course);
    this.units += course.get_units();

    return true;
  }

  /**
   * Returns whether the given course name is found in the term.
   * @param course_name
   * @returns
   */
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

    let coursesVisited = new Set<string>();
    while (coursesVisited.size < courses.length) {
      let currentTerm = new Term(this.term_limit);

      for (let i = 0; i < courses.length; i++) {
        let currentCourse = courses[i];
        let currentCourseName = currentCourse.get_name();
        if (coursesVisited.has(currentCourseName)) {
          continue;
        }

        let courseFitsInTerm = currentTerm.addCourse(currentCourse);
        if (!courseFitsInTerm) {
          continue;
        }

        coursesVisited.add(currentCourseName);
      }

      termsPopulated.push(currentTerm);
    }

    return termsPopulated;
  }
}
