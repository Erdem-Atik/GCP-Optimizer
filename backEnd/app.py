from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify(error="No file part"), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify(error="No selected file"), 400
    # Process the file (e.g., save it, parse it, etc.)
    return jsonify(success=True)

if __name__ == '__main__':
    app.run(debug=True)
