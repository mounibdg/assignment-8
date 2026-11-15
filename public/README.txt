Assignment 8 - Web Programming

This is a simple Node.js and Express 5 backend server for a study programme. It serves a basic HTML/CSS/JS page and has a few routes that return text, JSON, redirects, and 404 errors.

How to install and run

1. Install packages:
npm install

2. Run the server:
npm start

Or run in dev mode with auto restart:
npm run dev

Then open http://localhost:3000 in the browser.

File organization

- server.js: Express server, middlewares, routes, and 404 handler
- public/index.html: Main page with buttons to test the API
- public/styles.css: Styling for the page
- public/app.js: JavaScript using fetch() to call the routes
- package.json: Project setup, scripts, and Express dependency
- package-lock.json: Locked dependency versions
- .gitignore: Ignores node_modules/ and .env
- README.md: Project notes, curl tests, and answers

Middleware order and request counter

I put the request logger and request counter middlewares at the very top of server.js before express.static and all the routes. Express runs things from top to bottom, so putting them first makes sure every request passes through them before a route sends a response.

Because the counter is at the top, it counts every single request that hits the server, including GET /, static files like /styles.css and /app.js, API routes, redirects, and 404 pages.

Curl testing evidence

1. GET /api/courses (200 JSON)

HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json;charset=utf-8
Content-Length: 204
ETag: W/"cc-NPOZqvlcccB/l3wxkGh6iEqftKc"
Date: Sun, 15 Nov 2026 11:14:39GMT
Connection: keep-alive
Keep-Alive: timeout=5

[{"id":"CS101","title":"Introduction to web programming","credits":6},{"id":"CS202","title":"Backend architecture & APIs","credits":6},{"id":"CS305","title":"Modern Javacript & async System","credits":5}]

2. POST /api/subscribe (201)

HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json;charset=utf-8
Content-Length: 19
ETag: W/"13-oWAPIqDXuocNexKhPYW9ayyk98c"
Date: Sun, 15 Nov 2026 11:14:39GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"subscribed":true}

3. GET /api/admin (403)

HTTP/1.1 403 Forbidden
X-Powered-By: Express
Content-Type: application/json;charset=utf-8
Content-Length: 21
ETag: W/"15-TLNzmZqKxaTuFdX/dVWWPBu44/c"
Date: Sun, 15 Nov 2026 11:14:39GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"error":"Forbidden"}

4. GET /welcome (302 Redirect)

HTTP/1.1 302 Found
X-Powered-By: Express
Location: /hello
Vary: Accept
Content-Type: text/plain; charset=utf-8
Content-Length: 28
Date: Sun, 15 Nov 2026 11:14:39GMT
Connection: keep-alive
Keep-Alive: timeout=5

Found. Redirecting to /hello

5. GET /api/unknown (404 API)

HTTP/1.1 404 Not Found
X-Powered-By: Express
Content-Type: application/json;charset=utf-8
Content-Length: 21
ETag: W/"15-bm7tJgu8FHlq5QU+Y6gDxOGPfRc"
Date: Sun, 15 Nov 2026 11:14:39GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"error":"Not found"}

6. GET /unknown-page (404 Non-API)

HTTP/1.1 404 Not Found
X-Powered-By: Express
Content-Type: text/plain; charset=utf-8
Content-Length: 20
ETag: W/"14-uqvetqrE8oeY4r2Xn8/CTahXnYE"
Date: Sun, 15 Nov 2026 11:14:39GMT
Connection: keep-alive
Keep-Alive: timeout=5

404 - Page not found

Reasoning questions

1. Route order: When I moved the 404 fallback to the top of server.js, every route I visited (even / and /api/courses) returned 404 Not Found. This happened because Express checks routes from top to bottom and stops at the first one that matches and sends a response.
2. Middleware: When I removed next() from the logger middleware, the server printed the log in the terminal, but the browser tab just kept loading forever until it timed out. Without next(), Express never moved on to the actual route handlers so no response was ever sent back.
3. Status codes: POST /api/subscribe returns 201 instead of 200 because a new subscription resource was created, which is more accurate than a generic OK. A missing page returns 404 instead of 200 with an error message so the browser and other tools know the page actually does not exist rather than treating it like a normal valid page.
4. Configuration: Reading process.env.PORT lets hosting platforms or other environments choose which port the app runs on without changing the code. Using || 3000 gives it a default port to use when running locally on my own machine.
5. Dependencies: node_modules has hundreds of files and takes up too much space, so it should not be pushed to GitHub. When a teammate clones the repo, they just run npm install to download everything listed in package.json and package-lock.json.
6. Same origin: If index.html is opened directly from the disk (file://), relative URLs like /api/courses look on the local hard drive instead of http://localhost:3000, so the fetch fails. Even with full URLs, the browser's Same-Origin Policy blocks a file:// page from reading data from http://localhost:3000.

Self-study notes

- Node process object: From the Node.js documentation, I found process.version to get the current Node version string and process.uptime() to get how many seconds the server has been running (which I rounded with Math.floor()).
- Content-Type for plain text: From the Express docs, I learned res.type('text/plain') sets the Content-Type header to text/plain so /hello and /robots.txt are served as plain text instead of HTML.
- Formatting JSON in the browser: From MDN docs on JSON.stringify(), passing null and 2 (JSON.stringify(data, null, 2)) formats the JSON string with 2-space indentation so it looks readable inside the pre tag.

Challenges faced

- When I created .gitignore in PowerShell, it saved as UTF-16 encoding, which made Git ignore it and try to track all 580+ files in node_modules. Changing .gitignore to UTF-8 fixed it.
- Express 5 does not allow app.get('/*', ...) for the 404 route like older versions, so I used a final app.use(...) middleware at the bottom instead.