// Japanese Learning Dictionary
// Comprehensive word database for spaced repetition system

class JapaneseDictionary {
    constructor() {
        this.words = new Map();
        this.initializeBasicWords();
    }

    initializeBasicWords() {
        const basicWords = [
            // Hiragana - Greetings & Basic Phrases
            {
                id: 'h001',
                japanese: 'こんにちは',
                reading: 'konnichiwa',
                english: 'hello, good afternoon',
                type: 'hiragana',
                category: 'greetings',
                difficulty: 2,
                frequency: 10,
                jlptLevel: 5,
                strokeCount: null,
                tags: ['greeting', 'polite', 'essential'],
                context: 'Used from late morning to late afternoon',
                examples: ['こんにちは、田中さん。(Hello, Tanaka-san.)']
            },
            {
                id: 'h002',
                japanese: 'ありがとう',
                reading: 'arigatou',
                english: 'thank you',
                type: 'hiragana',
                category: 'greetings',
                difficulty: 2,
                frequency: 10,
                jlptLevel: 5,
                strokeCount: null,
                tags: ['gratitude', 'essential', 'polite'],
                context: 'Casual thank you, use ありがとうございます for formal',
                examples: ['ありがとう！(Thank you!)']
            },
            {
                id: 'h003',
                japanese: 'すみません',
                reading: 'sumimasen',
                english: 'excuse me, sorry',
                type: 'hiragana',
                category: 'greetings',
                difficulty: 3,
                frequency: 9,
                jlptLevel: 5,
                strokeCount: null,
                tags: ['apology', 'attention', 'polite'],
                context: 'Used for both apologies and getting attention',
                examples: ['すみません、駅はどこですか？(Excuse me, where is the station?)']
            },
            {
                id: 'h004',
                japanese: 'はい',
                reading: 'hai',
                english: 'yes',
                type: 'hiragana',
                category: 'responses',
                difficulty: 1,
                frequency: 10,
                jlptLevel: 5,
                strokeCount: null,
                tags: ['affirmation', 'essential'],
                context: 'Standard affirmative response',
                examples: ['はい、そうです。(Yes, that\'s right.)']
            },
            {
                id: 'h005',
                japanese: 'いいえ',
                reading: 'iie',
                english: 'no',
                type: 'hiragana',
                category: 'responses',
                difficulty: 2,
                frequency: 8,
                jlptLevel: 5,
                strokeCount: null,
                tags: ['negation', 'essential'],
                context: 'Standard negative response',
                examples: ['いいえ、違います。(No, that\'s wrong.)']
            },

            // Katakana - Common Loanwords
            {
                id: 'k001',
                japanese: 'コーヒー',
                reading: 'koohii',
                english: 'coffee',
                type: 'katakana',
                category: 'food_drink',
                difficulty: 2,
                frequency: 8,
                jlptLevel: 5,
                strokeCount: null,
                tags: ['beverage', 'loanword', 'daily'],
                context: 'From English "coffee"',
                examples: ['コーヒーを飲みます。(I drink coffee.)']
            },
            {
                id: 'k002',
                japanese: 'レストラン',
                reading: 'resutoran',
                english: 'restaurant',
                type: 'katakana',
                category: 'places',
                difficulty: 3,
                frequency: 7,
                jlptLevel: 5,
                strokeCount: null,
                tags: ['place', 'loanword', 'dining'],
                context: 'From English "restaurant"',
                examples: ['レストランで食べます。(I eat at a restaurant.)']
            },
            {
                id: 'k003',
                japanese: 'ホテル',
                reading: 'hoteru',
                english: 'hotel',
                type: 'katakana',
                category: 'places',
                difficulty: 2,
                frequency: 6,
                jlptLevel: 5,
                strokeCount: null,
                tags: ['place', 'loanword', 'travel'],
                context: 'From English "hotel"',
                examples: ['ホテルに泊まります。(I stay at a hotel.)']
            },

            // Basic Kanji
            {
                id: 'k101',
                japanese: '水',
                reading: 'mizu',
                english: 'water',
                type: 'kanji',
                category: 'food_drink',
                difficulty: 3,
                frequency: 8,
                jlptLevel: 5,
                strokeCount: 4,
                tags: ['beverage', 'essential', 'nature'],
                context: 'One of the most basic kanji',
                examples: ['水を飲みます。(I drink water.)'],
                radicals: ['水 (water)'],
                onReading: 'スイ',
                kunReading: 'みず'
            },
            {
                id: 'k102',
                japanese: '人',
                reading: 'hito',
                english: 'person, people',
                type: 'kanji',
                category: 'people',
                difficulty: 2,
                frequency: 10,
                jlptLevel: 5,
                strokeCount: 2,
                tags: ['people', 'essential', 'basic'],
                context: 'Fundamental kanji for person',
                examples: ['あの人は誰ですか？(Who is that person?)'],
                radicals: ['人 (person)'],
                onReading: 'ジン、ニン',
                kunReading: 'ひと'
            },
            {
                id: 'k103',
                japanese: '日',
                reading: 'hi',
                english: 'day, sun',
                type: 'kanji',
                category: 'time',
                difficulty: 3,
                frequency: 10,
                jlptLevel: 5,
                strokeCount: 4,
                tags: ['time', 'essential', 'nature'],
                context: 'Used in many time-related words',
                examples: ['今日は暑いです。(Today is hot.)'],
                radicals: ['日 (sun)'],
                onReading: 'ニチ、ジツ',
                kunReading: 'ひ、か'
            },
            {
                id: 'k104',
                japanese: '本',
                reading: 'hon',
                english: 'book',
                type: 'kanji',
                category: 'objects',
                difficulty: 3,
                frequency: 7,
                jlptLevel: 5,
                strokeCount: 5,
                tags: ['objects', 'education', 'media'],
                context: 'Also used as counter for long objects',
                examples: ['本を読みます。(I read a book.)'],
                radicals: ['木 (tree)', '一 (one)'],
                onReading: 'ホン',
                kunReading: 'もと'
            },
            {
                id: 'k105',
                japanese: '学校',
                reading: 'gakkou',
                english: 'school',
                type: 'kanji',
                category: 'places',
                difficulty: 4,
                frequency: 8,
                jlptLevel: 5,
                strokeCount: 18, // Combined strokes
                tags: ['place', 'education', 'compound'],
                context: 'Compound kanji: 学 (study) + 校 (school)',
                examples: ['学校に行きます。(I go to school.)'],
                radicals: ['学 (study)', '校 (school)'],
                onReading: 'ガッコウ',
                kunReading: null
            },

            // Grammar particles and basic words
            {
                id: 'g001',
                japanese: 'は',
                reading: 'wa',
                english: 'topic particle',
                type: 'grammar',
                category: 'particles',
                difficulty: 4,
                frequency: 10,
                jlptLevel: 5,
                strokeCount: null,
                tags: ['particle', 'topic', 'essential'],
                context: 'Marks the topic of a sentence, pronounced "wa" not "ha"',
                examples: ['私は学生です。(I am a student.)']
            },
            {
                id: 'g002',
                japanese: 'を',
                reading: 'wo',
                english: 'object particle',
                type: 'grammar',
                category: 'particles',
                difficulty: 4,
                frequency: 9,
                jlptLevel: 5,
                strokeCount: null,
                tags: ['particle', 'object', 'essential'],
                context: 'Marks the direct object, pronounced "o"',
                examples: ['本を読みます。(I read a book.)']
            },
            {
                id: 'g003',
                japanese: 'に',
                reading: 'ni',
                english: 'direction/time particle',
                type: 'grammar',
                category: 'particles',
                difficulty: 5,
                frequency: 9,
                jlptLevel: 5,
                strokeCount: null,
                tags: ['particle', 'direction', 'time'],
                context: 'Indicates direction, time, or indirect object',
                examples: ['学校に行きます。(I go to school.)']
            },

            // Basic vocabulary
            {
                id: 'v001',
                japanese: '私',
                reading: 'watashi',
                english: 'I, me',
                type: 'kanji',
                category: 'pronouns',
                difficulty: 3,
                frequency: 10,
                jlptLevel: 5,
                strokeCount: 7,
                tags: ['pronoun', 'essential', 'self'],
                context: 'Polite first-person pronoun',
                examples: ['私は田中です。(I am Tanaka.)'],
                radicals: ['私 (private)'],
                onReading: 'シ',
                kunReading: 'わたし、わたくし'
            },
            {
                id: 'v002',
                japanese: '食べる',
                reading: 'taberu',
                english: 'to eat',
                type: 'hiragana',
                category: 'verbs',
                difficulty: 3,
                frequency: 9,
                jlptLevel: 5,
                strokeCount: null,
                tags: ['verb', 'ru-verb', 'daily', 'food'],
                context: 'Ru-verb (ichidan verb)',
                examples: ['ご飯を食べます。(I eat rice/meal.)']
            },
            {
                id: 'v003',
                japanese: '行く',
                reading: 'iku',
                english: 'to go',
                type: 'kanji',
                category: 'verbs',
                difficulty: 4,
                frequency: 9,
                jlptLevel: 5,
                strokeCount: 6,
                tags: ['verb', 'u-verb', 'movement', 'essential'],
                context: 'U-verb (godan verb), irregular conjugation',
                examples: ['学校に行きます。(I go to school.)'],
                radicals: ['行 (go)'],
                onReading: 'コウ、ギョウ',
                kunReading: 'い、ゆ'
            }
        ];

        // Add all words to the Map
        basicWords.forEach(word => {
            this.words.set(word.id, word);
        });
    }

