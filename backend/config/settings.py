import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'django-insecure-domanda-software-dev-key-2024-very-long-secret-key-for-development')
DEBUG = True
ALLOWED_HOSTS = ['*']

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    # App custom
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

# Database - Uso PostgreSQL per Docker, SQLite per sviluppo locale
if os.environ.get('PRODUCTION', False) or os.environ.get('DB_HOST'):
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.environ.get('DB_NAME', 'domanda_software'),
            'USER': os.environ.get('DB_USER', 'domanda'),
            'PASSWORD': os.environ.get('DB_PASSWORD', 'domanda_pw'),
            'HOST': os.environ.get('DB_HOST', '127.0.0.1'),
            'PORT': os.environ.get('DB_PORT', '5432'),
        }
    }
else:
    # SQLite per sviluppo locale
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
            'min_length': 12,
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
    ),
}

CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True
CORS_EXPOSE_HEADERS = ['Content-Type', 'X-CSRFToken']
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

# Configurazioni specifiche per l'admin Django
CSRF_TRUSTED_ORIGINS = [
    'http://localhost:8001',
    'http://127.0.0.1:8001',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
]

# Configurazioni CSRF per sviluppo
CSRF_COOKIE_HTTPONLY = False
CSRF_COOKIE_SAMESITE = 'Lax'
SESSION_COOKIE_SAMESITE = 'Lax'

# Configurazioni sessione
SESSION_COOKIE_AGE = 86400  # 24 ore
SESSION_SAVE_EVERY_REQUEST = True

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Configurazione Email per Recupero Password
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'recupero.gestionale@gmail.com'
EMAIL_HOST_PASSWORD = 'fgts kiuf rkub qujc'
DEFAULT_FROM_EMAIL = 'recupero.gestionale@gmail.com'
EMAIL_SUBJECT_PREFIX = '[Gestionale Software] '

# Aggiunte per HTTPS e sicurezza (solo in produzione vera)
PRODUCTION = os.environ.get('PRODUCTION', False)
DOCKER_ENV = os.environ.get('DB_HOST', False)  # Rileva ambiente Docker

if PRODUCTION and not DOCKER_ENV:
    # Sicurezza HTTPS (solo in produzione vera, non Docker sviluppo)
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_MAX_AGE = 31536000  # 1 anno
    SECURE_HSTS_PRELOAD = True
    
    # Force HTTPS
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    
    # Altri headers di sicurezza
    X_FRAME_OPTIONS = 'DENY'
    SECURE_REFERRER_POLICY = 'strict-origin-when-cross-origin'
    
    # Debug deve essere False in produzione
    DEBUG = False
    
    # ALLOWED_HOSTS specifici
    ALLOWED_HOSTS = ['tuodominio.com', 'www.tuodominio.com']
else:
    # Mantieni impostazioni sviluppo (locale e Docker)
    DEBUG = True
    ALLOWED_HOSTS = ['*']
    # Non forzare HTTPS in sviluppo
    SESSION_COOKIE_SECURE = False
    CSRF_COOKIE_SECURE = False

# Password Hashing più sicuro
PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.Argon2PasswordHasher',  # Più sicuro di PBKDF2
    'django.contrib.auth.hashers.PBKDF2PasswordHasher',
    'django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher',
    'django.contrib.auth.hashers.BCryptSHA256PasswordHasher',
] 