const fs = require("fs");
const puppeteer = require("puppeteer");

async function fetchNews() {
  console.log("Starting scrape...");

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();

  await page.goto("https://www.bseindia.com/corporates/ann.html", {
    waitUntil: "networkidle2"
  });

  const news = await page.evaluate(() => {
    const rows = Array.from(
      document.querySelectorAll("#ContentPlaceHolder1_gvData tr")
    );

    let items = [];

    rows.forEach(row => {
      const cells = row.querySelectorAll("td");

      if (cells.length === 7) {
        const date = cells[1].innerText.trim();
        const title = cells[2].innerText.trim();
        const linkEl = cells[3].querySelector("a");
        let link = "";

        if (linkEl) {
          link = linkEl.href;
        }

        items.push({ date, title, link });
      }
    });

    return items;
  });

  await browser.close();

  // Filter by keyword
  const filtered = news.filter(item =>
    /order|contract|wins|award|expansion|deal/i.test(item.title)
  );

  fs.writeFileSync("news.json", JSON.stringify(filtered, null, 2));

  console.log("Scraping done, saved news.json");
}

fetchNews();
