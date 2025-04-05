from django.contrib import admin
from .models import Information

@admin.register(Information)
class InformationAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'has_voted')       # 목록에 보일 필드
    search_fields = ('name',)                          # 검색 기능 (name 기준)
    list_filter = ('has_voted',)  