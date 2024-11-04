import { Command } from "commander";
import dotenv from "dotenv";
import createApp from "./app";

// Load environment variables
dotenv.config();

// Initialize Commander
const program = new Command();

// Define options
program
  .option(
    "-p, --port <number>",
    "Port to run the server",
    process.env.PORT || "5000"
  )
  .option("--env <environment>", "Set environment", "development");

// Define the "start" command
program
  .command("start")
  .description("Start the Express server")
  .action(() => {
    const app = createApp(); // Get the app instance
    const port = program.opts().port;

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  });

// Parse the command-line arguments
program.parse(process.argv);
//Maybe the most important part of this code is the createApp function. This function is responsible for creating
//an Express app instance and setting up the middleware and routes.
//The app instance is then returned to be used in the start command.
