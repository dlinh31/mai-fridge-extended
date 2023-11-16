from flask import Flask, render_template, request, jsonify
from ai_response import get_dishes
from ingredient_detect import detect



food_dict = {}
file_path = ''

app = Flask(__name__)
@app.route("/")
def home():
    return render_template("home.html")

@app.route("/start")
def start():
    return render_template("index.html")

@app.route('/process', methods=['POST']) 
def process(): 
    global food_dict
    data = request.get_json()['data'] # retrieve the data sent from JavaScript 
    print(data)
    # process the data using Python code 
    food_dict = get_dishes(data)
    print (food_dict)
    return jsonify(result=food_dict)


@app.route('/food', methods=['POST']) 
def food():
    return render_template("index.html", food_dict=food_dict)


@app.route('/upload', methods=['POST'])
def upload():
    try:
        file = request.files['photo']
        # Save the file to your desired location
        file.save('./static/images/' + file.filename)

        # Perform any additional processing if needed
        return jsonify({'message': 'Upload successful!', 'filename': file.filename})
    except Exception as e:
        return jsonify({'error': str(e)})


@app.route('/detect', methods=['POST'])
def activate_detect():
    filepath = request.get_json()['data'].split("\\")[-1]
    
    # Process data and generate a string response
    print(filepath)

    result = detect(filepath=filepath)
    
    return result


if __name__ == "__main__":
    app.run(debug=True)