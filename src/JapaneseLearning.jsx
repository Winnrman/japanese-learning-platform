import React, { useState, useEffect } from 'react';
import './JapaneseLearning.css';
import { SpacedRepetitionSystem } from './SpacedRepetitionSystem';

const JapaneseLearning = () => {
  const srs = new SpacedRepetitionSystem();
  const [userWords, setUserWords] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [questionsCompleted, setQuestionsCompleted] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [stats, setStats] = useState(null);

  // Initialize with sample words if empty
  useEffect(() => {
    if (userWords.length === 0) {
      const initialWords = [
        srs.initializeWord('たべます', 'vocabulary', 8),
        srs.initializeWord('のみます', 'vocabulary', 7),
        srs.initializeWord('いきます', 'vocabulary', 6),
        srs.initializeWord('みます', 'vocabulary', 5),
        srs.initializeWord('します', 'vocabulary', 6)
      ];
      setUserWords(initialWords);
      setStats(srs.getStats(initialWords));
    }
  }, []);

  // Get next question when userWords changes or when moving to next question
  useEffect(() => {
    if (userWords.length > 0) {
      const dueWords = srs.getWordsForReview(userWords, 10);
      if (dueWords.length > 0) {
        const nextWord = dueWords[0];
        setCurrentQuestion(createQuestionForWord(nextWord));
        setStartTime(Date.now());
      } else {
        setCurrentQuestion(null); // No words due for review
      }
      setStats(srs.getStats(userWords));
    }
  }, [userWords, questionsCompleted]);

  // Create a question object based on a word
  const createQuestionForWord = (wordData) => {
    // This is a simplified version - you might want to expand this
    // with more question types and patterns
    const questionTemplates = [
      {
        english: `I ___ every day.`,
        japanese: `毎日 ___ 。`,
        blankIndex: 2,
        options: [
          { text: wordData.word, romaji: getRomaji(wordData.word), correct: true },
          ...getRandomOptions(wordData.word, wordData.type)
        ]
      },
      {
        english: `Do you ___ with your meal?`,
        japanese: `食事と一緒に ___ か？`,
        blankIndex: 3,
        options: [
          { text: wordData.word, romaji: getRomaji(wordData.word), correct: true },
          ...getRandomOptions(wordData.word, wordData.type)
        ]
      }
    ];

    return {
      ...questionTemplates[Math.floor(Math.random() * questionTemplates.length)],
      wordData: wordData,
      explanation: `Remember: "${wordData.word}" means "${getEnglishMeaning(wordData.word)}"`
    };
  };

  // Helper function to get romaji (simplified)
  const getRomaji = (word) => {
    const romajiMap = {
      'たべます': 'tabemasu',
      'のみます': 'nomimasu',
      'いきます': 'ikimasu',
      'みます': 'mimasu',
      'します': 'shimasu'
    };
    return romajiMap[word] || word;
  };

  // Helper function to get English meaning (simplified)
  const getEnglishMeaning = (word) => {
    const meaningMap = {
      'たべます': 'to eat',
      'のみます': 'to drink',
      'いきます': 'to go',
      'みます': 'to see/watch',
      'します': 'to do'
    };
    return meaningMap[word] || word;
  };

  // Get random incorrect options
  const getRandomOptions = (correctWord, type) => {
    const allWords = userWords.filter(w => w.word !== correctWord && w.type === type);
    const shuffled = [...allWords].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 2).map(word => ({
      text: word.word,
      romaji: getRomaji(word.word),
      correct: false
    }));
  };

  const handleAnswerSelect = (option) => {
    if (showFeedback) return;
    setSelectedAnswer(option);
    setIsCorrect(option.correct);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null || !currentQuestion) return;

    const responseTime = Date.now() - startTime;
    const quality = isCorrect ? 
      (responseTime < 3000 ? 5 : 4) : // Fast correct = best, slower correct = good
      (responseTime < 5000 ? 2 : 1);  // Fast incorrect = almost remembered, slow = didn't know

    const userResponse = {
      quality,
      responseTime,
      wasCorrect: isCorrect
    };

    // Update the word in SRS
    const updatedWord = srs.calculateNextReview(
      currentQuestion.wordData,
      userResponse
    );

    // Update userWords with the updated word
    setUserWords(prevWords => 
      prevWords.map(word => 
        word.word === updatedWord.word ? updatedWord : word
      )
    );

    setShowFeedback(true);
    if (isCorrect) {
      setScore(score + 1);
    }
    setQuestionsCompleted(questionsCompleted + 1);
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowFeedback(false);
  };

  const renderJapaneseSentence = () => {
    if (!currentQuestion) return null;
    
    const parts = currentQuestion.japanese.split('___');
    return (
      <div className="japanese-sentence">
        {parts[0]}
        <span className="blank">
          {selectedAnswer ? selectedAnswer.text : '___'}
        </span>
        {parts[1]}
      </div>
    );
  };

  if (!currentQuestion) {
    return (
      <div className="learning-container">
        <h2>No words due for review right now!</h2>
        {stats && (
          <div className="stats-panel">
            <h3>Your Progress</h3>
            <p>Total words: {stats.total}</p>
            <p>Words learned: {stats.mature}</p>
            <p>Words in progress: {stats.learning}</p>
            <p>Due soon: {stats.due - stats.overdue}</p>
            <p>Overdue: {stats.overdue}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="learning-container">
      <header className="app-header">
        <h1>日本語を学びましょう</h1>
        <div className="stats">
          <span>Score: {score}/{questionsCompleted}</span>
          {stats && <span>Due: {stats.due}</span>}
        </div>
      </header>
      
      <div className="progress-bar">
        <div 
          className="progress" 
          style={{ width: `${(questionsCompleted % 10) * 10}%` }}
        ></div>
      </div>
      
      <div className="question-container">
        <div className="english-sentence">
          {currentQuestion.english}
        </div>
        
        {renderJapaneseSentence()}
        
        <div className="options-container">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className={`option-btn ${
                selectedAnswer === option ? 'selected' : ''
              } ${
                showFeedback 
                  ? option.correct 
                    ? 'correct' 
                    : selectedAnswer === option && !option.correct 
                      ? 'incorrect' 
                      : ''
                  : ''
              }`}
              onClick={() => handleAnswerSelect(option)}
              disabled={showFeedback}
            >
              {option.text} <span className="romaji">({option.romaji})</span>
            </button>
          ))}
        </div>
        
        {!showFeedback ? (
          <button 
            className="submit-btn" 
            onClick={handleSubmit}
            disabled={selectedAnswer === null}
          >
            Check
          </button>
        ) : (
          <div className="feedback-container">
            <div className={`feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
              {isCorrect ? '正解! (Correct!)' : '不正解 (Incorrect)'}
            </div>
            <div className="explanation">
              {currentQuestion.explanation}
              <div className="srs-info">
                Next review in: {currentQuestion.wordData.interval} day
                {currentQuestion.wordData.interval !== 1 ? 's' : ''}
              </div>
            </div>
            <button className="next-btn" onClick={handleNextQuestion}>
              Continue
            </button>
          </div>
        )}
      </div>
      
      <footer className="app-footer">
        <p>Practice makes perfect! 頑張ってください！(Do your best!)</p>
      </footer>
    </div>
  );
};

export default JapaneseLearning;