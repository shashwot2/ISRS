from database import add_new_list, add_new_word, get_words, update_word
from Word import Word

class Service:
    def __init__(self):
        pass

    def add_new_list(self, userName: str, listName: str) -> None:
        add_new_list(userName, listName)

    def add_new_word(self, word: str, language: str, userName: str, listName: str) -> None:
        newWord = Word(word, language)
        return add_new_word(newWord, userName, listName) 
    
    
    def update_word(self, word: str, userName: str, listName: str) -> None:
        update_word(word, userName, listName)

    def copy_list(self, sourceList: str, targetList: str, targetUser: str, sourceUser: str) -> None:
        Words = get_words(sourceUser, sourceList)
        for word in Words:
            add_new_word(Word(word.getWord(), word.getLanguage()), targetUser, targetList)


a = Service()
a.add_new_list("user0", "list1")
a.add_new_list("user0", "list2")
a.add_new_word("hello", "English", "user0", "list1")
a.add_new_word("你好", "Chinese", "user0", "list1")
a.add_new_word("你好", "Chinese", "user0", "list2")
a.update_word("你好", "user0", "list2")
a.copy_list("list2", "list3", "user1", "user0")


