from django.db import models

class Information(models.Model):
    name = models.CharField(max_length=4, db_index=True)  # 한글 문자열, 인덱스 추가
    code = models.CharField(max_length=4)                   # 4자리 숫자 → 문자열로 저장
    has_voted = models.BooleanField(default=False)          # 투표 여부 (기본값: False)

    def __str__(self):
        return f"{self.name} ({self.code})"