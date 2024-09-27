from database import add_new_list, add_new_word, get_words, update_word
from Word import Word

class Service:
    def __init__(self):
        pass

    def add_new_list(self, userName: str, listName: str) -> None:
        add_new_list(userName, listName)

    def add_new_word(self, word: str, userName: str, listName: str) -> bool:
        newWord = Word(word)
        return add_new_word(newWord, userName, listName)
    
    def get_words(self, userName: str, listName: str) -> list:
        Words = get_words(userName, listName)
        output = []
        for word in Words:
            output.append(word.to_json())
        return output
    
    def update_word(self, word: str, userName: str, listName: str) -> None:
        update_word(word, userName, listName)

    def copy_list(self, sourceList: str, targetList: str, targetUser: str, sourceUser: str) -> None:
        Words = get_words(sourceUser, sourceList)
        for word in Words:
            add_new_word(Word(word.getWord()), targetUser, targetList)

a = Service()
a.add_new_list("user0", "list1")
a.add_new_list("user0", "list2")
a.add_new_word("word1", "user0", "list1")
a.add_new_word("word2", "user0", "list1")
a.add_new_word("word3", "user0", "list1")
a.add_new_word("word4", "user0", "list1")
a.update_word("word1", "user0", "list1")
a.update_word("word1", "user0", "list1")
a.copy_list("list1", "list2", "user0", "user0")

