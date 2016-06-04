/*
 * Entry point to the app. Starts all scrapers and actors and displays all app metrics.
 */

/*
 * Determine how many threads will be created on this machine
 * Create two processpools for scrapers and actors (minimum 2 processes, do that for MVP)
 * 		- Scraper pool (1/3 of all pools)
 *   	- Actor pool (2/3 of all pools)
 * Divide all subreddits that are being scraped between the scraper pool
 *
 * Scraper Logic:
 * 		- Scrape all new comments
 * 		- hashes comments that have certain keywords and satisfy formatting requirements
 *   	- Send scraped comments whose hashes are not present in DB to Message Queue
 *    	- If clean flag is on drop all saved comment hashes
 *   	- Add comment hashes to DB
 *
 * Actor Logic (designed to be as light as possible on imgur so as to not go over the API limit):
 * 		- Consume messages from Message Queue
 * 		- If image hash is already in DB, return reversed imgur gif link
 * 		- Else:
 * 			- Use ezgif.com API to reverse gifs
 * 		 	- Upload that reversed gif to imgur using imgur API
 * 		 	- Save initial image hash with reversed gif imgur link in DB
 * 		  	- Send reply to comment with reversed gif imgur link
 */
