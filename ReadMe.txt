Exam 2
Created by: Alexandra Arbia
URL: arbia.onrender.com/exam

This application (assignment checker) allows students to check their assignments and an administrator to add
students’ assignments.

When users log into the non-administrative account, they should be redirected to the page with their
assignment(s) correctly displayed.

When "admin" logs in, (s)he is redirected to the "admin" action. The administrative subsystem will
allow administrators to add new assignments for students.

Admin accounts are able to add an assignment to student users. If the user doesn't exist a "User does not exist" message is displayed. Otherwise, a "Created assignment successfully!" is displayed.

Admin accounts are able to add new users. Must enter a username, password, and select "student" or "admin". If the username is taken a "User exists" message is displayed, otherwise "We created your account successfully!" is displayed.

Both admins and students are able to change their own passwords once logged in. User must enter current password, new password, and confirm new password. If the current password entered is incorrect, "Current password does not match" is display, if the new password and new password confirmation don't match "The two passowrds you entered are not the same" is displayed. Otherwise, "You successfully changed password!" is displayed.

Sample users:
(admin) username: yoda , password: hello
(student) usernme: janedoe , password: hello
(admin) username: cat , password: hello
(student) username: vin , password: hello