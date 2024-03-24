## code to extract the text from the input pdf fiels by user.
## the input files are stored in directory:  "static/files" 


import os
import pdfplumber

def extract_text_with_spaces(file_path):
    """
    Extracts text from a PDF file with proper spacing.
    
    Args:
        file_path (str): The path to the PDF file.
    
    Returns:
        str: The extracted text.
    """
    with pdfplumber.open(file_path) as pdf:
        text = []
        for page in pdf.pages:
            page_text = page.extract_text(x_tolerance=4, y_tolerance=4) 
            text.append(page_text + "\n\n") 

    # Combine page text with proper separators
    combined_text = "".join(text)
    return combined_text

def save_extracted_text_to_file(file_path, extracted_text):
    """
    Saves extracted text to a text file.
    
    Args:
        file_path (str): The path to save the text file.
        extracted_text (str): The text to be saved.
    """
    try:
        # Create the dealing_text folder if it doesn't exist
        if not os.path.exists("dealing_text"):
            os.makedirs("dealing_text")

        # Construct the full file path
        file_path = os.path.join("dealing_text", file_path)

        with open(file_path, 'a', encoding='utf-8') as txt_file:  # Open the file in append mode
            txt_file.write(extracted_text)
            txt_file.write("\n\n")  # Add a separator between the text of different PDF files
    except Exception as e:
        print(f"Error occurred while saving text to file: {e}")
