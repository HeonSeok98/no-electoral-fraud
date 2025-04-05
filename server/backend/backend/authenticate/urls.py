from django.urls import path
from .views import check_vote_status

urlpatterns = [
    path('check-vote/', check_vote_status, name='check_vote'),
]