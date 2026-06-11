import google.generativeai as genai
import os
from dotenv import load_dotenv
from pypdf import PdfReader

load_dotenv()
genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

#for model in genai.list_models():
    #print(model.name)


def extract_text_from_pdf(file_path):
    text = ""

    reader = PdfReader(file_path)

    for page in reader.pages:
        page_text = page.extract_text()

        if page_text:
            text += page_text + "\n"

    return text

def generate_summary_with_gemini(text):

    if not text:
        return "No content available."

    model = genai.GenerativeModel("gemini-2.5-flash")

    prompt = f"""
    Summarize the following document in 5-7 concise bullet points.

    Document:
    {text[:10000]}
    """

    response = model.generate_content(prompt)

    return response.text

def classify_document(text):
    model = genai.GenerativeModel("gemini-2.5-flash")

    prompt = f"""
    Classify this document into ONE category only:

    Resume
    Research Paper
    Academic Assignment
    Study Notes
    Invoice
    Technical Report
    Legal Document
    Other

    Document:
    {text[:3000]}
    """

    response = model.generate_content(prompt)

    return response.text.strip()