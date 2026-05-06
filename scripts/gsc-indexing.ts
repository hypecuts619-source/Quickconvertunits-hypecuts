import { google } from "googleapis";
import * as fs from "fs";
import * as path from "path";
import { categories } from "../src/lib/units";

// Configuration
const DOMAIN = "https://quickconvertunits.com"; // Change to your actual domain
// The path to your Google Service Account Credentials JSON file.
// You must create a service account in GCP, enable the Search Console API and Web Search Indexing API,
// and add the service account email as an "Owner" of your domain in Google Search Console.
const KEY_PATH = path.resolve(process.cwd(), "service-account.json");

async function run() {
  if (!fs.existsSync(KEY_PATH)) {
    console.error(`\n❌ Error: Google Service Account credentials not found at ${KEY_PATH}`);
    console.log("Please place your 'service-account.json' file in the root directory.");
    console.log("Instructions to get this file:");
    console.log("1. Go to Google Cloud Console.");
    console.log("2. Enable 'Web Search Indexing API'.");
    console.log("3. Create a Service Account, generate a JSON key, and download it.");
    console.log("4. Go to Google Search Console, and add the Service Account's email as an Owner.");
    process.exit(1);
  }

  // Define the subset of URLs to index (the primary hubs as requested).
  const indexingUrls = [
    `${DOMAIN}/`,
    // Hub Pages
    ...categories.map(c => `${DOMAIN}/${c.id.replace(/_/g, '-')}-converter`),
    // Add additional high priority category endpoints or static pages if needed
    `${DOMAIN}/time-zone-converter`,
    `${DOMAIN}/bmi-calculator`,
  ];

  console.log(`Starting submission of ${indexingUrls.length} hub URLs to the Google Indexing API...`);

  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_PATH,
    scopes: ["https://www.googleapis.com/auth/indexing"],
  });

  const authClient = await auth.getClient();
  const indexing = google.indexing({ version: "v3", auth: authClient });

  let successCount = 0;
  let errorCount = 0;

  for (const url of indexingUrls) {
    try {
      const response = await indexing.urlNotifications.publish({
        requestBody: {
          url: url,
          type: "URL_UPDATED",
        },
      });
      console.log(`✅ Success: ${url}`);
      successCount++;
    } catch (err: any) {
      console.error(`❌ Failed: ${url}`);
      console.error(err.message);
      errorCount++;
    }
    
    // Slight gap to prevent rate limits per minute
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\nSubmission Complete!`);
  console.log(`Successfully submitted: ${successCount}`);
  console.log(`Failed to submit: ${errorCount}`);
  if (errorCount > 0) {
    console.log("If you see 'Permission denied' errors, make sure you added the service account email to Google Search Console as an 'Owner'.");
  }
}

run().catch(console.error);
