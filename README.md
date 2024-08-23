# News aggregator application

The News Aggregator is a web application that collects news articles from multiple sources: NewsAPI, The Guardian and The New York Times. This app will help you to stay up-to-date with the latest news from around the world, all in one place.

## Features

1. Search Functionality: Easily find specific news articles.
2. Filtering Options: Filter news articles by date, category, and source.
3. Personalized News Feed: Customize your feed by selecting preferred sources and categories.

## Requirements

To use this application, you will need API keys for the following news sources:

- **The Guardian** [Register here](https://bonobo.capi.gutools.co.uk/register/developer)
- **NewsAPI** [Register here](https://newsapi.org/register)
- **The New York Times** [Register here](https://developer.nytimes.com/get-started)
  Enable **"Times Wire API"** and **"Article Search API"** in your NY Times developer account.

## How to run using docker

1. Clone the repository

```
git clone https://github.com/AIBarabanshchikova/news-aggregator.git
cd news-aggregator
```

2. Build the Docker Image

You will need to provide api keys for the following variables: **GUARDIAN_KEY**, **NY_TIMES_KEY**, **NEWS_API_KEY**

```
docker build -t news-aggregator:latest --build-arg GUARDIAN_KEY=<GUARDIAN_KEY> --build-arg NY_TIMES_KEY=<NY_TIMES_KEY> --build-arg NEWS_API_KEY=<NEWS_API_KEY> .
```

3. Run the Docker Container

```
docker run -p 5678:80 news-aggregator:latest
```

4. Access the application

Open your web browser and go to http://localhost:5678

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

3. Configure environment variables

Create .env file in the root directory and add your API keys

```
VITE_GUARDIAN_KEY=<GUARDIAN_KEY>
VITE_NY_TIMES_KEY=<NY_TIMES_KEY>
VITE_NEWS_API_KEY=<NEWS_API_KEY>
```

4. Start the application

```
npm run dev
```

5. Access the application

Open your web browser and go to the address provided in the console output
