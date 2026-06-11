from celery import shared_task

from uploads.models import FileUpload
from uploads.services import (
    extract_text_from_pdf,
    generate_summary_with_gemini,
    classify_document
)


@shared_task
def process_file(file_id):

    file_upload = FileUpload.objects.get(id=file_id)

    try:
        file_upload.status = "PROCESSING"
        file_upload.save()

        extracted_text = extract_text_from_pdf(
            file_upload.original_file.path
        )

        summary = generate_summary_with_gemini(
            extracted_text[:5000]
        )

        document_type = classify_document(
            extracted_text[:3000]
        )

        file_upload.processed_text = extracted_text
        file_upload.summary = summary
        file_upload.document_type = document_type
        file_upload.status = "COMPLETED"

        file_upload.save()

    except Exception as e:

        file_upload.summary = (
            f"Processing failed: {str(e)}"
        )

        file_upload.status = "FAILED"
        file_upload.save()