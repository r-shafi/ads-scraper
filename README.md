# Otomoto Ads Scraper Script

## Running this Script

1. Clone this repository.
2. `cd` to the directory where you cloned the repository.
3. `npm install` to install all the dependencies.
4. `npm start` to run the script.

## Result

**ads.json**

## Q&A

### Ideas for error catching/solving, retry strategies?

Use `try catch` code block for network requests, on error - retry. On failure in retry, throw error and send error response.

### Accessing more ads from this link than the limit allows (max 50 pages)?

I'm not sure if I understood this question. I've noticed a total of 26 pages while testing.

### Experience with CI/CD tools?

No previous experience with CI/CD. Just have a basic concept about these.

### Other considerations?

Instead of scraping all data at once, using a paginated system would be a much better alternative. This would be much quicker, would have less pressure on server, would be unlikely to get flagged by the host system compared to the all-at-once method.
