from django.urls import path
from .views import GenerateSQLView, HealthView

urlpatterns = [
    path('generate-sql/', GenerateSQLView.as_view(), name='generate-sql'),
    path('health/', HealthView.as_view(), name='health'),
]