    // Get word by ID
    getWord(id) {
        return this.words.get(id);
    }

    // Get all words
    getAllWords() {
        return Array.from(this.words.values());
    }

    // Filter words by criteria
    filterWords(criteria) {
        return this.getAllWords().filter(word => {
            if (criteria.type && word.type !== criteria.type) return false;
            if (criteria.category && word.category !== criteria.category) return false;
            if (criteria.difficulty && word.difficulty > criteria.difficulty) return false;
            if (criteria.jlptLevel && word.jlptLevel > criteria.jlptLevel) return false;
            if (criteria.frequency && word.frequency < criteria.frequency) return false;
            return true;
        });
    }

    // Get words for beginners (JLPT N5, high frequency)
    getBeginnerWords() {
        return this.filterWords({
            jlptLevel: 5,
            frequency: 6
        }).sort((a, b) => b.frequency - a.frequency);
    }

    // Get words by type
    getWordsByType(type) {
        return this.filterWords({ type });
    }

    // Add new word (for AI API integration)
    addWord(wordData) {
        const id = wordData.id || this.generateId();
        const word = {
            id,
            dateAdded: new Date(),
            ...wordData
        };
        this.words.set(id, word);
        return word;
    }

    // Generate unique ID
    generateId() {
        return 'w' + Date.now() + Math.random().toString(36).substr(2, 5);
    }

