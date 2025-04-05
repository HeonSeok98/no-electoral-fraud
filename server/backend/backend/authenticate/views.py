# myapp/views.py
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Information

@csrf_exempt
def check_vote_status(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            name = data.get('name')  # body에는 이름
            code = data.get('code')

            info = Information.objects.get(name=name, code=code)

            if info.has_voted:
                return JsonResponse({'message': '이미 투표함'}, status=409)
            else:
                # ✅ 아직 투표하지 않았다면 True로 바꿔서 저장
                info.has_voted = True
                info.save()

                return JsonResponse({'message': '투표 가능'}, status=200)

        except Information.DoesNotExist:
            return JsonResponse({'message': '해당 정보를 찾을 수 없음'}, status=404)
        except Exception as e:
            return JsonResponse({'message': '요청 처리 중 오류 발생', 'error': str(e)}, status=400)

    return JsonResponse({'message': '허용되지 않은 메서드'}, status=405)
