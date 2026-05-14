# Description
- This is a small project that somewhat assisted me in filtering and automating the search for my first software developer job.  It was conceived out of a necessity to swiften and efficiently look for jobs.
- It is a vanilla JavaSript/Node.js application.
- In essence, the project consists of a singular `scrape.ts` file, in which I invoke a `puppeteer` instance that:
  1) Opens the browser instance.
  2) Types in the position and locaiton fields.
  3) Scrolls to the bottom of the page,
  4) Scrapes all titles that include 'jr', 'junior', or 'entry' within the post's job title.
  5) Bulk insert of jobs based on the aforementioned critera into a MongoDB database.
  6) Clicks on 'See More Jobs' and repeats until `lastHeight` === `newHeight`.
 
# Installation and Usage
1. To being using this project, you must first have Node.js installed globally on your local machine.
2. Then proceed to clone the repo into a local directory using `git clone https://github.com/nicholasjperry/express-jobs-web-scraper.git`.
3. Once you have cloned the remote repository to your local directory, install the required dependencies via: `npm install`.
4. Finally, run `npm run start:dev`.

# License
MIT License

Copyright (c) [2022] [Nicholas Perry]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
