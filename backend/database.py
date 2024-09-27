import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from Word import Word
from datetime import datetime, timedelta
# Initialize Firebase
cred = credentials.Certificate("miro-manics-firebase-adminsdk-h5bf6-ae6fe46661.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

def add_new_word(word: Word, userName: str, listName: str) -> bool:
    # Get the reference to the document
    doc_ref = db.collection(userName).document(listName)
    
    # Fetch the document
    doc = doc_ref.get()
    
    # Get the data from the document
    data = doc.to_dict()
    
    # Check if the word already exists
    if word.exists(data["words"]):
        return False
    
    # Add the word to the list
    data["words"].append(word.getWord())
    data["level"].append(word.getLevel())
    data["nextReview"].append(word.getNextReview())
    
    # Update the document
    doc_ref.set(data)
    return True

def add_new_list(userName: str, listName: str) -> None:
    doc_ref = db.collection(userName).document(listName)
    doc_ref.set({
        "words": [],
        "level": [],
        "nextReview": []
    })

def get_words(userName: str, listName: str, ) -> list:
    doc_ref = db.collection(userName).document(listName)
    doc = doc_ref.get()
    data = doc.to_dict()
    Words = []
    for i in range(len(data["words"])):
        word = Word(data["words"][i], data["level"][i], data["nextReview"][i])
        Words.append(word)
    return Words

def get_add_days(level:int)->int:
        if level == 1:
            return 1
        elif level == 2:
            return 7
        elif level == 3:
            return 16
        elif level == 4:
            return 35
        else:
            level += 1
            return 2 * get_add_days(level) - 1
        
def update_word(word: str, userName: str, listName: str) -> None:
    doc_ref = db.collection(userName).document(listName)
    doc = doc_ref.get()
    data = doc.to_dict()
    for i in range(len(data["words"])):
        if data["words"][i] == word:
            level = data["level"][i]
            nextReview = data["nextReview"][i]
            newLevel = level + 1
            newNextReview = nextReview + timedelta(days = get_add_days(level))
            data["level"][i] = newLevel
            data["nextReview"][i] = newNextReview
            doc_ref.update({
                "level": data["level"],
                "nextReview": data["nextReview"]
            })
            break
