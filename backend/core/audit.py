from django.utils.timezone import now


def write_audit_event(
    *,
    action,
    request=None,
    actor=None,
    target_model='',
    target_id='',
    progetto=None,
    meta=None,
):
    from .models import AuditEvent

    ip_address = None
    user_agent = ''
    if request is not None:
        ip_address = request.META.get('HTTP_X_FORWARDED_FOR', '').split(',')[0].strip() or request.META.get('REMOTE_ADDR')
        user_agent = (request.META.get('HTTP_USER_AGENT') or '')[:300]

    AuditEvent.objects.create(
        created_at=now(),
        actor=actor,
        action=action,
        target_model=target_model or '',
        target_id=str(target_id or ''),
        progetto=progetto,
        ip_address=ip_address,
        user_agent=user_agent,
        meta=meta or {},
    )

