# News aggregator application

The News Aggregator is a web application that collects news articles from three sources (NewsAPI, The Guardian, The New York Times) and presents them. This app will help uoy to stay up-to-date with the latest news from all the world.

## Features

1. Search functionality for finding specific news articles
2. The ability to filter the results by date, category, and source
3. The ability to personalize news feed by selecting your preferred source and category

## Requirements

You will need to get api keys to launch the application:

- The Guardian: https://bonobo.capi.gutools.co.uk/register/developer
- NewsAPI: https://newsapi.org/register
- The New York Times: https://developer.nytimes.com/get-started Here you will need to enable "Times Wire API" and "Article Search API"

## How to run using docker

1. Clone the repository

```
git clone https://github.com/AIBarabanshchikova/news-aggregator
cd news-aggregator
```

2. Build the Docker Image

You will need to provide api keys for the following variables: GUARDIAN_KEY, NY_TIMES_KEY, NEWS_API_KEY

```
docker build -t news-aggregator:latest --build-arg GUARDIAN_KEY=<GUARDIAN_KEY> --build-arg NY_TIMES_KEY=<NY_TIMES_KEY> --build-arg NEWS_API_KEY=<NEWS_API_KEY> .
```

3. Run the Docker Container

```
docker run -p 5678:80 news-aggregator:latest
```

4. Open http://localhost:5678

## How to run using Node.js

1. Clone the repository

```
git clone https://github.com/yourusername/news-aggregator.git
cd news-aggregator
```

2. Install dependencies

```
npm install
```

3. Create .env file and set variables

```
VITE_GUARDIAN_KEY=<GUARDIAN_KEY>
VITE_NY_TIMES_KEY=<NY_TIMES_KEY>
VITE_NEWS_API_KEY=<NEWS_API_KEY>
```

4. Start the application

```
npm run dev
```
