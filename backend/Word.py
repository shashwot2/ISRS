from datetime import datetime
from datetime import timedelta
class Word:
    def __init__(self, word, language = "", level = 1, nextReview = (datetime.now() + timedelta(days=1)), sentence = ""):
        self.word = word
        self.level = level
        self.nextReview = nextReview
        self.sentence = sentence
        self.language = language

    def __str__(self):
        return self.word + " " + self.language + " " + str(self.level) + " " + str(self.nextReview) + " " + self.sentence
    
    def setLevel(self, level, nextReview):
        self.level = level
        self.nextReview = nextReview
    
    def getWord(self):
        return self.word
    
    def getLevel(self):
        return self.level
    
    def getNextReview(self):
        return self.nextReview
    
    def getSentence(self):
        return self.sentence
    
    def getLanguage(self):
        return self.language
    
    def exists(self, WordList):
        for word in WordList:
            if word == self.word:
                return True
        return False
    
    def to_json(self):
        return {
            "word": self.word,
            "language": self.language,
            "sentence": self.sentence,
            "level": self.level,
            "nextReview": self.nextReview
        }