import assert from "assert";
import { Given, When, Then } from "@cucumber/cucumber";

import { Course, CourseScheduler, Term } from "../../../src/course_scheduler";

Given(
    "a course scheduler with a term limit of {int},",
    function (term_limit: number) {
        this.courseScheduler = new CourseScheduler(term_limit);
    },
);

Given(
    "a course called {string} with {int} units,",
    function (course_name: string, course_units: number) {
        let newCourse = new Course(course_name, course_units);
        this.courseScheduler.add_course(newCourse);
    },
);

Given(
    "course {string} having a prerequisite with course {string},",
    function (
        course_name_needing_prereq: string,
        prerequisite_course_name: string,
    ) {
        this.courseScheduler.add_prerequisite(
            course_name_needing_prereq,
            prerequisite_course_name,
        );
    },
);

When("all courses are scheduled into terms,", function () {
    let scheduledCourses: Array<Term> = this.courseScheduler.schedule();
    this.parsedTerms = scheduledCourses;
});

Then("there should be {int} terms.", function (expected_num_terms: number) {
    let actual_num_terms = this.parsedTerms.length;
    assert.strictEqual(expected_num_terms, actual_num_terms);
});

Then(
    "Term {int} should contain the course {string}.",
    function (expected_term_num: number, expected_course_name: string) {
        let scheduleContainsCourse: boolean =
            this.parsedTerms[expected_term_num - 1].containsCourse(
                expected_course_name,
            );
        assert.strict(
            scheduleContainsCourse,
            "Could not find course in schedule: " + expected_course_name,
        );
    },
);
