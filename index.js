const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://in.indeed.com/jobs?q=qa&l=&from=searchOnHP&vjk=da0afb6c9c2fed7e&advn=809475373058928");

  const jobListings = await page.evaluate(() => {
    const jobElements = Array.from(document.querySelectorAll(".job_seen_beacon"));
    return jobElements.map((jobElement) => {
      const titleElement = jobElement.querySelector(".css-1m4cuuf");
      const companyElement = jobElement.querySelector(".turnstileLink");
      const locationElement = jobElement.querySelector(".companyLocation");
      const salaryElement = jobElement.querySelector(".job-snippet");
      const linkElement = jobElement.querySelector(".date");

      const title = titleElement ? titleElement.innerText.trim() : "";
      const company = companyElement ? companyElement.innerText.trim() : "";
      const location = locationElement ? locationElement.innerText.trim() : "";
      const descrepion = salaryElement ? salaryElement.innerText.trim() : "";
      const posted_date = linkElement ? linkElement.innerText.trim() : "";

      return { title, company, location, descrepion, posted_date };
    });
  });

  fs.writeFile("job_listings.json", JSON.stringify(jobListings), (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("Job listings data has been written to job_listings.json");
  });

  await browser.close();
})();
