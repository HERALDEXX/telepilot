const axios = require("axios");

async function getRandomQuote() {
  try {
    const response = await axios.get("https://zenquotes.io/api/random");
    return response.data[0];
  } catch (error) {
    throw new Error("Failed to fetch quote");
  }
}

module.exports = { getRandomQuote };
