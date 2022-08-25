const puppeteer = require('puppeteer');
const Job = require('../models/job');

const scrape = async () => {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            defaultViewport: null,
            args: ['--no-zygote', '--no-sandbox']
        });
        const url = 'https://www.linkedin.com/jobs/search?keywords=junior%20software%20developer&location=Indianapolis%2C%20Indiana%2C%20United%20States&geoId=100871315&trk=public_jobs_jobs-search-bar_search-submit&position=1&pageNum=0';

        // Open browser instance
        const page = await browser.newPage({ waitUntil: 'networkidle0' });
        console.log(`Navigating to ${url}`);
        await page.goto(url);

        // Perform job search
        // await page.type('input[name="keywords"]', 'junior software developer');
        // await page.keyboard.press('Tab');
        // await page.keyboard.press('Tab');

        // // Delete pre-inserted location text
        // const locationInputValue = await page.$eval('input[name="location"]', el => el.value)
        // for(let i=0; i<locationInputValue.length; i++) {
        //     await page.keyboard.press('Backspace');
        // }
        // await page.type('input[name="location"]', 'Indianapolis, IN');
        // await page.evaluate(() => document.querySelector('button[data-tracking-control-name="homepage-jobseeker_search-jobs-search-btn"]').click());
        // await page.waitForNavigation();
        // console.log('New page url: ', page.url());

        // Scroll to bottom of page, click on 'See More Jobs' and repeat until lastHeight = newHeight  
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
            // Scrape all titles that include keywords jr, junior, or entry within the post's job title
            const data = await page.evaluate(() => {
                const allJobsArr = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[data-tracking-control-name="public_jobs_jserp-result_search-card"]'));
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
            try {
                // Bulk insert of junior jobs
                Job.insertMany(data, { ordered: false})
                    .then(() => {
                        console.log(data);
                    })
                    .then(() => {
                        console.log('Save successful.')
                        // page.close();
                    })
                    .catch((err: string) => {
                        console.log(err)
                    }
                );
            } catch(err) {
                console.log(err);
            }
        }
        // Click on 'See More Jobs'
        const seeMoreJobs = async () => {
            await page.evaluate(() => {
                const el = document.querySelector<HTMLElement>('button[data-tracking-control-name="infinite-scroller_show-more"]');
                if(el !== null){
                    el.click();
                }
            });
        }
        scroll(); 
    } catch(err) {
        console.log(err);
    }
};
 
module.exports = { scrape }; 