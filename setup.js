#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("🚀 Content Platform Setup");
console.log("========================\n");

const questions = [
  {
    name: "strapiUrl",
    question: "Enter your Strapi API URL (default: http://localhost:1337): ",
    default: "http://localhost:1337",
  },
  {
    name: "strapiToken",
    question: "Enter your Strapi API token: ",
    required: true,
  },
  {
    name: "supabaseUrl",
    question: "Enter your Supabase URL: ",
    required: true,
  },
  {
    name: "supabaseKey",
    question: "Enter your Supabase anon key: ",
    required: true,
  },
];

const answers = {};

function askQuestion(index) {
  if (index >= questions.length) {
    createEnvFile();
    return;
  }

  const question = questions[index];
  const prompt = question.default
    ? `${question.question}${question.default}`
    : question.question;

  rl.question(prompt, (answer) => {
    if (!answer && question.default) {
      answer = question.default;
    }

    if (!answer && question.required) {
      console.log("❌ This field is required. Please try again.\n");
      askQuestion(index);
      return;
    }

    answers[question.name] = answer;
    askQuestion(index + 1);
  });
}

function createEnvFile() {
  const envContent = `# Strapi Configuration
NEXT_PUBLIC_STRAPI_API_URL=${answers.strapiUrl}
STRAPI_API_TOKEN=${answers.strapiToken}

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=${answers.supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${answers.supabaseKey}
`;

  const envPath = path.join(process.cwd(), ".env.local");

  try {
    fs.writeFileSync(envPath, envContent);
    console.log("\n✅ Environment file created successfully!");
    console.log("📁 File location: .env.local");

    console.log("\n🎉 Setup complete! You can now run:");
    console.log("   npm run dev");

    console.log("\n📚 Next steps:");
    console.log("   1. Make sure your Strapi CMS is running");
    console.log("   2. Ensure your Supabase database is set up");
    console.log("   3. Create the contents table in Supabase");
    console.log("   4. Start the development server");
  } catch (error) {
    console.error("❌ Error creating environment file:", error.message);
  }

  rl.close();
}

// Check if .env.local already exists
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  rl.question(
    "⚠️  .env.local already exists. Do you want to overwrite it? (y/N): ",
    (answer) => {
      if (answer.toLowerCase() === "y" || answer.toLowerCase() === "yes") {
        askQuestion(0);
      } else {
        console.log("Setup cancelled.");
        rl.close();
      }
    }
  );
} else {
  askQuestion(0);
}
