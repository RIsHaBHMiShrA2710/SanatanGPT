import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { config } from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';
import { fileURLToPath } from 'url'; // Import the fileURLToPath function

config();

// Get the directory name using import.meta
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'));

const openAi = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
    organizationId: process.env.ORG,
  })
);

async function generateResponseFromOpenAI(inputText) {
  try {
    const response = await openAi.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: inputText }],
      max_tokens: 200,
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    throw error;
  }
}

app.post('/generate-response', async (req, res) => {
  let inputText = req.body.inputText;
  inputText = inputText + "Give the response to the prompt as a ai BOT which answers prompts through the context of hinduism(there may be general life questions).The answer should be strictly under 140 words. The response should contain the sanskrit quotes too from where the answer is generated (from vedas, puranas or any other ancient indian texts or reference ). for your reference use all the hindu sacred texts and epics. ";
  try {
    const openaiResponse = await generateResponseFromOpenAI(inputText);
    res.json({ response: openaiResponse });
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
