from rest_framework import serializers
from .models import FileUpload


class FileUploadSerializer(serializers.ModelSerializer):

    class Meta:
        model = FileUpload
        fields = [
            "id",
            "original_file",
            "status",
            "summary",
            "document_type",
            "uploaded_at"
        ]
        read_only_fields = [
            "id",
            "status",
            "processed_text",
            "document_type",
            "summary",
            "uploaded_at"
        ]