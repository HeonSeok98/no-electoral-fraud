from django.urls import path
from .views import save_signature

urlpatterns = [
    path("save-signature/", save_signature, name="save_signature"),
]
