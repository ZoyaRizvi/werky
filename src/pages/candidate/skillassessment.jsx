import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebase";
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';

function fixJsonText(jsonText) {
  // Remove Markdown code block markers
  jsonText = jsonText.replace(/```json/, "");
  jsonText = jsonText.replace(/```/, "");

  // Replace escaped characters
  jsonText = jsonText.replace(/\\n/g, "\n"); // Replace \n with actual newline
  jsonText = jsonText.replace(/\\t/g, "\t"); // Replace \t with tab
  jsonText = jsonText.replace(/\\"/g, '"');  // Replace \" with "

  // Normalize line breaks
  jsonText = jsonText.replace(/\r\n/g, "\n"); // Convert Windows line breaks to Unix
  jsonText = jsonText.replace(/\r/g, "\n");   // Convert old Mac line breaks to Unix

  // Ensure all property names and string values are in double quotes
  jsonText = jsonText.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2": '); // Fix property names

  return jsonText;
}

async function generateQuestions(skill) {
  try {
    console.log('Generating questions for skill:', skill);
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyBK9A3pPDR_lduTqoiBFFn4DUe-P9y8Kk4`,
      {
        contents: [
          {
            parts: [
              { text: `Generate 10 multiple choice questions related to ${skill}. Ensure the result is in json format, with questions, options, and correct answers correctly nested` },
            ],
          },
        ],
      }
    );

    const rawText = response.data.candidates[0].content.parts[0].text;
    console.log('Raw API response:', rawText); // Log raw response for debugging

    const fixedJsonText = fixJsonText(rawText);
    console.log('Fixed JSON text:', fixedJsonText); // Log fixed JSON text for debugging

    const quizData = JSON.parse(fixedJsonText);

    // Save to Firestore
    console.log('Saving to Firestore:', { skill, quizData });
    const docRef = await addDoc(collection(db, 'assessment'), {
      skill,
      quizData,
    });
    console.log('Document saved with ID:', docRef.id);

    return { id: docRef.id, ...quizData };
  } catch (error) {
    console.error("Error generating questions:", error);
    throw error;
  }
}

function SkillAssessment() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null); // Track the user's score
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showScoreDialog, setShowScoreDialog] = useState(false); // Dialog visibility state
  const location = useLocation();
  const navigate = useNavigate();
  const { skill } = location.state || {};
  const hasGeneratedQuestions = useRef(false);
  const [assessmentId, setAssessmentId] = useState(null); // Track the document ID for saving responses

  useEffect(() => {
    if (skill && !hasGeneratedQuestions.current) {
      handleGenerateQuestions(skill);
      hasGeneratedQuestions.current = true;
    }
  }, [skill]);

  async function handleGenerateQuestions(skill) {
    setLoading(true);
    setError(null);

    try {
      const quizData = await generateQuestions(skill);
      setQuestions(quizData.questions);
      setAnswers({}); // Reset answers when new questions are generated
      setAssessmentId(quizData.id); // Save the generated document ID
    } catch (error) {
      setError("An error occurred while generating questions");
    }

    setLoading(false);
  }

  function handleAnswerChange(questionIndex, option) {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: option
    }));
  }

  function isAllAnswered() {
    return questions.length > 0 && questions.length === Object.keys(answers).length;
  }

  function calculateScore() {
    let correctCount = 0;

    questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctCount += 1;
      }
    });

    return correctCount;
  }

  async function handleSubmit() {
    if (assessmentId) {
      try {
        const userScore = calculateScore();
        await updateDoc(doc(db, 'assessment', assessmentId), {
          response: answers, // Save user responses under the response field
          score: userScore // Save the score
        });
        setScore(userScore); // Update the state with the score
        setShowScoreDialog(true); // Show the score dialog
        console.log('Responses and score saved successfully');
      } catch (error) {
        console.error("Error saving responses and score:", error);
      }
    }
  }

  function handleDialogClose() {
    navigate('/dashboard/profile'); // Redirect to the profile page
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 min-h-screen p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
          Skill Assessment for <span className="text-blue-800">{skill}</span>
        </h1>

        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin border-t-4 border-blue-600 border-solid rounded-full w-16 h-16"></div>
            <p className="ml-4 text-lg text-blue-600">Loading questions...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-600">
            <p className="text-lg">{error}</p>
          </div>
        ) : (
          questions.length > 0 && (
            <div className="bg-white border border-blue-200 rounded-md p-4 shadow-md">
              <h2 className="text-lg font-semibold mb-4">Questions:</h2>
              {questions.map((question, index) => (
                <div key={index} className="mb-4">
                  <p className="text-md font-medium">{question.question}</p>
                  {question.options.map((option, idx) => (
                    <div key={idx} className="ml-4">
                      <input 
                        type="radio" 
                        id={`q${index}_o${idx}`} 
                        name={`question${index}`} 
                        value={option} 
                        checked={answers[index] === option}
                        onChange={() => handleAnswerChange(index, option)}
                      />
                      <label htmlFor={`q${index}_o${idx}`} className="ml-2">{option}</label>
                    </div>
                  ))}
                </div>
              ))}
              <div className="mt-6 flex justify-center">
                <button 
                  onClick={handleSubmit} 
                  disabled={!isAllAnswered()}
                  className={`py-2 px-4 rounded-lg font-semibold text-white ${isAllAnswered() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
                >
                  Submit
                </button>
              </div>
            </div>
          )
        )}
      </div>

      {showScoreDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm w-full">
            <h2 className="text-2xl font-bold text-green-800 mb-4">Your Score</h2>
            <p className="text-4xl font-semibold text-green-800 mb-4">{score}/{questions.length}</p>
            <button 
              onClick={handleDialogClose} 
              className="py-2 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SkillAssessment;
