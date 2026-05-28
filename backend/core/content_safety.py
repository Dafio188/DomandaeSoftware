import re


EMAIL_RE = re.compile(r'(?i)\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b')
URL_RE = re.compile(r'(?i)\b(?:https?://|www\.)\S+\b')
PHONE_CANDIDATE_RE = re.compile(r'(?:(?:\+|00)\d{1,3}[\s().-]?)?(?:\(?\d{2,4}\)?[\s.-]?)?\d[\d\s.-]{6,}\d')


def _mask_phone_candidate(match: re.Match) -> str:
    s = match.group(0)
    digits = ''.join(ch for ch in s if ch.isdigit())
    if 8 <= len(digits) <= 15:
        return '[contatto nascosto]'
    return s


def mask_contact_info(text: str) -> str:
    if not text:
        return text
    out = EMAIL_RE.sub('[contatto nascosto]', text)
    out = URL_RE.sub('[contatto nascosto]', out)
    out = PHONE_CANDIDATE_RE.sub(_mask_phone_candidate, out)
    return out

