from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import FAQCategory, FAQ, FAQComment, FAQCommentReply, FAQHelpfulVote, FAQCommentLike

@admin.register(FAQCategory)
class FAQCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'order', 'is_active', 'faqs_count', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['order', 'name']
    
    def faqs_count(self, obj):
        count = obj.faqs.filter(is_active=True).count()
        if count > 0:
            url = reverse('admin:faq_faq_changelist') + f'?category__id__exact={obj.id}'
            return format_html('<a href="{}">{} FAQ</a>', url, count)
        return '0 FAQ'
    faqs_count.short_description = 'FAQ Attive'

class FAQCommentInline(admin.TabularInline):
    model = FAQComment
    extra = 0
    readonly_fields = ['user', 'created_at', 'likes_count']
    fields = ['user', 'comment', 'status', 'is_question', 'likes_count', 'created_at']

@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ['question_short', 'category', 'order', 'is_active', 'views_count', 'helpful_count', 'comments_count', 'created_at']
    list_filter = ['category', 'is_active', 'created_at', 'updated_at']
    search_fields = ['question', 'answer']
    ordering = ['category__order', 'order', 'question']
    inlines = [FAQCommentInline]
    readonly_fields = ['views_count', 'helpful_count', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Informazioni Principali', {
            'fields': ('category', 'question', 'answer')
        }),
        ('Impostazioni', {
            'fields': ('order', 'is_active', 'created_by')
        }),
        ('Statistiche', {
            'fields': ('views_count', 'helpful_count', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def question_short(self, obj):
        return obj.question[:50] + '...' if len(obj.question) > 50 else obj.question
    question_short.short_description = 'Domanda'
    
    def comments_count(self, obj):
        count = obj.comments.filter(status='approved').count()
        pending = obj.comments.filter(status='pending').count()
        
        if count > 0 or pending > 0:
            url = reverse('admin:faq_faqcomment_changelist') + f'?faq__id__exact={obj.id}'
            text = f'{count} approvati'
            if pending > 0:
                text += f', {pending} in attesa'
            return format_html('<a href="{}">{}</a>', url, text)
        return '0 commenti'
    comments_count.short_description = 'Commenti'

class FAQCommentReplyInline(admin.StackedInline):
    model = FAQCommentReply
    extra = 0
    readonly_fields = ['admin', 'created_at', 'updated_at']

@admin.register(FAQComment)
class FAQCommentAdmin(admin.ModelAdmin):
    list_display = ['user', 'faq_short', 'comment_short', 'status', 'is_question', 'likes_count', 'has_reply', 'created_at']
    list_filter = ['status', 'is_question', 'created_at', 'faq__category']
    search_fields = ['user__username', 'user__email', 'comment', 'faq__question']
    ordering = ['-created_at']
    inlines = [FAQCommentReplyInline]
    readonly_fields = ['user', 'likes_count', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Commento', {
            'fields': ('user', 'faq', 'comment', 'is_question')
        }),
        ('Moderazione', {
            'fields': ('status',)
        }),
        ('Statistiche', {
            'fields': ('likes_count', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['approve_comments', 'reject_comments']
    
    def faq_short(self, obj):
        if obj.faq:
            return obj.faq.question[:30] + '...' if len(obj.faq.question) > 30 else obj.faq.question
        return 'Commento generale'
    faq_short.short_description = 'FAQ'
    
    def comment_short(self, obj):
        return obj.comment[:50] + '...' if len(obj.comment) > 50 else obj.comment
    comment_short.short_description = 'Commento'
    
    def has_reply(self, obj):
        if hasattr(obj, 'admin_reply'):
            return format_html('<span style="color: green;">✓ Risposto</span>')
        return format_html('<span style="color: orange;">⏳ In attesa</span>')
    has_reply.short_description = 'Risposta Admin'
    
    def approve_comments(self, request, queryset):
        updated = queryset.update(status='approved')
        self.message_user(request, f'{updated} commenti approvati.')
    approve_comments.short_description = 'Approva commenti selezionati'
    
    def reject_comments(self, request, queryset):
        updated = queryset.update(status='rejected')
        self.message_user(request, f'{updated} commenti rifiutati.')
    reject_comments.short_description = 'Rifiuta commenti selezionati'

@admin.register(FAQCommentReply)
class FAQCommentReplyAdmin(admin.ModelAdmin):
    list_display = ['comment_user', 'comment_short', 'admin', 'reply_short', 'created_at']
    list_filter = ['admin', 'created_at']
    search_fields = ['comment__user__username', 'comment__comment', 'reply', 'admin__username']
    ordering = ['-created_at']
    readonly_fields = ['comment', 'admin', 'created_at', 'updated_at']
    
    def comment_user(self, obj):
        return obj.comment.user.username
    comment_user.short_description = 'Utente'
    
    def comment_short(self, obj):
        return obj.comment.comment[:30] + '...' if len(obj.comment.comment) > 30 else obj.comment.comment
    comment_short.short_description = 'Commento Originale'
    
    def reply_short(self, obj):
        return obj.reply[:50] + '...' if len(obj.reply) > 50 else obj.reply
    reply_short.short_description = 'Risposta'

@admin.register(FAQHelpfulVote)
class FAQHelpfulVoteAdmin(admin.ModelAdmin):
    list_display = ['user', 'faq_short', 'created_at']
    list_filter = ['created_at', 'faq__category']
    search_fields = ['user__username', 'faq__question']
    ordering = ['-created_at']
    readonly_fields = ['user', 'faq', 'created_at']
    
    def faq_short(self, obj):
        return obj.faq.question[:50] + '...' if len(obj.faq.question) > 50 else obj.faq.question
    faq_short.short_description = 'FAQ'

@admin.register(FAQCommentLike)
class FAQCommentLikeAdmin(admin.ModelAdmin):
    list_display = ['user', 'comment_user', 'comment_short', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__username', 'comment__user__username', 'comment__comment']
    ordering = ['-created_at']
    readonly_fields = ['user', 'comment', 'created_at']
    
    def comment_user(self, obj):
        return obj.comment.user.username
    comment_user.short_description = 'Autore Commento'
    
    def comment_short(self, obj):
        return obj.comment.comment[:30] + '...' if len(obj.comment.comment) > 30 else obj.comment.comment
    comment_short.short_description = 'Commento'

# Personalizzazione del titolo admin
admin.site.site_header = 'Domanda & Software - Gestione FAQ'
admin.site.site_title = 'FAQ Admin'
admin.site.index_title = 'Gestione FAQ e Community'
