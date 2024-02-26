from django.db import models


class Task(models.Model):
    STATUS_CHOICES = [
        ('To Do', 'TODO'),
        ('In Progress', 'IN_PROGRESS'),
        ('Done', 'DONE'),
    ]
    title = models.CharField(max_length=100)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='To Do')
    due_date = models.DateField()

    def __str__(self):
        return self.title
