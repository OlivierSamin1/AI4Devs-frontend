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

**Prompt 3**:
you are a senior frontend developper with strong knowledge in React.
I need to add to my actual page a new feature. 
1. the page is : http://localhost:3000/position/1
2. the feature is : be able to drag and drop candidate cards from one stage to another and updating its stage
3. the technology to use is the natural HTML5 drag and drop
4. The endpoints to use are:
- http://localhost:3010/position/1/interviewFlow
- http://localhost:3010/position/1/candidates 
5. Here are 3 exampes of how to update a candidate stage with a curl command:
-  curl -X PUT http://localhost:3010/candidates/1 -H "Content-Type: application/json" -d '{"applicationId": 1, "currentInterviewStep": 2}'
- curl -X PUT http://localhost:3010/candidates/1 -H "Content-Type: application/json" -d '{"applicationId": 1, "currentInterviewStep": 3}'
- curl -X PUT http://localhost:3010/candidates/2 -H "Content-Type: application/json" -d '{"applicationId": 2, "currentInterviewStep": 3}'
You can see that the applicationId value is the candidate id and that the new stage value is also an id retrieved from the interviewFlow endpoint
The steps you have to perform
1. Check carefully the structure of each endpoint and the structure of the curl command to understand how it works
2. suggest me implementation steps to achieve the new feature
3. wait for my approval to implement it

**Prompt 4**:
It is working fine for the candidate with ID=1 but if i try anothe candidate it returns me this error:
{
    "message": "Request failed with status code 404",
    "name": "AxiosError",
    "stack": "AxiosError: Request failed with status code 404\n    at settle (http://localhost:3000/static/js/bundle.js:93421:12)\n    at XMLHttpRequest.onloadend (http://localhost:3000/static/js/bundle.js:92048:66)\n    at Axios.request (http://localhost:3000/static/js/bundle.js:92547:41)\n    at async updateCandidateStage (http://localhost:3000/static/js/bundle.js:2074:22)\n    at async handleCandidateDrop (http://localhost:3000/static/js/bundle.js:1170:7)",
    "config": {
        "transitional": {
            "silentJSONParsing": true,
            "forcedJSONParsing": true,
            "clarifyTimeoutError": false
        },
        "adapter": [
            "xhr",
            "http",
            "fetch"
        ],
        "transformRequest": [
            null
        ],
        "transformResponse": [
            null
        ],
        "timeout": 0,
        "xsrfCookieName": "XSRF-TOKEN",
        "xsrfHeaderName": "X-XSRF-TOKEN",
        "maxContentLength": -1,
        "maxBodyLength": -1,
        "env": {},
        "headers": {
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json"
        },
        "method": "put",
        "url": "http://localhost:3010/candidates/3",
        "data": "{\"applicationId\":3,\"currentInterviewStep\":2}",
        "allowAbsoluteUrls": true
    },
    "code": "ERR_BAD_REQUEST",
    "status": 404
}

Explain me the issue, then suggest me solutions

**Prompt 5**:
I have now 2 errors when moving a candidate with ID which is not 1:
{
    "message": "Request failed with status code 404",
    "name": "AxiosError",
    "stack": "AxiosError: Request failed with status code 404\n    at settle (http://localhost:3000/static/js/bundle.js:93421:12)\n    at XMLHttpRequest.onloadend (http://localhost:3000/static/js/bundle.js:92048:66)\n    at Axios.request (http://localhost:3000/static/js/bundle.js:92547:41)\n    at async updateCandidateStage (http://localhost:3000/static/js/bundle.js:2074:22)\n    at async handleCandidateDrop (http://localhost:3000/static/js/bundle.js:1170:7)",
    "config": {
        "transitional": {
            "silentJSONParsing": true,
            "forcedJSONParsing": true,
            "clarifyTimeoutError": false
        },
        "adapter": [
            "xhr",
            "http",
            "fetch"
        ],
        "transformRequest": [
            null
        ],
        "transformResponse": [
            null
        ],
        "timeout": 0,
        "xsrfCookieName": "XSRF-TOKEN",
        "xsrfHeaderName": "X-XSRF-TOKEN",
        "maxContentLength": -1,
        "maxBodyLength": -1,
        "env": {},
        "headers": {
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json"
        },
        "method": "put",
        "url": "http://localhost:3010/candidates/4",
        "data": "{\"applicationId\":4,\"currentInterviewStep\":3}",
        "allowAbsoluteUrls": true
    },
    "code": "ERR_BAD_REQUEST",
    "status": 404
}

and 

