from database import add_new_list, add_new_word, get_words
from Word import Word

class Service:
    def __init__(self):
        pass



    def add_new_list(self, listName: str, userName: str) -> None:
        add_new_list(listName, userName)

    def add_new_word(self, word: str, userName: str, listName: str) -> bool:
        newWord = Word(word)
        return add_new_word(newWord, userName, listName)
    
    def get_words(self, userName: str, listName: str) -> list:
        Words = get_words(userName, listName)
        output = []
        for word in Words:
            output.append(word.to_json())
        return output
    
    def update_word(self, word: Word, userName: str, listName: str) -> None:
        pass