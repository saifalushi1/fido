import axios from "axios";
import * as cheerio from "cheerio";
import * as fs from "fs";
import * as path from "path";
import { URL } from "url";

const downloadImage = async (imgUrl: string, folder: string): Promise<void> => {
  try {
    const response = await axios.get(imgUrl, { responseType: "arraybuffer" });
    const imgName = path.basename(new URL(imgUrl).pathname);
    const imgPath = path.join(folder, imgName);
    fs.writeFileSync(imgPath, response.data);
    console.log(`Downloaded ${imgUrl}`);
  } catch (error) {
    console.error(`Could not download ${imgUrl}:`, (error as Error).message);
  }
};

const scrapeImages = async (url: string, folder: string): Promise<void> => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const imgTags = $("img");

    imgTags.each((i, img) => {
      let imgUrl = $(img).attr("src");
      if (imgUrl) {
        imgUrl = new URL(imgUrl, url).href;
        downloadImage(imgUrl, folder);
      }
    });
  } catch (error) {
    console.error(
      `Error scraping images from ${url}:`,
      (error as Error).message
    );
  }
};
const websiteUrlBW: string =
  "https://w10.read-onepiece.net/manga/one-piece-chapter-1059/";
const websiteUrlColor: string =
  "https://ww10.readonepiece.com/chapter/one-piece-digital-colored-comics-chapter-1059/";
const saveFolder: string = "downloaded_images";

scrapeImages(websiteUrlColor, saveFolder);
