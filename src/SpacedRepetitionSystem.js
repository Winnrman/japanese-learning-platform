// Spaced Repetition Algorithm for Japanese Learning Platform
// Based on the SM-2 algorithm (SuperMemo 2) with modifications for language learning

class SpacedRepetitionSystem {
    constructor() {
        // Default intervals in days
        this.defaultIntervals = [1, 3, 7, 14, 30, 90, 180, 365];
        this.difficultyMultipliers = {
            'hiragana': 0.8,    // Easier to remember
            'katakana': 0.8,
            'kanji': 1.2,       // Harder to remember
            'grammar': 1.1,
            'vocabulary': 1.0
        };
    }

    // Main function to determine when a word should be reviewed next
    calculateNextReview(wordData, userResponse) {
        const {
            word,
            type,           // 'hiragana', 'katakana', 'kanji', 'vocabulary', 'grammar'
            easinessFactor, // How easy this word is for the user (1.3 - 2.5)
            interval,       // Current interval in days
            repetitions,    // Number of successful repetitions
            lastReviewed,   // Timestamp of last review
            frequency       // How common this word is (1-10, 10 being most common)
        } = wordData;

        const {
            quality,        // User response quality (0-5)
            responseTime,   // Time taken to answer in milliseconds
            wasCorrect      // Boolean: was the answer correct?
        } = userResponse;

        // Calculate new easiness factor based on user performance
        const newEasinessFactor = this.updateEasinessFactor(
            easinessFactor, 
            quality, 
            responseTime,
            type
        );

        // Calculate new interval and repetitions
        const { newInterval, newRepetitions } = this.calculateInterval(
            interval,
            repetitions,
            newEasinessFactor,
            quality,
            type,
            frequency,
            wasCorrect
        );

        // Calculate next review date
        const nextReviewDate = new Date();
        nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);

