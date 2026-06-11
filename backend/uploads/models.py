from django.db import models
from django.contrib.auth.models import User


class FileUpload(models.Model):

    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("PROCESSING", "Processing"),
        ("COMPLETED", "Completed"),
        ("FAILED", "Failed"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="uploads"
    )

    original_file = models.FileField(
        upload_to="uploads/"
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="PENDING"
    )
    processed_text = models.TextField(
        blank=True,
        null=True
  )
    summary = models.TextField(
        blank=True,
        null=True
  ) 
    document_type = models.CharField(
         max_length=100,
         blank=True,
         null=True
) 

    uploaded_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.user.username} - {self.original_file.name}"