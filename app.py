import google.generativeai as genai
from flask import Flask, jsonify, request
import re
import codecs
import os
from dotenv import load_dotenv
load_dotenv()

google_api_key = os.environ.get('GOOGLE_API_KEY')
genai.configure(api_key=google_api_key)
model = genai.GenerativeModel('gemini-pro')

def color_analysis(skin_color,hair_color,eye_color):
    ans=None
    while not ans:
      try:    
        response = model.generate_content(f"my skin color is {skin_color} my hair color is {hair_color} my eye color is {eye_color} which skintone pallette am I in terms of spring summer winter fall which color to avoid and which suits me the best")
        ans=str(response.candidates[0].content.parts[0])
      except:
        print('Error')
    return ans

ESCAPE_SEQUENCE_RE = re.compile(r'''
    ( \\U........      # 8-digit hex escapes
    | \\u....          # 4-digit hex escapes
    | \\x..            # 2-digit hex escapes
    | \\[0-7]{1,3}     # Octal escapes
    | \\N\{[^}]+\}     # Unicode characters by name
    | \\[\\'"abfnrtv]  # Single-character escapes
    )''', re.UNICODE | re.VERBOSE)

def decode_escapes(s):
    def decode_match(match):
        return codecs.decode(match.group(0), 'unicode-escape')

    return ESCAPE_SEQUENCE_RE.sub(decode_match, s)

app = Flask(__name__)

@app.route('/resultPage', methods=['POST'])
def resultPage():
  if request.method == 'POST':
    print("four")
    print(request.json)
    data = request.get_json()
    skin_color = data['skinColor']
    hair_color = data['hairColor']
    eye_color = data['eyeColor']
    text = str(color_analysis(skin_color,hair_color,eye_color))[6:]
    #text=decode_escapes(text).replace("*"," ")
    return jsonify({"text" : text })
  else:
    return jsonify({'error': 'Invalid request method. Please use POST.'})

if __name__ == '__main__':
  app.run(port=3000,debug=True)