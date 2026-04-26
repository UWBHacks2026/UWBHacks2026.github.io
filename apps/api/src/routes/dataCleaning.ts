// data cleaning
// BY Dominic Hatcher-Thomassen

// setting up the regex for the data cleaning
const skillPatterns: Record<string, RegExp> = 
{
  "Programming": /\b(?:coding|code|programm(?:ing|er)|developer|software|python|javascript|typescript|java|c\+\+|golang|rust)\b/i,
  "Active Listening": /\b(?:listen(?:ing)?|attentive|hearing others?|hear people)\b/i,
  "Critical Thinking": /\b(?:critical thinking|problem.?solv(?:ing|er)|analytical|analysis|reasoning|logical)\b/i,
  "Writing": /\b(?:writ(?:ing|er)|copywriting|content creation|blogging|technical writing|documentation)\b/i,
  "Mathematics": /\b(?:math(?:ematics)?|calculus|algebra|statistics|quantitative|numeracy)\b/i,
  "Public Speaking": /\b(?:public speaking|present(?:ing|ations?)|speak(?:ing)? in front|keynote|lecturing)\b/i,
  "Management": /\b(?:manag(?:ing|ement|er)|leadership|lead(?:ing)?|supervis(?:ing|or)|team lead)\b/i,
  "Customer Service": /\b(?:customer service|client relations?|support|help desk|customer.?facing)\b/i,
};

function normInput(userInput: string): string
{
    // we normalize the input by converting it to lowercase and removing extra spaces
    userInput.toLowerCase();
    // now cut out all of the fillers words that don't really mean anything
    userInput.replace(/\b(?:i(?:'?m| am)? (?:good|great|experienced|skilled|proficient|expert) at|knowledge of|experience (?:in|with)|familiar with|working knowledge of)\b/g, "");

    //cut the punctuations
    userInput.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, " ");

    //now the leadign spaces
    userInput.replace(/\s+/g, " ").trim();

    // send back the normalized input
    return userInput;
}

// The Function to call to extract the skills from the user input,
// automatically normalizes the input and then applies the regex patterns to extract the skills
export function extractSkills(userInput: string): string[]
{
    const normalizedInput = normInput(userInput);
    const extractedSkills: Set<string> = new Set();

    for (const [skill, pattern] of Object.entries(skillPatterns))
    {
        if (pattern.test(normalizedInput))
        {
            extractedSkills.add(skill);
        }
    }

    return Array.from(extractedSkills);
}

//API call time
// because we don't have the API key we will use the funtion extractSkills instead.


