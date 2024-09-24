from database import add_new_list, add_new_word, get_words, update_word
from Word import Word

class Service:
    def __init__(self):
        pass

    def add_new_list(self, listName: str, userName: str) -> None:
        add_new_list(listName, userName)

    def add_new_word(self, word: str, listName: str, userName: str) -> bool:
        newWord = Word(word)
        return add_new_word(newWord, userName, listName)
    
    def get_words(self, listName: str, userName: str) -> list:
        Words = get_words(userName, listName)
        output = []
        for word in Words:
            output.append(word.to_json())
        return output
    
    def update_word(self, word: str, listName: str, userName: str) -> None:
        update_word(word, userName, listName)

    def copy_list(self, sourceList: str, targetList: str, targetUser: str, sourceUser: str) -> None:
        Words = get_words(sourceUser, sourceList)
        for word in Words:
            add_new_word(word, targetUser, targetList)

if __name__ == "__main__":
    service = Service()
    service.add_new_list("list1", "user1")
    service.add_new_word("word1", "list1", "user1")
    service.add_new_word("word2", "list1", "user1")
    service.add_new_word("word3", "list1", "user1")
    service.update_word("word1", "list1", "user1")
    service.update_word("word2", "list1", "user1")
    service.update_word("word1", "list1", "user1")
    print(str(service.get_words("list1", "user1")))
    service.copy_list("list1", "list2", "user2", "user1")
    