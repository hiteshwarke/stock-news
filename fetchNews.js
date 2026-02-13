# (NSE RSS Fetch + Filter)
const axios = require("axios");
const xml2js = require("xml2js");
const fs = require("fs");

const RSS_URL = "https://www.nseindia.com/rss/corporate-announcements.xml";

async function fetchNews() {
  try {
    const response = await axios.get(RSS_URL, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(response.data);

    const items = result.rss.channel[0].item;

    const filtered = items
      .filter(item =>
        item.title[0].match(/Order|Contract|Award|Expansion/i)
      )
      .slice(0, 15)
      .map(item => ({
        title: item.title[0],
        link: item.link[0],
        date: item.pubDate[0]
      }));

    fs.writeFileSync("news.json", JSON.stringify(filtered, null, 2));
    console.log("News updated successfully ✅");
  } catch (error) {
    console.error(error);
  }
}

fetchNews();
