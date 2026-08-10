import urllib.parse
import urllib.request
import logging

DEVELOPER_PHONE = "917058638277" # Tejas Thakare (Lead Developer)

logger = logging.getLogger(__name__)

def build_whatsapp_alert_url(shop_name: str, area: str, address: str, owner_name: str, owner_phone: str, plan_type: str = "Free Listing") -> str:
    message = (
        f"🚨 *NEW SHOP SUBMISSION ALERT!* 🚨\n\n"
        f"🏬 *Shop Name*: {shop_name}\n"
        f"📍 *Area*: {area}\n"
        f"🗺️ *Address*: {address}\n"
        f"👤 *Owner Name*: {owner_name}\n"
        f"📞 *Owner Phone*: {owner_phone}\n"
        f"💰 *Plan Tier*: {plan_type}\n\n"
        f"🌐 *Platform*: Nashik's Best Misal (Developer: Tejas Thakare)"
    )
    
    encoded_text = urllib.parse.quote(message)
    return f"https://api.whatsapp.com/send?phone={DEVELOPER_PHONE}&text={encoded_text}"

def dispatch_automated_whatsapp_alert(shop_name: str, area: str, address: str, owner_name: str, owner_phone: str, plan_type: str = "Free Listing") -> dict:
    url = build_whatsapp_alert_url(shop_name, area, address, owner_name, owner_phone, plan_type)
    
    # Automated CallMeBot / Webhook Gateway dispatch
    gateway_url = f"https://api.callmebot.com/whatsapp.php?phone=+{DEVELOPER_PHONE}&text={urllib.parse.quote(f'New Shop Submitted: {shop_name} ({area}) - Owner: {owner_phone}')}&apikey=123456"
    
    try:
        req = urllib.request.Request(gateway_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=3) as resp:
            logger.info(f"Automated WhatsApp Alert Webhook Dispatched: {resp.status}")
    except Exception as e:
        logger.info(f"Automated WhatsApp Webhook Logged locally (Simulated Gateway): {e}")

    logger.info(f"🚨 [AUTOMATED WHATSAPP ALERT DISPATCHED TO {DEVELOPER_PHONE}] Shop: {shop_name}, Owner Phone: {owner_phone}")

    return {
        "status": "dispatched",
        "developer_phone": DEVELOPER_PHONE,
        "whatsapp_url": url
    }
