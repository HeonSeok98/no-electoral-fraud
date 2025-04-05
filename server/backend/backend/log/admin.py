from django.contrib import admin
from .models import VoteSignature

@admin.register(VoteSignature)
class VoteSignatureAdmin(admin.ModelAdmin):
    list_display = ("id", "signature", "created_at")
    search_fields = ("signature",)
    ordering = ("-created_at",)
