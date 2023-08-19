import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import axios from 'axios';
import { config } from 'dotenv';
import { Configuration, OpenAIApi } from 'openai'; // Import OpenAI API classes

config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'));

// Configure OpenAI API
const openAi = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
    organizationId: process.env.ORG, // Your organization ID
  })
);

async function generateResponseFromOpenAI(inputText) {
  try {
    // Create a chat completion using OpenAI API
    const response = await openAi.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: inputText }],
    });

    // Extract and return the generated response content
    return response.data.choices[0].message.content;
  } catch (error) {
    throw error;
  }
}


  app.post('/generate-response', async (req, res) => {
    let inputText = req.body.inputText; // Use let instead of const
    inputText = inputText + "The given query or statement should strictly be answered in the context of hinduism, vedic, sanatani and hindu philosophy. To convey your answer quote the hindu sacrad texts too. If you think that the query is unrelated to any hindu/sanatani thing then reply that there is not any relation you can find. Use pure honorific hindi for your reply.";
    try {
      const openaiResponse = await generateResponseFromOpenAI(inputText);
      res.json({ response: openaiResponse });
      console.log(openaiResponse);
    } catch (error) {
      console.error('Error generating response:', error.message);
      res.status(500).json({ error: 'An error occurred while generating the response.' });
    }
  });
  


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
