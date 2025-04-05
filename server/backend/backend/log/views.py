import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import VoteSignature

@csrf_exempt
def save_signature(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            signature = data.get("signature")

            if not signature:
                return JsonResponse({"success": False, "message": "Signature is required"}, status=400)

            # 이미 존재하는 signature는 저장하지 않음
            if VoteSignature.objects.filter(signature=signature).exists():
                return JsonResponse({"success": False, "message": "Signature already exists"}, status=409)

            VoteSignature.objects.create(signature=signature)
            return JsonResponse({"success": True})

        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)}, status=500)

    return JsonResponse({"success": False, "message": "Invalid request method"}, status=405)
