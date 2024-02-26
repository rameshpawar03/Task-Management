from django.contrib import admin
from .models import Task


class TaskAdmin(admin.ModelAdmin):
    list_filter = ('title', 'description', 'status', 'due_date')
    list_display = ('title', 'description', 'status', 'due_date')


admin.site.register(Task, TaskAdmin)
