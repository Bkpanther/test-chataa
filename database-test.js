const express = require("express");
const bodyParser = require("body-parser");
const knex = require("knex");
const app = express();
const port = 5000;

// Initialize Knex
const db = knex(require("./knexfile").development);

// Middleware
app.use(bodyParser.json());

// API endpoint to save PDF and snippets
app.post("/save-pdf", async (req, res) => {
  const { pdf, key, snippets } = req.body;

  if (!pdf || !key || !snippets) {
    return res.status(400).send("Missing data.");
  }

  try {
    // Insert into database
    const [id] = await db("pdf_data").insert({
      pdf,
      encryption_key: key,
      snippet1: snippets[0],
      snippet2: snippets[1],
    }).returning("id");

    res.status(200).send({ id });
  } catch (error) {
    console.error("Error saving to database:", error);
    res.status(500).send("Failed to save to database.");
  }
});

// API endpoint to retrieve data
app.get("/get-pdf/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const data = await db("pdf_data").where({ id }).first();

    if (!data) {
      return res.status(404).send("Data not found.");
    }

    res.status(200).send(data);
  } catch (error) {
    console.error("Error retrieving data:", error);
    res.status(500).send("Failed to retrieve data.");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
