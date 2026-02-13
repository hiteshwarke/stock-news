const fs = require("fs");
const Parser = require("rss-parser");

const parser = new Parser();

async function fetchNews() {
  try {
    console.log("Fetching news...");

    const feed = await parser.parseURL(
      "https://www.moneycontrol.com/rss/latestnews.xml"
    );

    const keywords = /order|contract|wins|award|expansion|deal/i;

    const filteredNews = feed.items
      .filter(item => keywords.test(item.title))
      .slice(0, 15)
      .map(item => ({
        title: item.title,
        link: item.link,
        pubDate: item.pubDate
      }));

    fs.writeFileSync("news.json", JSON.stringify(filteredNews, null, 2));

    console.log("News updated successfully ✅");
  } catch (error) {
    console.error("Error fetching news:", error);
  }
}

fetchNews();
