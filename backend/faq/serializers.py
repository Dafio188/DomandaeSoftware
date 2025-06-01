from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import FAQCategory, FAQ, FAQComment, FAQCommentReply, FAQHelpfulVote, FAQCommentLike

User = get_user_model()

class FAQCategorySerializer(serializers.ModelSerializer):
    faqs_count = serializers.SerializerMethodField()

    class Meta:
        model = FAQCategory
        fields = ['id', 'name', 'slug', 'description', 'icon', 'order', 'is_active', 'faqs_count']

    def get_faqs_count(self, obj):
        return obj.faqs.filter(is_active=True).count()

class FAQCommentReplySerializer(serializers.ModelSerializer):
    admin_name = serializers.CharField(source='admin.get_full_name', read_only=True)
    admin_username = serializers.CharField(source='admin.username', read_only=True)

    class Meta:
        model = FAQCommentReply
        fields = ['id', 'admin_name', 'admin_username', 'reply', 'created_at', 'updated_at']

class FAQCommentSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    user_username = serializers.CharField(source='user.username', read_only=True)
    user_type = serializers.SerializerMethodField()
    admin_reply = FAQCommentReplySerializer(read_only=True)
    can_like = serializers.SerializerMethodField()
    user_has_liked = serializers.SerializerMethodField()

    class Meta:
        model = FAQComment
        fields = [
            'id', 'user_name', 'user_username', 'user_type', 'comment', 
            'status', 'is_question', 'likes_count', 'created_at', 'updated_at',
            'admin_reply', 'can_like', 'user_has_liked'
        ]
        read_only_fields = ['user', 'likes_count', 'status']

    def get_user_type(self, obj):
        if hasattr(obj.user, 'tipo_utente'):
            return obj.user.tipo_utente
        return 'client'

    def get_can_like(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return request.user != obj.user
        return False

    def get_user_has_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return FAQCommentLike.objects.filter(user=request.user, comment=obj).exists()
        return False

    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['user'] = request.user
        return super().create(validated_data)

class FAQSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    comments = FAQCommentSerializer(many=True, read_only=True)
    comments_count = serializers.SerializerMethodField()
    user_has_voted_helpful = serializers.SerializerMethodField()
    can_vote_helpful = serializers.SerializerMethodField()

    class Meta:
        model = FAQ
        fields = [
            'id', 'category', 'category_name', 'category_slug', 'question', 'answer',
            'order', 'is_active', 'views_count', 'helpful_count', 'created_at', 'updated_at',
            'comments', 'comments_count', 'user_has_voted_helpful', 'can_vote_helpful'
        ]
        read_only_fields = ['views_count', 'helpful_count']

    def get_comments_count(self, obj):
        return obj.comments.filter(status='approved').count()

    def get_user_has_voted_helpful(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return FAQHelpfulVote.objects.filter(user=request.user, faq=obj).exists()
        return False

    def get_can_vote_helpful(self, obj):
        request = self.context.get('request')
        return request and request.user.is_authenticated

class FAQListSerializer(serializers.ModelSerializer):
    """Serializer semplificato per la lista delle FAQ"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    comments_count = serializers.SerializerMethodField()

    class Meta:
        model = FAQ
        fields = [
            'id', 'category', 'category_name', 'category_slug', 'question',
            'views_count', 'helpful_count', 'comments_count'
        ]

    def get_comments_count(self, obj):
        return obj.comments.filter(status='approved').count()

class FAQCommentCreateSerializer(serializers.ModelSerializer):
    """Serializer per creare nuovi commenti"""
    class Meta:
        model = FAQComment
        fields = ['faq', 'comment', 'is_question']

    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['user'] = request.user
        return super().create(validated_data)

class FAQCommentReplyCreateSerializer(serializers.ModelSerializer):
    """Serializer per creare risposte admin"""
    class Meta:
        model = FAQCommentReply
        fields = ['comment', 'reply']

    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['admin'] = request.user
        return super().create(validated_data)

class FAQSearchSerializer(serializers.Serializer):
    """Serializer per la ricerca nelle FAQ"""
    query = serializers.CharField(max_length=200, required=False, allow_blank=True)
    category = serializers.CharField(max_length=50, required=False, allow_blank=True)
    sort_by = serializers.ChoiceField(
        choices=['relevance', 'views', 'helpful', 'recent'],
        default='relevance',
        required=False
    )

class FAQStatsSerializer(serializers.Serializer):
    """Serializer per le statistiche delle FAQ"""
    total_faqs = serializers.IntegerField()
    total_categories = serializers.IntegerField()
    total_comments = serializers.IntegerField()
    total_views = serializers.IntegerField()
    most_viewed_faq = FAQListSerializer()
    most_helpful_faq = FAQListSerializer()
    recent_comments = FAQCommentSerializer(many=True) 