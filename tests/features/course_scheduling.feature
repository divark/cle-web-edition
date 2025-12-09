Feature: Courses can be scheduled
  Scenario: Courses without prerequisites or concurrency requirements are added.
    Given a course scheduler with a term limit of 15,
    And a course called 'CMPS 101' with 5 units,
    And a course called 'ANTHRO 1' with 3 units,
    And a course called 'ECON 1A' with 5 units,
    When all courses are scheduled into terms,
    Then Term 1 should contain the course 'CMPS 101'.
    And Term 1 should contain the course 'ANTHRO 1'.
    And Term 1 should contain the course 'ECON 1A'.

  Scenario: Multiple terms are created when their unit limits are exceeded.
    Given a course scheduler with a term limit of 8,
    And a course called 'CMPS 101' with 5 units,
    And a course called 'ANTHRO 1' with 3 units,
    And a course called 'ECON 1A' with 5 units,
    When all courses are scheduled into terms,
    Then there should be 2 terms.
    And Term 1 should contain the course 'CMPS 101'.
    And Term 1 should contain the course 'ANTHRO 1'.
    And Term 2 should contain the course 'ECON 1A'.
