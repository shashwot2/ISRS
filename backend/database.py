import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from Word import Word
from datetime import datetime, timedelta
from groq import Groq
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

    # Check if this user stored any words before
    if data is None:
        add_new_list(userName, listName)
        data = doc_ref.get().to_dict() 
    # Check if the word already exists
    if word.exists(data["words"]):
        return False
    
    # Add the word to the list
    data["words"].append(word.getWord())
    data["level"].append(word.getLevel())
    data["nextReview"].append(word.getNextReview())
    data["sentence"].append(get_sentence(word.getLanguage(), word.getWord()))
    data["language"].append(word.getLanguage())
    
    # Update the document
    doc_ref.set(data)
    return True

def add_new_list(userName: str, listName: str) -> None:
    # check if has collection
    if not db.collection(userName).get():
        db.collection(userName).document(listName).set({})

    doc_ref = db.collection(userName).document(listName)
    doc_ref.set({
        "words": [],
        "level": [],
        "nextReview": [],
        "sentence": [],
        "language": []
    })

def get_words(userName: str, listName: str, ) -> list:
    doc_ref = db.collection(userName).document(listName)
    doc = doc_ref.get()
    data = doc.to_dict()
    Words = []
    for i in range(len(data["words"])):
        word = Word(data["words"][i], data["level"][i], data["nextReview"][i], data["sentence"][i], data["language"][i])
        Words.append(word)
        data["sentence"][i] = get_sentence(data["language"][i], data["words"][i])
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

def get_sentence(language, word):
    client = Groq(
        api_key="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",
    )

    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": (
                    f"Please provide exactly one simple and concise sentence in '{language}' "
                    f"that includes the word '{word}'. Ensure the sentence is easy to understand "
                    f"and does not contain any extra explanations or examples."
                )
            }
        ],
        model="llama3-8b-8192",
    )

    return chat_completion.choices[0].message.content

