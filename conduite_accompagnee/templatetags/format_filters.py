from django import template

register = template.Library()

@register.filter
def format_duration(td):
    if td is None:
        return ""
    total_seconds = int(td.total_seconds())
    hours, remainder = divmod(total_seconds, 3600)
    minutes, seconds = divmod(remainder, 60)
    result = []
    if hours:
        result.append(f"{hours}h")
    if minutes:
        result.append(f"{minutes}min")
    if not hours and not minutes:
        result.append(f"{seconds}s")
    return " ".join(result)
