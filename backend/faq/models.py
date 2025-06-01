from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()

class FAQCategory(models.Model):
    """Categorie per organizzare le FAQ"""
    name = models.CharField(max_length=100, verbose_name="Nome Categoria")
    slug = models.SlugField(unique=True, verbose_name="Slug")
    description = models.TextField(blank=True, verbose_name="Descrizione")
    icon = models.CharField(max_length=50, default="FaQuestionCircle", verbose_name="Icona")
    order = models.PositiveIntegerField(default=0, verbose_name="Ordine")
    is_active = models.BooleanField(default=True, verbose_name="Attiva")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Categoria FAQ"
        verbose_name_plural = "Categorie FAQ"
        ordering = ['order', 'name']

    def __str__(self):
        return self.name

class FAQ(models.Model):
    """Domande frequenti"""
    category = models.ForeignKey(FAQCategory, on_delete=models.CASCADE, related_name='faqs', verbose_name="Categoria")
    question = models.CharField(max_length=500, verbose_name="Domanda")
    answer = models.TextField(verbose_name="Risposta")
    order = models.PositiveIntegerField(default=0, verbose_name="Ordine")
    is_active = models.BooleanField(default=True, verbose_name="Attiva")
    views_count = models.PositiveIntegerField(default=0, verbose_name="Visualizzazioni")
    helpful_count = models.PositiveIntegerField(default=0, verbose_name="Voti Utili")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Creata da")

    class Meta:
        verbose_name = "FAQ"
        verbose_name_plural = "FAQ"
        ordering = ['category__order', 'order', 'question']

    def __str__(self):
        return f"{self.category.name} - {self.question[:50]}..."

    def increment_views(self):
        """Incrementa il contatore delle visualizzazioni"""
        self.views_count += 1
        self.save(update_fields=['views_count'])

    def increment_helpful(self):
        """Incrementa il contatore dei voti utili"""
        self.helpful_count += 1
        self.save(update_fields=['helpful_count'])

class FAQComment(models.Model):
    """Commenti degli utenti sulle FAQ"""
    COMMENT_STATUS_CHOICES = [
        ('pending', 'In Attesa'),
        ('approved', 'Approvato'),
        ('rejected', 'Rifiutato'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="Utente")
    faq = models.ForeignKey(FAQ, on_delete=models.CASCADE, related_name='comments', null=True, blank=True, verbose_name="FAQ")
    comment = models.TextField(verbose_name="Commento")
    status = models.CharField(max_length=20, choices=COMMENT_STATUS_CHOICES, default='pending', verbose_name="Stato")
    is_question = models.BooleanField(default=False, verbose_name="È una domanda")
    likes_count = models.PositiveIntegerField(default=0, verbose_name="Mi Piace")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Commento FAQ"
        verbose_name_plural = "Commenti FAQ"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.comment[:50]}..."

class FAQCommentReply(models.Model):
    """Risposte dell'admin ai commenti"""
    comment = models.OneToOneField(FAQComment, on_delete=models.CASCADE, related_name='admin_reply', verbose_name="Commento")
    admin = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="Admin")
    reply = models.TextField(verbose_name="Risposta")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Risposta Admin"
        verbose_name_plural = "Risposte Admin"
        ordering = ['-created_at']

    def __str__(self):
        return f"Risposta di {self.admin.username} a {self.comment.user.username}"

class FAQHelpfulVote(models.Model):
    """Voti di utilità per le FAQ"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="Utente")
    faq = models.ForeignKey(FAQ, on_delete=models.CASCADE, related_name='helpful_votes', verbose_name="FAQ")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Voto Utilità"
        verbose_name_plural = "Voti Utilità"
        unique_together = ['user', 'faq']

    def __str__(self):
        return f"{self.user.username} - {self.faq.question[:30]}..."

class FAQCommentLike(models.Model):
    """Like ai commenti"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="Utente")
    comment = models.ForeignKey(FAQComment, on_delete=models.CASCADE, related_name='likes', verbose_name="Commento")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Like Commento"
        verbose_name_plural = "Like Commenti"
        unique_together = ['user', 'comment']

    def __str__(self):
        return f"{self.user.username} - Like"
