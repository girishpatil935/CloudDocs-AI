from django.urls import path
from .views import (UploadFileView,FileListView,FileDetailView,FileDeleteView)

urlpatterns = [
    path("upload/", UploadFileView.as_view(), name="upload-file"),
    path("files/", FileListView.as_view(), name="file-list"),
     path(
        "files/<int:pk>/",
        FileDetailView.as_view(),
        name="file-detail"
    ),
    path(
        "files/<int:pk>/delete/",
        FileDeleteView.as_view(),
        name="file-delete"
    )
]