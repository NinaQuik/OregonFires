from flask_cors import CORS, cross_origin
from flask import Flask, render_template



app = Flask(__name__)
CORS(app)

@app.route("/")
def welcome():
    return render_template('index.html')
    logging.getLogger('flask_cors').level = logging.DEBUG
if __name__ == '__main__':
    app.run(debug=True)    