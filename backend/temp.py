import os

from groq import Groq

def get_sentence(language, word):
    client = Groq(
        api_key="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",
    )

    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": f"give me a sentence in '{language}' containing the word '{word}', only a sentence, please."
            }
        ],
        model="llama3-8b-8192",
    )

    return chat_completion.choices[0].message.content
print(get_sentence("Chinese", "晚饭"))