## flask code to link the html and the python codes


from flask import Flask, render_template, request, send_from_directory
from flask_wtf import FlaskForm
from wtforms import FileField, SubmitField
from werkzeug.utils import secure_filename
import os
from text_process.text_extract import extract_text_with_spaces, save_extracted_text_to_file

app = Flask(__name__)
app.config['SECRET_KEY'] = 'supersecretkey'
app.config['UPLOAD_FOLDER'] = 'static/files'
combined_text_file = 'combined_extracted_text.txt'

class UploadFileForm(FlaskForm):
    file = FileField("File")
    submit = SubmitField("Upload PDF File(s)")

@app.route("/", methods=['GET','POST'])
@app.route("/home", methods=['GET','POST'])
def home():
    form = UploadFileForm()
    uploaded_files = []
    try:
        uploaded_files = os.listdir(app.config['UPLOAD_FOLDER'])
    except FileNotFoundError:
        pass

    if request.method == 'POST' and 'file[]' in request.files:
        files = request.files.getlist("file[]")
        for file in files:
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)
            extract_text_and_save_to_file(file_path)
        uploaded_files = os.listdir(app.config['UPLOAD_FOLDER'])

    return render_template("index.html", form=form, uploaded_files=uploaded_files)

@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

def extract_text_and_save_to_file(file_path):
    """
    Extracts text from a PDF file with proper spacing and appends it to a combined text file.
    
    Args:
        file_path (str): The path to the PDF file.
    """
    extracted_text = extract_text_with_spaces(file_path)
    save_extracted_text_to_file(combined_text_file, extracted_text)  # Modify this line

if __name__ == "__main__":
    app.run(debug=True)