react refresh:6 Download the React DevTools for a better development experience: https://reactjs.org/link/react-devtools
positionService.js:33 Error updating candidate stage: AxiosError {message: 'Request failed with status code 404', name: 'AxiosError', code: 'ERR_BAD_REQUEST', config: {…}, request: XMLHttpRequest, …}
updateCandidateStage @ positionService.js:33
await in updateCandidateStage
handleCandidateDrop @ Position.jsx:144
handleDrop @ Position.jsx:68
callCallback @ react-dom.development.js:4164
invokeGuardedCallbackDev @ react-dom.development.js:4213
invokeGuardedCallback @ react-dom.development.js:4277
invokeGuardedCallbackAndCatchFirstError @ react-dom.development.js:4291
executeDispatch @ react-dom.development.js:9041
processDispatchQueueItemsInOrder @ react-dom.development.js:9073
processDispatchQueue @ react-dom.development.js:9086
dispatchEventsForPlugins @ react-dom.development.js:9097
(anonymous) @ react-dom.development.js:9288
batchedUpdates$1 @ react-dom.development.js:26179
batchedUpdates @ react-dom.development.js:3991
dispatchEventForPluginEventSystem @ react-dom.development.js:9287
dispatchEventWithEnableCapturePhaseSelectiveHydrationWithoutDiscreteEventReplay @ react-dom.development.js:6465
dispatchEvent @ react-dom.development.js:6457
dispatchDiscreteEvent @ react-dom.development.js:6430
Position.jsx:171 Error moving candidate: AxiosError {message: 'Request failed with status code 404', name: 'AxiosError', code: 'ERR_BAD_REQUEST', config: {…}, request: XMLHttpRequest, …}
handleCandidateDrop @ Position.jsx:171
await in handleCandidateDrop
handleDrop @ Position.jsx:68
callCallback @ react-dom.development.js:4164
invokeGuardedCallbackDev @ react-dom.development.js:4213
invokeGuardedCallback @ react-dom.development.js:4277
invokeGuardedCallbackAndCatchFirstError @ react-dom.development.js:4291
executeDispatch @ react-dom.development.js:9041
processDispatchQueueItemsInOrder @ react-dom.development.js:9073
processDispatchQueue @ react-dom.development.js:9086
dispatchEventsForPlugins @ react-dom.development.js:9097
(anonymous) @ react-dom.development.js:9288
batchedUpdates$1 @ react-dom.development.js:26179
batchedUpdates @ react-dom.development.js:3991
dispatchEventForPluginEventSystem @ react-dom.development.js:9287
dispatchEventWithEnableCapturePhaseSelectiveHydrationWithoutDiscreteEventReplay @ react-dom.development.js:6465
dispatchEvent @ react-dom.development.js:6457
dispatchDiscreteEvent @ react-dom.development.js:6430
positionService.js:33 Error updating candidate stage: AxiosError {message: 'Request failed with status code 404', name: 'AxiosError', code: 'ERR_BAD_REQUEST', config: {…}, request: XMLHttpRequest, …}
updateCandidateStage @ positionService.js:33
await in updateCandidateStage
handleCandidateDrop @ Position.jsx:144
handleDrop @ Position.jsx:68
callCallback @ react-dom.development.js:4164
invokeGuardedCallbackDev @ react-dom.development.js:4213
invokeGuardedCallback @ react-dom.development.js:4277
invokeGuardedCallbackAndCatchFirstError @ react-dom.development.js:4291
executeDispatch @ react-dom.development.js:9041
processDispatchQueueItemsInOrder @ react-dom.development.js:9073
processDispatchQueue @ react-dom.development.js:9086
dispatchEventsForPlugins @ react-dom.development.js:9097
(anonymous) @ react-dom.development.js:9288
batchedUpdates$1 @ react-dom.development.js:26179
batchedUpdates @ react-dom.development.js:3991
dispatchEventForPluginEventSystem @ react-dom.development.js:9287
dispatchEventWithEnableCapturePhaseSelectiveHydrationWithoutDiscreteEventReplay @ react-dom.development.js:6465
dispatchEvent @ react-dom.development.js:6457
dispatchDiscreteEvent @ react-dom.development.js:6430
Position.jsx:171 Error moving candidate: AxiosError {message: 'Request failed with status code 404', name: 'AxiosError', code: 'ERR_BAD_REQUEST', config: {…}, request: XMLHttpRequest, …}
handleCandidateDrop @ Position.jsx:171
await in handleCandidateDrop
handleDrop @ Position.jsx:68
callCallback @ react-dom.development.js:4164
invokeGuardedCallbackDev @ react-dom.development.js:4213
invokeGuardedCallback @ react-dom.development.js:4277
invokeGuardedCallbackAndCatchFirstError @ react-dom.development.js:4291
executeDispatch @ react-dom.development.js:9041
processDispatchQueueItemsInOrder @ react-dom.development.js:9073
processDispatchQueue @ react-dom.development.js:9086
dispatchEventsForPlugins @ react-dom.development.js:9097
(anonymous) @ react-dom.development.js:9288
batchedUpdates$1 @ react-dom.development.js:26179
batchedUpdates @ react-dom.development.js:3991
dispatchEventForPluginEventSystem @ react-dom.development.js:9287
dispatchEventWithEnableCapturePhaseSelectiveHydrationWithoutDiscreteEventReplay @ react-dom.development.js:6465
dispatchEvent @ react-dom.development.js:6457
dispatchDiscreteEvent @ react-dom.development.js:6430

Remember that the applicationId must be the one coming from the endpoint interviewFlow not the candidate id value


**Prompt 6**:
everything is fine. Now I need to make it work also in mobile. So far it is not working

