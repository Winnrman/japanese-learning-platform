import React, { useState, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import { SpacedRepetitionSystem } from "./SpacedRepetitionSystem";
import "./JapaneseDragDrop.css";
import { doc, setDoc } from "firebase/firestore"; // Make sure these are imported
import { db } from "./firebase";
import { useAuth } from "./pages/auth/AuthContext";

const srs = new SpacedRepetitionSystem();

const WordCard = ({ word, type, onDrop, index }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "WORD",
    item: { word, index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`word-card ${type} ${isDragging ? "dragging" : ""}`}
      data-word={word}
    >
      {word}
    </div>
  );
};

const DropSlot = ({ acceptedWord, index, onDrop, currentWord }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "WORD",
    drop: (item) => onDrop(item, index),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`drop-slot ${isOver ? "hover" : ""} ${
        currentWord ? "filled" : "empty"
      }`}
    >
      {currentWord ? (
        <WordCard word={currentWord} type="placed" index={index} />
      ) : (
        <div className="slot-placeholder">Drop here</div>
      )}
    </div>
  );
};

const JapaneseDragDrop = () => {
  const [currentExercise, setCurrentExercise] = useState(null);
  const [wordPool, setWordPool] = useState([]);
  const [sentenceSlots, setSentenceSlots] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [stats, setStats] = useState(null);
  const { user, logout } = useAuth();

  const exercises = [
    {
      id: 1,
      english: "Sushi and rice, please",
      solution: ["すし", "と", "ごはん", "おねがいします"],
      wordPool: [
        "すし",
        "と",
        "ごはん",
        "おねがいします",
        "みず",
        "を",
        "ください",
        "おちゃ",
      ],
      wordData: srs.initializeWord("food-request", "grammar", 7),
    },
    {
      id: 2,
      english: "I drink water",
      solution: ["わたし", "は", "みず", "を", "のみます"],
      wordPool: [
        "わたし",
        "は",
        "みず",
        "を",
        "のみます",
        "たべます",
        "ごはん",
        "コーヒー",
      ],
      wordData: srs.initializeWord("drink-verb", "grammar", 6),
    },
    {
      id: 3,
      english: "I eat sushi",
      solution: ["わたし", "は", "すし", "を", "たべます"],
      wordPool: [
        "わたし",
        "は",
        "すし",
        "を",
        "たべます",
        "のみます",
        "りんご",
        "おちゃ",
      ],
      wordData: srs.initializeWord("eat-verb", "grammar", 6),
    },
    {
      id: 4,
      english: "Good morning",
      solution: ["おはよう", "ございます"],
      wordPool: [
        "おはよう",
        "ございます",
        "こんばんは",
        "ありがとう",
        "さようなら",
        "こんにちは",
      ],
      wordData: srs.initializeWord("greeting", "vocab", 2),
    },
    {
      id: 5,
      english: "Good night",
      solution: ["おやすみ", "なさい"],
      wordPool: [
        "おやすみ",
        "なさい",
        "こんにちは",
        "ありがとう",
        "おはよう",
        "こんばんは",
      ],
      wordData: srs.initializeWord("greeting-night", "vocab", 2),
    },
    {
      id: 6,
      english: "I like cats",
      solution: ["わたし", "は", "ねこ", "が", "すき", "です"],
      wordPool: [
        "わたし",
        "は",
        "ねこ",
        "が",
        "すき",
        "です",
        "いぬ",
        "きらい",
      ],
      wordData: srs.initializeWord("preference", "grammar", 5),
    },
    {
      id: 7,
      english: "Do you like dogs?",
      solution: ["いぬ", "が", "すき", "です", "か"],
      wordPool: ["いぬ", "が", "すき", "です", "か", "ねこ", "わたし", "と"],
      wordData: srs.initializeWord("question-particle", "grammar", 5),
    },
    {
      id: 8,
      english: "Water, please",
      solution: ["みず", "を", "ください"],
      wordPool: [
        "みず",
        "を",
        "ください",
        "おちゃ",
        "おねがいします",
        "と",
        "すし",
      ],
      wordData: srs.initializeWord("polite-request", "grammar", 4),
    },
    {
      id: 9,
      english: "This is a book",
      solution: ["これは", "ほん", "です"],
      wordPool: ["これは", "ほん", "です", "それは", "いぬ", "です", "りんご"],
      wordData: srs.initializeWord("identifier", "grammar", 4),
    },
    {
      id: 10,
      english: "That is a cat",
      solution: ["それは", "ねこ", "です"],
      wordPool: ["それは", "ねこ", "です", "これは", "いぬ", "りんご", "ほん"],
      wordData: srs.initializeWord("identifier", "grammar", 4),
    },
    {
      id: 11,
      english: "Who are you?",
      solution: ["あなた", "は", "だれ", "です", "か"],
      wordPool: ["あなた", "は", "だれ", "です", "か", "わたし", "ねこ", "が"],
      wordData: srs.initializeWord("questions", "grammar", 5),
    },
    {
      id: 12,
      english: "I am a student",
      solution: ["わたし", "は", "がくせい", "です"],
      wordPool: [
        "わたし",
        "は",
        "がくせい",
        "です",
        "せんせい",
        "いぬ",
        "ねこ",
        "が",
      ],
      wordData: srs.initializeWord("occupation", "grammar", 3),
    },
    {
      id: 13,
      english: "Nice to meet you",
      solution: ["はじめまして", "よろしく", "おねがいします"],
      wordPool: [
        "はじめまして",
        "よろしく",
        "おねがいします",
        "ありがとう",
        "こんにちは",
        "さようなら",
      ],
      wordData: srs.initializeWord("greeting-intro", "vocab", 2),
    },
    {
      id: 14,
      english: "Where is the toilet?",
      solution: ["トイレ", "は", "どこ", "です", "か"],
      wordPool: [
        "トイレ",
        "は",
        "どこ",
        "です",
        "か",
        "がくせい",
        "わたし",
        "すき",
      ],
      wordData: srs.initializeWord("location-question", "grammar", 5),
    },
    {
      id: 15,
      english: "That is coffee",
      solution: ["それは", "コーヒー", "です"],
      wordPool: [
        "それは",
        "コーヒー",
        "です",
        "おちゃ",
        "すし",
        "ほん",
        "ねこ",
      ],
      wordData: srs.initializeWord("identifier", "grammar", 3),
    },
    {
      id: 16,
      english: "This is water",
      solution: ["これは", "みず", "です"],
      wordPool: ["これは", "みず", "です", "コーヒー", "ほん", "が", "すし"],
      wordData: srs.initializeWord("identifier", "grammar", 3),
    },
    {
      id: 17,
      english: "That is tea",
      solution: ["あれは", "おちゃ", "です"],
      wordPool: ["あれは", "おちゃ", "です", "みず", "コーヒー", "りんご"],
      wordData: srs.initializeWord("identifier", "grammar", 3),
    },
    {
      id: 18,
      english: "I understand Japanese",
      solution: ["わたし", "は", "にほんご", "が", "わかります"],
      wordPool: [
        "わたし",
        "は",
        "にほんご",
        "が",
        "わかります",
        "はなします",
        "すき",
      ],
      wordData: srs.initializeWord("comprehension", "grammar", 6),
    },
    {
      id: 19,
      english: "I do not understand",
      solution: ["わかりません"],
      wordPool: [
        "わかりません",
        "わかります",
        "たべます",
        "いきます",
        "みます",
      ],
      wordData: srs.initializeWord("negation", "grammar", 3),
    },
    {
      id: 20,
      english: "Let's eat",
      solution: ["たべましょう"],
      wordPool: [
        "たべましょう",
        "のみましょう",
        "たべます",
        "いきましょう",
        "します",
      ],
      wordData: srs.initializeWord("suggestion", "grammar", 4),
    },
    {
      id: 21,
      english: "Let's drink tea",
      solution: ["おちゃ", "を", "のみましょう"],
      wordPool: [
        "おちゃ",
        "を",
        "のみましょう",
        "たべましょう",
        "すし",
        "ください",
      ],
      wordData: srs.initializeWord("suggestion", "grammar", 4),
    },
    {
      id: 22,
      english: "I go to school",
      solution: ["わたし", "は", "がっこう", "へ", "いきます"],
      wordPool: [
        "わたし",
        "は",
        "がっこう",
        "へ",
        "いきます",
        "きます",
        "たべます",
      ],
      wordData: srs.initializeWord("movement", "grammar", 5),
    },
    {
      id: 23,
      english: "What time is it?",
      solution: ["いま", "なんじ", "です", "か"],
      wordPool: ["いま", "なんじ", "です", "か", "すき", "たべます", "どこ"],
      wordData: srs.initializeWord("time-question", "grammar", 4),
    },
    {
      id: 24,
      english: "I have a dog",
      solution: ["いぬ", "が", "います"],
      wordPool: ["いぬ", "が", "います", "ねこ", "あります", "たべます"],
      wordData: srs.initializeWord("existence", "grammar", 4),
    },
    {
      id: 25,
      english: "There is a book",
      solution: ["ほん", "が", "あります"],
      wordPool: ["ほん", "が", "あります", "います", "すし", "たべます"],
      wordData: srs.initializeWord("existence", "grammar", 4),
    },
    {
      id: 26,
      english: "My name is John",
      solution: ["わたし", "の", "なまえ", "は", "ジョン", "です"],
      wordPool: [
        "わたし",
        "の",
        "なまえ",
        "は",
        "ジョン",
        "です",
        "あなた",
        "すき",
      ],
      wordData: srs.initializeWord("introduction", "grammar", 4),
    },
    {
      id: 27,
      english: "I speak Japanese",
      solution: ["わたし", "は", "にほんご", "を", "はなします"],
      wordPool: [
        "わたし",
        "は",
        "にほんご",
        "を",
        "はなします",
        "たべます",
        "すき",
      ],
      wordData: srs.initializeWord("language", "grammar", 5),
    },
    {
      id: 28,
      english: "Japanese is difficult",
      solution: ["にほんご", "は", "むずかしい", "です"],
      wordPool: [
        "にほんご",
        "は",
        "むずかしい",
        "です",
        "たのしい",
        "すき",
        "かんたん",
      ],
      wordData: srs.initializeWord("adjectives", "grammar", 4),
    },
    {
      id: 29,
      english: "I study every day",
      solution: ["まいにち", "べんきょう", "します"],
      wordPool: ["まいにち", "べんきょう", "します", "たべます", "ねこ", "が"],
      wordData: srs.initializeWord("daily-routine", "grammar", 5),
    },
    {
      id: 30,
      english: "I sleep at night",
      solution: ["よる", "ねます"],
      wordPool: ["よる", "ねます", "たべます", "あさ", "べんきょう", "すき"],
      wordData: srs.initializeWord("daily-routine", "grammar", 4),
    },
  ];

  useEffect(() => {
    // Initialize with first exercise
    if (exercises.length > 0) {
      loadExercise(exercises[0]);
    }
  }, []);

  const loadExercise = (exercise) => {
    setCurrentExercise(exercise);
    setWordPool([...exercise.wordPool]);
    setSentenceSlots(Array(exercise.solution.length).fill(null));
    setSubmitted(false);
    setIsCorrect(false);
    setStartTime(Date.now());
    setStats(srs.getStats(exercises.map((ex) => ex.wordData)));
  };

  const handleDrop = (item, slotIndex) => {
    if (submitted) return;

    setSentenceSlots((prev) => {
      const newSlots = [...prev];
      // Remove from previous position if it was placed
      if (item.index !== undefined && item.index >= 0) {
        newSlots[item.index] = null;
      } else {
        // Remove from word pool
        setWordPool((prevPool) => prevPool.filter((w) => w !== item.word));
      }
      newSlots[slotIndex] = item.word;
      return newSlots;
    });
  };

  const removeWord = (slotIndex) => {
    if (submitted) return;

    setSentenceSlots((prev) => {
      const newSlots = [...prev];
      const wordToReturn = newSlots[slotIndex];
      newSlots[slotIndex] = null;

      if (wordToReturn && !wordPool.includes(wordToReturn)) {
        setWordPool((prevPool) => [...prevPool, wordToReturn]);
      }

      return newSlots;
    });
  };

  const checkSolution = () => {
    if (submitted || !currentExercise) return;

    const correct = sentenceSlots.every(
      (word, index) => word === currentExercise.solution[index]
    );

    setIsCorrect(correct);
    setSubmitted(true);

    // Update SRS
    const responseTime = Date.now() - startTime;
    const quality = correct
      ? responseTime < 15000
        ? 5
        : 4 // Faster completion = better
      : responseTime < 20000
      ? 2
      : 1; // Slower wrong answers = worse

    const userResponse = {
      quality,
      responseTime,
      wasCorrect: correct,
    };

    const updatedWord = srs.calculateNextReview(
      currentExercise.wordData,
      userResponse
    );

    // In a real app, you would save this to your SRS word collection
    console.log("SRS Update:", updatedWord);

    //we need to send this to the firebase backend.
    // we need to add the updatedWord object to the user's 'words' collection, or if the word is already there, update it.

    // Inside your checkSolution or wherever appropriate:
    const wordRef = doc(db, "users", user.uid, "knownWords", updatedWord.word); // find the word in the user's knownWords collection
    setDoc(wordRef, updatedWord, { merge: true }) // merge: true ensures that if the word already exists, it will be updated
      .then(() => {
        console.log("Word updated successfully");
      })
      .catch((error) => {
        console.error("Error updating word:", error);
      });
  };

  const getSlotClass = (index) => {
    if (!submitted) return "";
    return currentExercise.solution[index] === sentenceSlots[index]
      ? "correct"
      : "incorrect";
  };

  const nextExercise = () => {
    const currentIndex = exercises.findIndex(
      (e) => e.id === currentExercise.id
    );
    const nextIndex = (currentIndex + 1) % exercises.length;
    loadExercise(exercises[nextIndex]); // Load the next exercise
  };

  return (
    <div className="drag-drop-container">
      <header className="exercise-header">
        <h2>Build the Japanese Sentence</h2>
        {stats && (
          <div className="stats">
            <span>Words Learned: {stats.mature}</span>
            <span>In Progress: {stats.learning}</span>
          </div>
        )}
      </header>

      <div className="english-prompt">{currentExercise?.english}</div>

      <div className="sentence-container">
        {currentExercise &&
          sentenceSlots.map((word, index) => (
            <DropSlot
              key={index}
              index={index}
              acceptedWord={currentExercise.solution[index]}
              onDrop={handleDrop}
              currentWord={word}
              className={getSlotClass(index)}
            />
          ))}
      </div>

      <div className="word-pool">
        {wordPool.map((word, index) => (
          <WordCard
            key={`${word}-${index}`}
            word={word}
            type="pool"
            index={-1}
          />
        ))}
      </div>

      {submitted && (
        <div className={`feedback ${isCorrect ? "correct" : "incorrect"}`}>
          {isCorrect ? (
            <>
              <h3>正解！ (Correct!)</h3>
              <p>Perfect Japanese sentence structure!</p>
            </>
          ) : (
            <>
              <h3>不正解 (Incorrect)</h3>
              <p>
                The correct sentence is: {currentExercise.solution.join(" ")}
              </p>
            </>
          )}
          <div className="srs-feedback">
            Next review in: {currentExercise.wordData.interval} days
          </div>
          <button onClick={nextExercise} className="next-button">
            Next Exercise
          </button>
        </div>
      )}

      {!submitted && (
        <button
          onClick={checkSolution}
          className="submit-button"
          disabled={sentenceSlots.some((slot) => slot === null)}
        >
          Check Answer
        </button>
      )}

      <div className="hint">
        Tip: Japanese sentence structure is usually Subject-Object-Verb
      </div>
    </div>
  );
};

export default JapaneseDragDrop;
