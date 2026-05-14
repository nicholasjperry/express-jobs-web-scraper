# Description
- This is a small project that somewhat assisted me in filtering and automating the search for my first software developer job.  It was conceived out of a necessity to swiften and efficiently look for jobs.
- It is a vanilla JavaSript/node application.
- In essence, the project consists of a singular `scrape.ts` file, in which I invoke a `puppeteer` instance that:
  1) Opens the browser instance.
  2) Types in the position and locaiton fields.
  3) Scrolls to the bottom of the page,
  4) Scrapes all titles that include 'jr', 'junior', or 'entry' within the post's job title.
  5) Bulk insert of jobs based on the aforementioned critera into MongoDB database.
  6) Clicks on 'See More Jobs' and repeats until `lastHeight` === `newHeight`.
 
# Installation and Usage
1. To being using this project, you must first have Node.js installed globally on your local machine.
2. Then proceed to clone the repo into a local directory using `git clone https://github.com/nicholasjperry/express-jobs-web-scraper.git`.
3. Once you have cloned the remote repository to your local directory, install the required dependencies via: `npm install`.
4. Finally, run `npm run start:dev`.
