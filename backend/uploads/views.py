from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import FileUploadSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from .services import (extract_text_from_pdf,generate_summary_with_gemini,classify_document)
from .models import FileUpload
from processing.tasks import process_file

class UploadFileView(generics.CreateAPIView):
    serializer_class = FileUploadSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        print("FILES:", request.FILES)
        print("DATA:", request.data)
        return super().post(request, *args, **kwargs)

    def perform_create(self, serializer):

        file_upload = serializer.save(
            user=self.request.user
    )

        file_upload.status = "PENDING"
        file_upload.save()

        process_file.delay(file_upload.id)
        

class FileListView(generics.ListAPIView):
    serializer_class = FileUploadSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return FileUpload.objects.filter(
            user=self.request.user
        ).order_by("-uploaded_at")   

class FileDetailView(generics.RetrieveAPIView):
    serializer_class = FileUploadSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return FileUpload.objects.filter(
            user=self.request.user
        )
class FileDeleteView(generics.DestroyAPIView):
    serializer_class = FileUploadSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return FileUpload.objects.filter(
            user=self.request.user
        )

    def perform_destroy(self, instance):
        if instance.original_file:
            instance.original_file.delete(save=False)

        instance.delete()