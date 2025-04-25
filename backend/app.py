from flask import Flask, request, jsonify, session, send_file
from flask_cors import CORS
from captcha.image import ImageCaptcha
import random
import string
import io
from datetime import timedelta

app = Flask(__name__)

app.secret_key = 'your-unique-secret-key'
app.permanent_session_lifetime = timedelta(minutes=30) 

CORS(app,supports_credentials=True)

# Image Captcha
@app.route('/validate-image-captcha', methods=['POST'])
def validate_image_captcha():
    data = request.json
    return jsonify({'success': data['selected'] == data['target']})

@app.route('/image-captcha', methods=['GET'])
def image_captcha():
    return jsonify({
        'question': 'Click the cat',
        'target': 'cat',
        'options': [
            {
                'label': 'dog',
                'url': 'https://plus.unsplash.com/premium_photo-1694819488591-a43907d1c5cc?q=80&w=1914&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            },
            {
                'label': 'cat',
                'url': 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?crop=entropy&cs=tinysrgb&fit=crop&h=100&w=100'
            },
            {
                'label': 'rabbit',
                'url': 'https://images.unsplash.com/photo-1552757166-a0d5c202e7cb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            }
        ]
    })


@app.route("/refresh-image-captcha", methods=["GET"])
def refresh_image_captcha():
    questions = [
        {
            'question': 'Click the rabbit',
            'target': 'rabbit',
            'options': [
                {
                    'label': 'dog',
                    'url': 'https://images.unsplash.com/photo-1560121782-5f367043805b?q=80&w=2037&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                },
                {
                    'label': 'cat',
                    'url': 'https://images.unsplash.com/photo-1571566882372-1598d88abd90?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                },
                {
                    'label': 'rabbit',
                    'url': 'https://images.unsplash.com/photo-1707625463749-50e1acf931c4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                }
            ]
        },
        {
            'question': 'Click the dog',
            'target': 'dog',
            'options': [
                {
                    'label': 'dog',
                    'url': 'https://plus.unsplash.com/premium_photo-1666229410352-c4686b71cea2?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                },
                {
                    'label': 'cat',
                    'url': 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                },
                {
                    'label': 'rabbit',
                    'url': 'https://images.unsplash.com/photo-1639060127790-01bf9ce1e048?q=80&w=1906&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                }
            ]
        }
    ]
    
    # Randomly select a question
    selected_question = random.choice(questions)
    return jsonify(selected_question)
# Text Captcha

# Generate a random text
def generate_text(length=5):
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))

@app.route("/text-captcha", methods=["GET"])
def get_text_captcha():
    image = ImageCaptcha(width=280, height=90)
    text = generate_text()  # Generate random text
    session.permanent = True 
    session["captcha_text"] = text  # Store text in session
    session.modified = True
    data = image.generate(text)  # Generate image as binary stream

    return send_file(io.BytesIO(data.read()), mimetype="image/png") 

@app.route("/validate-text-captcha", methods=["POST"])
def validate_text_captcha():
    user_input = request.json.get("userInput")
    correct_text = session.get("captcha_text",'')
    if user_input == correct_text:
        return jsonify({"success": True})
    return jsonify({"success": False})
    
if __name__ == '__main__':
    app.run(debug=True)
