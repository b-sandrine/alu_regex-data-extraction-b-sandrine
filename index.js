const fetchedSampleData = {
    "user_id": "u12345",
    "email": [
        "user@example.com",
        "firstname.lastname@company.co.uk"
    ],
    "url": [
        "https://www.example.com",
        "https://subdomain.example.org/page"
    ],
    "phone": [
        "(123) 456-7890",
        "123-456-7890"
    ],
    "credit_card": "1234 5678 9012 3456",
    "preferred_contact_time": "14:30",
    "html_content": "<p>",
    "hashtags": [
        "#example",
        "#ThisIsAHashtag"
    ],
    "transaction_amounts": [
        "$19.99",
        "$1,234.56"
    ]
}

const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
const urlRegex = /https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[a-zA-Z0-9-_\/]*)?/g
const phoneNumberRegex = /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g
const HTMLTagRegex = /<[a-zA-Z]+(?:\s+[a-zA-Z-]+="[^"]*")*\s*>/g
const creditNumberRegex = /\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}/g
const timeRegex = /(?:[01]\d|2[0-3]):[0-5]\d(?:\s?[AP]M)?/g
const hashtagsRegex = /#[a-zA-Z0-9_]+/g
const currencyRegex = /\$[0-9]{1,3}(?:,[0-9]{3})*\.[0-9]{2}/g

//  Function to determine data type based on key name
function getDataType(key) {
  if (key.includes("email")) return "email";
  if (key.includes("url")) return "url";
  if (key.includes("phone")) return "phone";
  if (key.includes("credit") || key.includes("card")) return "credit";
  if (key.includes("time")) return "time";
  if (key.includes("html") || key.includes("tags")) return "html";
  if (key.includes("hashtags")) return "hashtag";
  if (key.includes("amount") || key.includes("pricing")) return "currency";
  return null;
}


// Function to get regex for a data type
function getRegex(dataType) {
  switch (dataType) {
    case "email": return emailRegex;
    case "url": return urlRegex;
    case "phone_numbers": return phoneNumberRegex;
    case "html_content": return HTMLTagRegex;
    case "credit_card": return creditNumberRegex;
    case "preferred_contact_time": return timeRegex;
    case "hashtags": return hashtagsRegex;
    case "transaction_amounts": return currencyRegex;
    default: return null;
  }
}

// Function to validate a single value against a regex
function validateValue(value, regex, dataType) {
  const pattern = new RegExp(`^${regex.source}$`);
  return pattern.test(value);
}

// Function to traverse JSON and validate strings
function validateJson(json, sourceName, issues = []) {
  function traverse(obj, path = []) {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = [...path, key];
      if (typeof value === "string") {
        const dataType = getDataType(key);
        const regex = getRegex(dataType);
        if (dataType && regex && !validateValue(value, regex, dataType)) {
          issues.push({
            source: sourceName,
            dataType,
            value,
            path: currentPath.join(".")
          });
        }
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (typeof item === "string") {
            const dataType = getDataType(key);
            const regex = getRegex(dataType);
            if (dataType && regex && !validateValue(item, regex, dataType)) {
              issues.push({
                source: sourceName,
                dataType,
                value: item,
                path: `${currentPath.join(".")}[${index}]`
              });
            }
          } else if (typeof item === "object" && item !== null) {
            traverse(item, [...currentPath, index]);
          }
        });
      } else if (typeof value === "object" && value !== null) {
        traverse(value, currentPath);
      }
    }
  }
  traverse(json);
  return issues;
}

// Validate both JSON samples
const issues = [
  ...validateJson(fetchedSampleData, "Sample 1")
];

// Results section

console.log("Validation Results:\n\n");

if (issues.length === 0) {
  console.log("All data validated successfully!\n\n");
} else {
  console.log("Issues found:");
  issues.forEach(issue => {
    console.log(`- Source: ${issue.source}`);
    console.log(`  Data Type: ${issue.dataType}`);
    console.log(`  Value: ${issue.value}`);
    console.log(`  Path: ${issue.path}`);
    console.log("\n\n");
  });
}