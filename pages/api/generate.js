import { Configuration, OpenAIApi } from "openai";
require('dotenv').config();

const configuration = new Configuration({
   apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const animal = req.body.animal || '';
  //if (animal.trim().length === 0) {
    //res.status(400).json({
      //error: {
        //message: "Please enter a valid animal",
      //}
    //});
    //return;
  //}

  const benchmark = req.body.benchmark || '';
  //if (benchmark.trim().length === 0) {
    //res.status(400).json({
      //error: {
        //message: "Please enter a valid benchmark",
      //}
    //});
    //return;
  //}
const LCVR = req.body.LCVR || '';
const LCVRbenchmark = req.body.LCVRbenchmark || '';
const WCVR = req.body.WCVR || '';
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(animal, benchmark,LCVR,LCVRbenchmark,WCVR),
      temperature: 1,
      max_tokens:200
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(animal, benchmark,LCVR,LCVRbenchmark,WCVR) {
  const capitalizedAnimal = animal;
  return `Give three one-line coaching action items supported by industry specific benchmarks for the sales reps under 300 words to improve sales performance of the following B2B company.


Company profile:
B2B industry:${capitalizedAnimal}
Current Number of sales rep:${benchmark}
Current Annual Contract Value:$ ${LCVR}
Sales cycle length nin days: ${LCVRbenchmark}
Opportunity to win conversion rate: ${WCVR} %

Use the format:

Current number of ACV is $ ${LCVR} which is higher/lower than industry benchmark of Y. If lower, suggest coaching action item in one line.
Current number of Sales cycle length is ${LCVRbenchmark} days which is higher/lower than industry benchmark of Z. If lower, suggest coaching action item in one line.
Current number of win rate is ${WCVR} % which is higher/lower than industry benchmark of W. If lower, suggest coaching action item in one line.
`;
}

