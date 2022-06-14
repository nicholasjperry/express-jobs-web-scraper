const puppeteer = require('puppeteer');
const express = require('express');
const app = express();
const db = require('../db');
const Job = require('../models/job'); 

(async () => {
    try {
        const browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            args: ['--no-zygote', '--no-sandbox']
        });
        const url = 'https://www.linkedin.com/jobs';

        // Open browser instance
        const page = await browser.newPage({ waitUntil: 'domcontentloaded' });
        console.log(`Navigating to ${url}`);
        await page.goto(url);

        // Perform job search
        await page.type('input[name="keywords"]', 'Junior Software Developer');
        await page.keyboard.press('Tab');
        await page.keyboard.press('Tab');

        // Delete pre-inserted location text
        const locationInputValue = await page.$eval('input[name="location"]', el => el.value)
        for(let i=0; i<locationInputValue.length; i++) {
            await page.keyboard.press('Backspace');
        }
        await page.type('input[name="location"]', 'Indianapolis, IN');
        await page.evaluate(() => document.querySelector('button[data-tracking-control-name="homepage-jobseeker_search-jobs-search-btn"]').click());
        await page.waitForNavigation();
        console.log('New page url: ', page.url());

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
            Job.insertMany(data)
                .then(val => {
                    console.log('Save successful.')
                })
                .catch(err => {
                    console.log(err)
                })
            console.log(data);
            // await page.close();
        }
        scroll(); 

        // Click on 'See More Jobs'
        const seeMoreJobs = async () => {
            await page.evaluate(async() => {
                document.querySelector('button[data-tracking-control-name="infinite-scroller_show-more"]').click();
            });
        }

        // Scrape all junior job titles
        const data = await page.evaluate(() => {
            const allJobsArr = Array.from(document.querySelectorAll('a[data-tracking-control-name="public_jobs_jserp-result_search-card"]'));
            const namesAndUrls = allJobsArr.map(job => {
                return {
                    name: job.innerText,
                    url: job.href
                }
            });
            const juniorJobs = namesAndUrls.filter(function(job) {
                return job.name.includes('Junior') && job.url;
            });
            return juniorJobs;
        });
    } catch(err) {
        console.log(err);
    }
})(); 