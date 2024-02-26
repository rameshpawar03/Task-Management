from rest_framework import serializers
from .models import Task


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'status', 'due_date']

    def validate_status(self, value):

        valid_statuses = ['To Do', 'In Progress', 'Done']
        if value not in valid_statuses:
            raise serializers.ValidationError("Status must be one of: 'To Do', 'In Progress', 'Done'")
        return value


