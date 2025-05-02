Use of Claude 3.7-thinking with Cursor

**Prompt 1**:
you are a senior front-end engineer with a strong knowledge in react. The front-end for the actual project is on construction. We already have the page created with this url: http://localhost:3000/positions.  Use your brower-tools if needed to understand the page better. What is needed is the following, whenever we click on the button "Ver processo" you need to create the page "position" who should get the exact shape like @front-end-exercise.png . The number of columns depend on the number of steps for this position. 
To help you you have 2 endpoints to use: 
http://localhost:3010/position/1/candidates and http://localhost:3010/position/1/interviewFlow
If you have any question ask me.
Before generating anything, explain me the steps you will perform. If I validate them then you will be allowed to proceed


**Prompt 2**:
that's great, now I want you to take care about the dots for each candidate:
1. there should not be more dots than the candidate has (if he has 3, then only show 3 dots)
2. check @front-end-exercise.png to respect the color and style of the dots, there should be a variation of color, and the color is not the one shown in the picture.

