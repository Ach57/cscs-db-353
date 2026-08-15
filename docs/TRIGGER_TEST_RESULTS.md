```
+---------+---------------------------------------------------+----------+---------+---------+--------------------------------------------------------------------------------------+
| test_id | description                                       | expected | actual  | verdict | trigger_message                                                                      |
+---------+---------------------------------------------------+----------+---------+---------+--------------------------------------------------------------------------------------+
|       1 | ClubMember registered under age 4                 | ERROR    | ERROR   | PASS    | A new club member must be at least 4 years old at registration.                      |
|       2 | ClubMember insert at location already at capacity | ERROR    | ERROR   | PASS    | Location capacity reached: another active club member cannot be added.               |
|       3 | Valid ClubMember insert                           | SUCCESS  | SUCCESS | PASS    | NULL                                                                                 |
|       4 | Personnel overlapping assignment                  | ERROR    | ERROR   | PASS    | Personnel cannot operate at two locations during overlapping periods.                |
|       5 | Personnel non-overlapping assignment              | SUCCESS  | SUCCESS | PASS    | NULL                                                                                 |
|       6 | Family member overlapping assignment              | ERROR    | ERROR   | PASS    | Family member cannot be associated with two locations during overlapping periods.    |
|       7 | Family member non-overlapping assignment          | SUCCESS  | SUCCESS | PASS    | NULL                                                                                 |
|       8 | 1st TeamFormation in a new session                | SUCCESS  | SUCCESS | PASS    | NULL                                                                                 |
|       9 | 2nd TeamFormation in same session                 | SUCCESS  | SUCCESS | PASS    | NULL                                                                                 |
|      10 | 3rd TeamFormation in same session                 | ERROR    | ERROR   | PASS    | A session can contain exactly two team formations; a third formation is not allowed. |
|      11 | Assignment location mismatch                      | ERROR    | ERROR   | PASS    | Club member location does not match the team formation location.                     |
|      12 | Assignment gender mismatch                        | ERROR    | ERROR   | PASS    | Club member gender does not match the team formation category.                       |
|      13 | Valid paid-up major member assignment             | SUCCESS  | SUCCESS | PASS    | NULL                                                                                 |
|      14 | Unpaid membership fee blocks assignment           | ERROR    | ERROR   | PASS    | Club member is not eligible: membership fee for the session year is not fully paid.  |
|      15 | Same-day assignment <3h apart                     | ERROR    | ERROR   | PASS    | Conflicting assignment: same-day formations must be at least 3 hours apart.          |
|      16 | Same-day assignment >=3h apart                    | SUCCESS  | SUCCESS | PASS    | NULL                                                                                 |
|      17 | Minor with no family relation blocks assignment   | ERROR    | ERROR   | PASS    | Minor club member must have a family member relationship active on the session date. |
+---------+---------------------------------------------------+----------+---------+---------+--------------------------------------------------------------------------------------+
+--------+--------+-------+
| passed | failed | total |
+--------+--------+-------+
|     17 |      0 |    17 |
+--------+--------+-------+
```
