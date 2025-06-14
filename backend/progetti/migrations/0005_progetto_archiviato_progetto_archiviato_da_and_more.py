# Generated by Django 5.2.1 on 2025-05-24 22:03

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('progetti', '0004_progetto_bozza_cliente_ok_and_more'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='progetto',
            name='archiviato',
            field=models.BooleanField(default=False, help_text='Indica se il progetto è stato archiviato'),
        ),
        migrations.AddField(
            model_name='progetto',
            name='archiviato_da',
            field=models.ForeignKey(blank=True, help_text='Utente che ha archiviato il progetto', null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='progetti_archiviati', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='progetto',
            name='data_archiviazione',
            field=models.DateTimeField(blank=True, help_text='Data e ora di archiviazione del progetto', null=True),
        ),
    ]