        return {
            ...wordData,
            easinessFactor: newEasinessFactor,
            interval: newInterval,
            repetitions: newRepetitions,
            lastReviewed: new Date(),
            nextReview: nextReviewDate,
            totalReviews: (wordData.totalReviews || 0) + 1
        };
    }

    // Update easiness factor based on user performance
    updateEasinessFactor(currentEF, quality, responseTime, type) {
        // Base easiness factor adjustment
        let newEF = currentEF + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
        
        // Adjust for response time (faster = easier)
        const timeAdjustment = this.calculateTimeAdjustment(responseTime, type);
        newEF += timeAdjustment;
        
        // Apply difficulty multiplier for different content types
        const difficultyMultiplier = this.difficultyMultipliers[type] || 1.0;
        newEF *= difficultyMultiplier;
        
        // Keep within reasonable bounds
        return Math.max(1.3, Math.min(2.5, newEF));
    }

    // Calculate interval adjustment based on response time
    calculateTimeAdjustment(responseTime, type) {
        const expectedTimes = {
            'hiragana': 2000,   // 2 seconds
            'katakana': 2000,
            'kanji': 5000,      // 5 seconds
            'vocabulary': 4000,
            'grammar': 6000
        };
        
        const expected = expectedTimes[type] || 3000;
        const ratio = responseTime / expected;
        
        // Faster than expected = slight boost, slower = slight penalty
        if (ratio < 0.5) return 0.1;    // Very fast
        if (ratio < 0.8) return 0.05;   // Fast
        if (ratio > 2.0) return -0.05;  // Slow
        if (ratio > 3.0) return -0.1;   // Very slow
        return 0; // Normal speed
    }

    // Calculate new interval based on performance
    calculateInterval(currentInterval, repetitions, easinessFactor, quality, type, frequency, wasCorrect) {
        let newInterval;
        let newRepetitions;

        if (!wasCorrect || quality < 3) {
            // Reset for incorrect answers
            newRepetitions = 0;
            newInterval = 1; // Review tomorrow
        } else {
            newRepetitions = repetitions + 1;
            
            if (newRepetitions === 1) {
                newInterval = 1;
            } else if (newRepetitions === 2) {
                newInterval = 6;
            } else {
                // Standard SM-2 formula with modifications
                newInterval = Math.round(currentInterval * easinessFactor);
            }
        }

        // Adjust for word frequency (more common words reviewed more often)
        const frequencyAdjustment = this.calculateFrequencyAdjustment(frequency);
        newInterval = Math.round(newInterval * frequencyAdjustment);

        // Apply type-specific adjustments
        const typeAdjustment = this.getTypeAdjustment(type, newRepetitions);
        newInterval = Math.round(newInterval * typeAdjustment);

        // Ensure reasonable bounds
        newInterval = Math.max(1, Math.min(365, newInterval));

        return { newInterval, newRepetitions };
    }

    // Adjust interval based on word frequency
    calculateFrequencyAdjustment(frequency) {
        // More frequent words (higher frequency) should be reviewed more often
        // frequency 10 = 0.8x interval, frequency 1 = 1.2x interval
        return 1.1 - (frequency * 0.03);
    }

    // Type-specific interval adjustments
    getTypeAdjustment(type, repetitions) {
        const adjustments = {
            'hiragana': repetitions < 3 ? 0.8 : 1.0,  // More frequent early on
            'katakana': repetitions < 3 ? 0.8 : 1.0,
            'kanji': repetitions < 5 ? 0.9 : 1.0,     // Need more repetitions
            'vocabulary': 1.0,
            'grammar': repetitions < 4 ? 0.85 : 1.0   // Grammar needs reinforcement
        };
        return adjustments[type] || 1.0;
    }

    // Get words due for review
    getWordsForReview(wordCollection, maxWords = 20) {
        const now = new Date();
        const dueWords = wordCollection
            .filter(word => new Date(word.nextReview) <= now)
            .sort((a, b) => {
                // Prioritize by urgency and difficulty
                const urgencyA = (now - new Date(a.nextReview)) / (1000 * 60 * 60 * 24);
                const urgencyB = (now - new Date(b.nextReview)) / (1000 * 60 * 60 * 24);
                
                // Factor in easiness (harder words first)
                const priorityA = urgencyA + (2.5 - a.easinessFactor);
                const priorityB = urgencyB + (2.5 - b.easinessFactor);
                
                return priorityB - priorityA;
            })
            .slice(0, maxWords);

        return dueWords;
    }

    // Initialize a new word in the system
    initializeWord(word, type, frequency = 5) {
        return {
            word: word,
            type: type,
            easinessFactor: 2.5,    // Default easiness
            interval: 1,            // Start with 1 day
            repetitions: 0,
            frequency: frequency,
            dateAdded: new Date(),
            lastReviewed: null,
            nextReview: new Date(), // Available immediately
            totalReviews: 0
        };
    }

    // Get learning statistics
    getStats(wordCollection) {
        const now = new Date();
        const stats = {
            total: wordCollection.length,
            due: 0,
            learning: 0,    // Less than 4 repetitions
            mature: 0,      // 4+ repetitions
            overdue: 0,
            byType: {}
        };

        wordCollection.forEach(word => {
            // Due count
            if (new Date(word.nextReview) <= now) {
                stats.due++;
                
                // Overdue (more than 2 days late)
                const daysLate = (now - new Date(word.nextReview)) / (1000 * 60 * 60 * 24);
                if (daysLate > 2) stats.overdue++;
            }
            
            // Learning vs mature
            if (word.repetitions < 4) {
                stats.learning++;
            } else {
                stats.mature++;
            }
            
            // By type
            if (!stats.byType[word.type]) {
                stats.byType[word.type] = { total: 0, due: 0 };
            }
            stats.byType[word.type].total++;
            if (new Date(word.nextReview) <= now) {
                stats.byType[word.type].due++;
            }
        });

        return stats;
    }
}

// Example usage for a Japanese learning platform
function demonstrateUsage() {
    const srs = new SpacedRepetitionSystem();
    
    // Initialize some Japanese words
    const words = [
        srs.initializeWord('こんにちは', 'hiragana', 9),  // konnichiwa - very common
        srs.initializeWord('ありがとう', 'hiragana', 10), // arigatou - most common
        srs.initializeWord('水', 'kanji', 8),              // mizu (water) - common
        srs.initializeWord('コーヒー', 'katakana', 7)      // koohii (coffee) - common
    ];
    
    // Simulate a user reviewing a word
    const userResponse = {
        quality: 4,         // Good answer (0-5 scale)
        responseTime: 3000, // 3 seconds
        wasCorrect: true
    };
    
    // Update the word based on user performance
    const updatedWord = srs.calculateNextReview(words[0], userResponse);
    console.log('Updated word:', updatedWord);
    
    // Get words due for review
    const wordsToReview = srs.getWordsForReview(words, 10);
    console.log('Words due for review:', wordsToReview);
    
    // Get learning statistics
    const stats = srs.getStats(words);
    console.log('Learning stats:', stats);
}

export { SpacedRepetitionSystem };

if(import.meta.env.MODE === 'development') {
    window.SpacedRepetitionSystem = SpacedRepetitionSystem;
    window.demonstrateUsage = demonstrateUsage;
}

// For testing in browser
// if (typeof window !== 'undefined') {
//     window.SpacedRepetitionSystem = SpacedRepetitionSystem;
//     window.demonstrateUsage = demonstrateUsage;
// }

// demonstrateUsage()