    // Convert to SRS format
    toSRSFormat() {
        return this.getAllWords().map(word => ({
            id: word.id,
            word: word.japanese,
            reading: word.reading,
            meaning: word.english,
            type: word.type,
            difficulty: word.difficulty,
            frequency: word.frequency,
            category: word.category,
            // SRS-specific fields (will be added by SRS system)
            easinessFactor: 2.5,
            interval: 1,
            repetitions: 0,
            dateAdded: word.dateAdded || new Date(),
            lastReviewed: null,
            nextReview: new Date(),
            totalReviews: 0
        }));
    }

    // Get statistics
    getStats() {
        const words = this.getAllWords();
        const stats = {
            total: words.length,
            byType: {},
            byDifficulty: {},
            byJLPTLevel: {},
            averageDifficulty: 0
        };

        words.forEach(word => {
            // By type
            stats.byType[word.type] = (stats.byType[word.type] || 0) + 1;
            
            // By difficulty
            stats.byDifficulty[word.difficulty] = (stats.byDifficulty[word.difficulty] || 0) + 1;
            
            // By JLPT level
            stats.byJLPTLevel[word.jlptLevel] = (stats.byJLPTLevel[word.jlptLevel] || 0) + 1;
        });

        stats.averageDifficulty = words.reduce((sum, word) => sum + word.difficulty, 0) / words.length;
        
        return stats;
    }

    // Search words (for AI API to find relevant words)
    searchWords(query) {
        const lowerQuery = query.toLowerCase();
        return this.getAllWords().filter(word => 
            word.japanese.includes(query) ||
            word.reading.toLowerCase().includes(lowerQuery) ||
            word.english.toLowerCase().includes(lowerQuery) ||
            word.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
        );
    }
}

// Integration example with SRS
function integrateDictionaryWithSRS() {
    const dictionary = new JapaneseDictionary();
    const srs = new SpacedRepetitionSystem(); // Assuming SRS is imported
    
    // Convert dictionary to SRS format
    const srsWords = dictionary.toSRSFormat();
    
    // Get beginner words for new user
    const beginnerWords = dictionary.getBeginnerWords().slice(0, 10);
    
    console.log('Dictionary loaded with', dictionary.getAllWords().length, 'words');
    console.log('Beginner words:', beginnerWords.map(w => w.japanese));
    
    return { dictionary, srsWords };
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { JapaneseDictionary };
}

// For browser use
if (typeof window !== 'undefined') {
    window.JapaneseDictionary = JapaneseDictionary;
    window.integrateDictionaryWithSRS = integrateDictionaryWithSRS;
}