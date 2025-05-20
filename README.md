# alu_regex-data-extraction-b-sandrine
This repository contains Regex codes Hackathon. This project, `alu_regex-data-extraction-b-sandrine`, implements a JavaScript script to extract and validate specific data types from text data aggregated by an API. The script uses Regular Expressions (regex) to identify and validate eight data types: email addresses, URLs, phone numbers, credit card numbers, time, HTML tags, hashtags, and currency amounts. The goal is to process large datasets (e.g., web page content) and flag invalid data entries for further review.

# Features

- Extraction: Uses regex to find all matches of each data type in a text string.
- Validation: Ensures each extracted value matches the expected format, flagging mismatches as issues.
- JSON Processing: Traverses JSON objects to validate strings in nested structures and arrays.
- Error Reporting: Logs detailed issues (source, data type, invalid value, JSON path) for non-matching data.

# Installation

- Clone the Repository: `git clone git@github.com-bsandrine:b-sandrine/alu_regex-data-extraction-b-sandrine.git` and then `cd alu_regex-data-extraction-b-sandrine`
- After changing to the directory then run  `node index.js`
