from rest_framework.views import exception_handler
from rest_framework.response import Response
def custom_exception_handler(exc, context):
    # Call default handler first
    response = exception_handler(exc, context)

    if response is not None:
        # Wrap the response in consistent JSON format
        response.data = {
            'error': True,
            'status_code': response.status_code,
            'details': response.data
        }

    else:
        # Handle unexpected server errors
        response = Response({
            'error': True,
            'status_code': 500,
            'details': str(exc)
        }, status=500)

    return response
