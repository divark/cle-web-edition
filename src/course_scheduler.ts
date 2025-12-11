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
            this.courses.find(
                (course: Course) => course.get_name() == course_name,
            ) != undefined
        );
    }
}

class DirectedGraph {
    edges: Map<number, Set<number>>;

    constructor() {
        this.edges = new Map<number, Set<number>>();
    }

    /**
     *
     * @param node_id The Node ID to check.
     * @returns whether the given Node was found in the graph.
     */
    contains(node_id: number): boolean {
        return this.edges.has(node_id);
    }

    /**
     * Adds a directed edge from Node 1 to Node 2.
     * @param node_1_id Node 1's ID.
     * @param node_2_id Node 2's ID that Node 1 will point to.
     */
    add_edge(node_1_id: number, node_2_id: number): void {
        if (!this.edges.has(node_1_id)) {
            this.edges.set(node_1_id, new Set<number>());
        }

        this.edges.get(node_1_id)?.add(node_2_id);
    }

    /**
     * Removes the given Node from all edges in the Directed Graph.
     * @param node_id The node to be removed from all edges.
     */
    remove(node_id: number): void {
        let node_edges_modified = Array<number>();
        this.edges.forEach((node_1_connections, node_1_id) => {
            let node_edge_deleted = node_1_connections.delete(node_id);
            if (!node_edge_deleted) {
                return;
            }

            node_edges_modified.push(node_1_id);
        });

        node_edges_modified.forEach((modified_node_id) => {
            if (this.edges.get(modified_node_id)?.size == 0) {
                this.edges.delete(modified_node_id);
            }
        });
    }
}

class CourseScheduler {
    courses: Array<Course>;
    term_limit: number;

    node_ids: Map<string, number>;
    prerequisite_graph: DirectedGraph;

    constructor(term_limit: number) {
        this.courses = Array<Course>();
        this.term_limit = term_limit;

        this.node_ids = new Map<string, number>();
        this.prerequisite_graph = new DirectedGraph();
    }

    /**
     * Records some Course into the scheduler.
     * @param course a Course populated externally.
     */
    add_course(course: Course): void {
        this.courses.push(course);

        this.node_ids.set(course.get_name(), this.courses.length - 1);
    }

    /**
     *
     * @param course_name the name of the Course to look up.
     * @returns An index for the found course by name, or throws an Error otherwise.
     */
    get_node_id(course_name: string): number {
        let found_node_id = this.node_ids.get(course_name);
        if (typeof found_node_id !== "number") {
            throw new Error("get_node_id: Node not found.");
        }

        return found_node_id;
    }

    /**
     * Records a prerequisite for some given Course.
     * @param course_needing_prereq_name A Course name for the Course needing the prerequisite.
     * @param prereq_course_name A Course name for the prerequisite course.
     */
    add_prerequisite(
        course_needing_prereq_name: string,
        prereq_course_name: string,
    ): void {
        let course_needing_prereq_node_id = this.get_node_id(
            course_needing_prereq_name,
        );
        let prereq_course_node_id = this.get_node_id(prereq_course_name);
        this.prerequisite_graph.add_edge(
            course_needing_prereq_node_id,
            prereq_course_node_id,
        );
    }

    /**
     *
     * @returns a collection of Courses that have no prerequisites.
     */
    get_courses_with_no_prerequisites(
        new_prerequisite_graph: DirectedGraph,
    ): Array<Course> {
        let courses_with_no_prerequisites_found = this.courses.filter(
            (currentCourse) => {
                let currentCourseName = currentCourse.get_name();
                let currentCourseID = this.get_node_id(currentCourseName);

                return !new_prerequisite_graph.contains(currentCourseID);
            },
        );

        return courses_with_no_prerequisites_found;
    }

    /**
     * Removes all prerequisites from the prerequisites graph, if they exist.
     * @param prerequisites_to_remove A list of Course names to remove as prerequisites.
     * @param new_prerequisite_graph A Directed Graph representing Course prerequisites.
     */
    remove_prerequisites(
        prerequisites_to_remove: Array<string>,
        new_prerequisite_graph: DirectedGraph,
    ): void {
        prerequisites_to_remove.forEach((course_name) => {
            try {
                let course_id = this.get_node_id(course_name);
                new_prerequisite_graph.remove(course_id);
            } catch (e) {
                return;
            }
        });
    }

    /**
     *
     * @returns A list of Terms populated from the recorded Courses.
     */
    schedule(): Array<Term> {
        let termsPopulated = Array<Term>();

        let coursesVisited = new Set<string>();
        let new_prerequisite_graph: DirectedGraph = this.prerequisite_graph;

        while (coursesVisited.size < this.courses.length) {
            let currentTerm = new Term(this.term_limit);

            let courses_with_no_prerequisites =
                this.get_courses_with_no_prerequisites(new_prerequisite_graph);
            let prerequisites_to_remove = Array<string>();
            courses_with_no_prerequisites.forEach((currentCourse) => {
                let currentCourseName = currentCourse.get_name();
                if (coursesVisited.has(currentCourseName)) {
                    return;
                }

                let courseFitsInTerm = currentTerm.addCourse(currentCourse);
                if (!courseFitsInTerm) {
                    return;
                }

                coursesVisited.add(currentCourseName);
                prerequisites_to_remove.push(currentCourseName);
            });

            termsPopulated.push(currentTerm);

            this.remove_prerequisites(
                prerequisites_to_remove,
                new_prerequisite_graph,
            );
        }

        return termsPopulated;
    }
}
