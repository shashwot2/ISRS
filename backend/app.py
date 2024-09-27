from flask import Flask, jsonify, request
from service import Service
app = Flask(__name__)

@app.route('/add_new_word', methods=['POST'])
def add_new_list():
    userName = request.args.get('userName')
    listName = request.args.get('listName')
    S = Service()
    S.add_new_list(userName, listName)

@app.route('/add_new_word', methods=['POST'])
def add_new_word():
    word = request.args.get('word')
    userName = request.args.get('userName')
    listName = request.args.get('listName')
    S = Service()
    S.add_new_word(word, userName, listName)

@app.route('/get_words', methods=['GET'])
def get_words():
    userName = request.args.get('userName')
    listName = request.args.get('listName')
    S = Service()
    return jsonify(S.get_words(userName, listName))

@app.route('/update_word', methods=['POST'])
def update_word():
    word = request.args.get('word')
    userName = request.args.get('userName')
    listName = request.args.get('listName')
    S = Service()
    S.update_word(word, userName, listName)

@app.route('/copy_list', methods=['POST'])
def copy_list():
    sourceList = request.args.get('sourceList')
    targetList = request.args.get('targetList')
    targetUser = request.args.get('targetUser')
    sourceUser = request.args.get('sourceUser')
    S = Service()
    S.copy_list(sourceList, targetList, targetUser, sourceUser)
