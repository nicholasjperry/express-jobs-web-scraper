const puppeteer = require('puppeteer');
require('../db');
const Job = require('../models/job');

(async () => {
    try {
        const browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            args: ['--no-zygote', '--no-sandbox']
        });
        const url = 'https://www.linkedin.com/jobs/search?keywords=Junior%20Software%20Developer&location=Indianapolis%2C%20IN&geoId=&trk=homepage-jobseeker_jobs-search-bar_search-submit&position=1&pageNum=0';

        // Open browser instance
        const page = await browser.newPage({ waitUntil: 'networkidle0' });
        console.log(`Navigating to ${url}`);
        await page.goto(url);

        // Perform job search
        // await page.type('input[name="keywords"]', 'Junior Software Developer');
        // await page.keyboard.press('Tab');
        // await page.keyboard.press('Tab');

        // Delete pre-inserted location text
        // const locationInputValue = await page.$eval('input[name="location"]', el => el.value)
        // for(let i=0; i<locationInputValue.length; i++) {
        //     await page.keyboard.press('Backspace');
        // }
        // await page.type('input[name="location"]', 'Indianapolis, IN');
        // await page.evaluate(() => document.querySelector('button[data-tracking-control-name="homepage-jobseeker_search-jobs-search-btn"]').click());
        // await page.waitForNavigation();
        // console.log('New page url: ', page.url());

        // Scroll to bottom of page, click on 'See More Jobs' and repeat   
        let lastHeight = await page.evaluate('document.body.scrollHeight');
        const scroll = async () => {
            while (true) {
                await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
                await page.waitForTimeout(2000); 
                let newHeight = await page.evaluate('document.body.scrollHeight');
                if (newHeight === lastHeight) {
                    break;
                }
                lastHeight = newHeight;
                seeMoreJobs();
            }
            // Scrape all junior job titles
            const data = await page.evaluate(() => {
                const allJobsArr = Array.from(document.querySelectorAll('a[data-tracking-control-name="public_jobs_jserp-result_search-card"]'));
                const namesAndUrls = allJobsArr.map(job => {
                    return {
                        name: job.innerText,
                        url: job.href,
                        path: job.pathname
                    }
                });
                const juniorJobs = namesAndUrls.filter(function(job) {
                    return job.name.includes('Junior') || job.name.includes('Jr') || job.name.includes('Entry') && job.url && job.path;
                });
                return juniorJobs;
            });
            Job.insertMany(data)
                .then(() => {
                    console.log(data);
                })
                .then(() => {
                    console.log('Save successful.')
                    page.close();
                })
                .catch(err => {
                    console.log(err)
                })
        }
        // Click on 'See More Jobs'
        const seeMoreJobs = async () => {
            await page.evaluate(() => {
                document.querySelector('button[data-tracking-control-name="infinite-scroller_show-more"]').click();
            });
        }
        scroll(); 
    } catch(err) {
        console.log(err);
    }
})();