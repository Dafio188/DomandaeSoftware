import os
from pathlib import Path
import dj_database_url

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'django-insecure-domanda-software-dev-key-2024-very-long-secret-key-for-development')
DEBUG = os.environ.get('DEBUG', 'True').lower() in ['1', 'true', 'yes']
PRODUCTION = os.environ.get('PRODUCTION', '').lower() in ['1', 'true', 'yes']

allowed_hosts_raw = os.environ.get('DJANGO_ALLOWED_HOSTS') or os.environ.get('ALLOWED_HOSTS')
if allowed_hosts_raw:
    ALLOWED_HOSTS = [h.strip() for h in allowed_hosts_raw.split(',') if h.strip()]
else:
    ALLOWED_HOSTS = ['*'] # Permette l'accesso da qualsiasi IP/Host per i test

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework_simplejwt.token_blacklist',
    'corsheaders',
    # App custom
    'core',
    'utenti',
    'richieste',
    'offerte',
    'progetti',
    'transazioni',
    'messaggi',
    'recensioni',
    'prodotti',
    'testimonianze',
    'faq',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# Configurazione Database - Solo PostgreSQL e SQLite
DATABASE_URL = os.environ.get('DATABASE_URL')
if DATABASE_URL:
    db_config = dj_database_url.parse(DATABASE_URL, conn_max_age=600)
    DATABASES = {
        'default': db_config
    }
elif PRODUCTION or os.environ.get('DB_HOST'):
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.environ.get('DB_NAME', 'domanda_software'),
            'USER': os.environ.get('DB_USER', 'domanda'),
            'PASSWORD': os.environ.get('DB_PASSWORD', 'softmatch_pwd'),
            'HOST': os.environ.get('DB_HOST', 'db'),
            'PORT': os.environ.get('DB_PORT', '5432'),
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {
            'min_length': 8,
        }
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'it-it'
TIME_ZONE = 'Europe/Rome'
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTH_USER_MODEL = 'utenti.User'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.BasicAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ),
    'DEFAULT_THROTTLE_CLASSES': (
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle',
        'rest_framework.throttling.ScopedRateThrottle',
    ),
    'DEFAULT_THROTTLE_RATES': {
        'anon': os.environ.get('DRF_THROTTLE_ANON', '1000/hour'),
        'user': os.environ.get('DRF_THROTTLE_USER', '1200/hour'),
        'auth': os.environ.get('DRF_THROTTLE_AUTH', '200/minute'),
        'password_reset': os.environ.get('DRF_THROTTLE_PASSWORD_RESET', '10/hour'),
    },
}

from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=int(os.environ.get('JWT_ACCESS_MINUTES', '30'))),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=int(os.environ.get('JWT_REFRESH_DAYS', '7'))),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
}

CORS_ALLOW_ALL_ORIGINS = True # Permette chiamate API da qualsiasi origine per i test
CORS_ALLOW_CREDENTIALS = True
CORS_EXPOSE_HEADERS = ['Content-Type', 'X-CSRFToken']
CORS_ALLOW_HEADERS = [
    'accept', 'accept-encoding', 'authorization', 'content-type',
    'dnt', 'origin', 'user-agent', 'x-csrftoken', 'x-requested-with',
]

# Configurazioni CSRF e Sessioni (Massima Sicurezza)
CSRF_COOKIE_HTTPONLY = True
SESSION_COOKIE_HTTPONLY = True
CSRF_COOKIE_SAMESITE = 'Lax'
SESSION_COOKIE_SAMESITE = 'Lax'
CSRF_TRUSTED_ORIGINS = [
    'http://localhost:3000', 'http://localhost:3001', 'http://localhost:3088',
    'http://localhost:8088', 'http://127.0.0.1:3000', 'https://app.softmatch.it',
]

SESSION_COOKIE_AGE = 86400  # 24 ore
SESSION_SAVE_EVERY_REQUEST = True

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

EMAIL_BACKEND = os.environ.get(
    'EMAIL_BACKEND',
    'django.core.mail.backends.console.EmailBackend' if DEBUG else 'django.core.mail.backends.smtp.EmailBackend'
)
EMAIL_HOST = os.environ.get('EMAIL_HOST', 'smtp.gmail.com')
EMAIL_PORT = int(os.environ.get('EMAIL_PORT', '587'))
EMAIL_USE_TLS = os.environ.get('EMAIL_USE_TLS', 'True').lower() in ['1', 'true', 'yes']
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD', '')
DEFAULT_FROM_EMAIL = os.environ.get('DEFAULT_FROM_EMAIL', EMAIL_HOST_USER or 'noreply@softmatch.it')

FRONTEND_URL = os.environ.get('FRONTEND_URL', 'https://softmatch.it')

if not DEBUG:
    CORS_ALLOWED_ORIGINS = [
        'https://softmatch.it',
        'https://app.softmatch.it',
        'https://api.softmatch.it',
    ]

# Configurazioni Produzione
if PRODUCTION:
    DEBUG = False
    
    # Rimosso raise ValueError per permettere l'avvio con i default
    if not allowed_hosts_raw:
        print("ATTENZIONE: DJANGO_ALLOWED_HOSTS non impostata. Uso i default.")

    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_MAX_AGE = 31536000
    SECURE_HSTS_PRELOAD = True

    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    USE_X_FORWARDED_HOST = True

    force_https = os.environ.get('FORCE_HTTPS', '0').lower() in ['1', 'true', 'yes']
    SECURE_SSL_REDIRECT = force_https
    SESSION_COOKIE_SECURE = force_https
    CSRF_COOKIE_SECURE = force_https

    X_FRAME_OPTIONS = 'DENY'
    SECURE_REFERRER_POLICY = 'strict-origin-when-cross-origin'

PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.Argon2PasswordHasher',
    'django.contrib.auth.hashers.PBKDF2PasswordHasher',
]

CSRF_TRUSTED_ORIGINS = [
    'https://app.softmatch.it',
    'https://api.softmatch.it',
    'https://softmatch.it',
    'http://app.softmatch.it',
    'http://api.softmatch.it',
    'http://softmatch.it',
    'http://localhost:3088',
    'http://localhost:8088',
    'http://127.0.0.1:3088',
    'http://127.0.0.1:8088',
]

# Aggiunge dinamicamente l'host corrente ai trusted origins se siamo in test
CSRF_TRUSTED_ORIGINS += [f"http://{host}" for host in ALLOWED_HOSTS if host != '*']
CSRF_TRUSTED_ORIGINS += [f"https://{host}" for host in ALLOWED_HOSTS if host != '*']
