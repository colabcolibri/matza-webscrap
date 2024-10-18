const express = require('express')
const puppeteer = require("puppeteer");
const app = express()
const port = 3000

async function scrapBadges(url) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  await page.goto(url);
  await page.waitForSelector("div.profile-badges");

  const badges = await page.evaluate(() => {
    const badgesList = [
      // trivia
      {
        title: "The Arcade Trivia October 2024 Week 1",
        type: 'trivia',
        points: 1
      },
      {
        title: "The Arcade Trivia October 2024 Week 2",
        type: 'trivia',
        points: 1
      },
      {
        title: "The Arcade Trivia October 2024 Week 3",
        type: 'trivia',
        points: 1
      },
      {
        title: "The Arcade Trivia October 2024 Week 4",
        type: 'trivia',
        points: 1
      },
      // games
      {
        title: "Level 1: Automation and CI/CD Skills",
        type: 'game',
        points: 1
      },
      {
        title: "Level 2: Cloud and Serverless Solutions",
        type: 'game',
        points: 1
      },
      {
        title: "Level 3: Google Cloud Adventures",
        type: 'game',
        points: 1
      },
      {
        title: "The Arcade Base Camp October 2024",
        type: 'game',
        points: 1
      },
      // skill badge
      {
        title: "Implement DevOps in Google Cloud",
        type: 'skill',
        points: 0.5,
      },
      {
        title: "Build and Secure Networks in Google Cloud",
        type: 'skill',
        points: 0.5,
      },
      {
        title: "Set up and Configure a Cloud Environment in Google Cloud",
        type: 'skill',
        points: 0.5,
      },
      {
        title: "Cloud Architecture: Design, Implement, and Manage",
        type: 'skill',
        points: 0.5,
      },
      {
        title: "Implement Cloud Security Fundamentals on Google Cloud",
        type: 'skill',
        points: 0.5,
      },
      {
        title: "Implement Load Balancing on Compute Engine",
        type: 'skill',
        points: 0.5,
      },
      {
        title: "G Suite Essentials",
        type: 'skill',
        points: 0.5,
      },
      {
        title: "Perform Foundational Infrastructure Tasks in Google Cloud",
        type: 'skill',
        points: 0.5,
      },
      {
        title: "Monitor and Log with Google Cloud Observability",
        type: 'skill',
        points: 0.5,
      },
      {
        title: "Build a Website on Google Cloud",
        type: 'skill',
        points: 0.5,
      },
      {
        title: "Deploy and Manage Cloud Environments with Google Cloud",
        type: 'skill',
        points: 0.5,
      },
      {
        title: "Develop Serverless Apps with Firebase",
        type: 'skill',
        points: 0.5,
      },
      {
        title: "Engineer Data for Predictive Modeling with BigQuery ML",
        type: 'skill',
        points: 0.5,
      },
      {
        title: "Deploy to Kubernetes in Google Cloud",
        type: 'skill',
        points: 0.5,
      },
      {
        title: "Inspect Rich Documents with Gemini Multimodality and Multimodal RAG",
        type: 'skill',
        points: 0.5,
      },
      {
        title: "Integrate with Machine Learning APIs",
        type: 'skill',
        points: 0.5,
      },
      {
        title: "Build a Data Warehouse",
        type: 'skill',
        points: 0.5,
      },
      {
        title: "Develop Serverless Applications on Cloud Run",
        type: 'skill',
        points: 0.5,
      },
      {
        title: "Create ML Models with BigQuery ML",
        type: 'skill',
        points: 0.5,
      },
      {
        title: "Develop GenAI Apps with Gemini and Streamlit",
        type: 'skill',
        points: 0.5,
      },
      {
        title: "Derive Insights from BigQuery Data",
        type: 'skill',
        points: 0.5,
      },
      {
        title: "Prepare Data for Looker Dashboards and Reports",
        type: 'skill',
        points: 0.5,
      },
      {
        title: "Prompt Design in Vertex AI",
        type: 'skill',
        points: 0.5,
      },
      {
        title: "Prepare Data for ML APIs on Google Cloud",
        type: 'skill',
        points: 0.5,
      },
    ];
    const textContent = (elem) => (elem ? elem.textContent.trim() : "");
    const h1Name = document.querySelector("h1.ql-display-small");
    const name = textContent(h1Name);
    const divBadges = [...document.querySelectorAll("div.profile-badge")];
    const badgesInfo = divBadges.map((badge) => ({
      title: textContent(badge.querySelector("span.ql-title-medium")),
      month:
        new Date(
          Date.parse(textContent(badge.querySelector("span.ql-body-medium")))
        ).getMonth() + 1,
      day: new Date(
        Date.parse(textContent(badge.querySelector("span.ql-body-medium")))
      ).getDate(),
      year: new Date(
        Date.parse(textContent(badge.querySelector("span.ql-body-medium")))
      ).getFullYear(),
      points: badgesList.find(b => b.title === textContent(badge.querySelector("span.ql-title-medium")))?.points || 0,
    }));

    const validTitle = (title) => badgesList.map(b => b.title).includes(title);
    const validDate = (year, month, day) =>
      (year === 2024 && month === 10) ||
      (year === 2024 && month === 11 && day <= 15);
    const validBadges = badgesInfo.filter(
      (badge) =>
        validTitle(badge.title)
        && validDate(badge.year, badge.month, badge.day)
    );

    const allValidBadges = validBadges.map(({ title, year, month, day, points }) => ({ title, date: new Date(year, month - 1, day).toISOString().split('T')[0], points }))
    // console.log(allValidBadges);

    return {
      name,
      points: allValidBadges.reduce((sum, value) => (sum + value.points), 0),
      badges: allValidBadges,
    };
  });

  // console.log({ ...badges });

  await browser.close();

  return { url, ...badges };
}

app.get('/points', async (req, res) => {
  try {
    const { url } = req.query;
    const data = await scrapBadges(url);
    res.json({ data })
  } catch (error) {
    res.status(400).send();
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})