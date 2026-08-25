import re
import json
import os
from collections import Counter
import emoji

PATTERNS = [
    r"^\[(\d{1,4}[-/\.]\d{1,2}[-/\.]\d{1,4}),?\s*(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[APap][Mm])?)\]\s*([^:]+?):\s*(.*)$",
    r"^(\d{1,4}[-/\.]\d{1,2}[-/\.]\d{1,4}),?\s*(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[APap][Mm])?)\s*-\s*([^:]+?):\s*(.*)$",
    r"^(\d{1,4}\.\d{1,2}\.\d{1,4}),?\s*(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[APap][Mm])?)\s*-\s*([^:]+?):\s*(.*)$",
]

STOP_WORDS = {
    "the", "to", "and", "a", "in", "it", "is", "i", "that", "you", "for", "on", "my", "of", "me",
    "with", "at", "this", "be", "so", "have", "was", "but", "not", "your", "are", "from", "as",
    "if", "all", "they", "we", "he", "she", "what", "or", "an", "will", "by", "do", "how", "up",
    "out", "about", "no", "just", "like", "get", "got", "can", "ur", "u", "im", "dont", "hai",
    "k", "ki", "ka", "ko", "se", "ho", "bhi", "tha", "thi", "kar", "ke", "par", "omitted", "media",
    "image", "audio", "video", "sticker", "attached"
}

def clean_line(text):
    return re.sub(r"[\u200e\u200f\u202a-\u202e\u202f\xa0]", " ", text)

def extract_hour(time_str):
    time_str = time_str.strip().lower()
    is_pm = "pm" in time_str
    is_am = "am" in time_str
    time_clean = re.sub(r"[apm\s]", "", time_str)
    parts = time_clean.split(":")
    hour = int(parts[0])
    
    if is_pm and hour < 12:
        hour += 12
    elif is_am and hour == 12:
        hour = 0
    return hour

def parse_whatsapp(file_path):
    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        lines = f.readlines()

    messages = []
    current_msg = None

    for raw_line in lines:
        line = clean_line(raw_line).strip()
        if not line:
            continue

        matched = False
        for pattern in PATTERNS:
            match = re.match(pattern, line)
            if match:
                if current_msg:
                    messages.append(current_msg)
                date, time, sender, text = match.groups()
                current_msg = {
                    "date": date.strip(),
                    "time": time.strip(),
                    "sender": sender.strip(),
                    "text": text.strip()
                }
                matched = True
                break

        if not matched and current_msg:
            current_msg["text"] += "\n" + line

    if current_msg:
        messages.append(current_msg)

    return messages

def analyze_chat(messages):
    total_messages = len(messages)
    total_calls = 0
    total_media = 0
    senders = Counter()
    total_words = Counter()
    emojis_used = {}
    words_used = {}
    daily_messages = Counter()
    hourly_distribution = Counter()
    night_chats = Counter()
    day_chats = Counter()

    for msg in messages:
        sender = msg["sender"]
        text = msg["text"]
        date = msg["date"]
        time_str = msg["time"]

        # Call & Media Detection
        if any(call_keyword in text.lower() for call_keyword in ["call", "missed voice call", "missed video call", "video call"]):
            total_calls += 1

        if any(media_keyword in text.lower() for media_keyword in ["omitted", "image omitted", "video omitted", "audio omitted", "sticker omitted", "attached"]):
            total_media += 1

        senders[sender] += 1
        daily_messages[date] += 1
        
        try:
            hour = extract_hour(time_str)
            hourly_distribution[hour] += 1
            if hour >= 22 or hour <= 5:
                night_chats[sender] += 1
            else:
                day_chats[sender] += 1
        except Exception:
            pass

        clean_text = re.sub(r"[^\w\s]", "", text.lower())
        words = clean_text.split()
        total_words[sender] += len(words)

        if sender not in words_used:
            words_used[sender] = Counter()
            emojis_used[sender] = Counter()

        for w in words:
            if w not in STOP_WORDS and len(w) > 2:
                words_used[sender][w] += 1

        for e in [c for c in text if emoji.is_emoji(c)]:
            emojis_used[sender][e] += 1

    participants = [s for s in senders.keys() if not s.endswith("changed the subject") and "omitted" not in s]

    peak_hour = hourly_distribution.most_common(1)[0][0] if hourly_distribution else 12
    peak_hour_str = f"{(peak_hour % 12) or 12}:00 {'PM' if peak_hour >= 12 else 'AM'}"

    start_date = messages[0]["date"] if messages else "N/A"
    end_date = messages[-1]["date"] if messages else "N/A"

    stats = {
        "summary": {
            "start_date": start_date,
            "end_date": end_date,
            "total_messages": total_messages,
            "total_media": total_media,
            "total_calls": total_calls,
            "total_days_active": len(daily_messages),
            "top_chat_date": daily_messages.most_common(1)[0] if daily_messages else ("N/A", 0),
            "peak_hour": peak_hour_str,
        },
        "participants": {}
    }

    for p in participants:
        msg_count = senders[p]
        word_count = total_words[p]
        top_emojis = [e for e, _ in emojis_used[p].most_common(5)] if p in emojis_used else []
        top_words = [w for w, _ in words_used[p].most_common(5)] if p in words_used else []

        stats["participants"][p] = {
            "messages": msg_count,
            "percentage": round((msg_count / total_messages) * 100, 1) if total_messages else 0,
            "total_words": word_count,
            "avg_words_per_msg": round(word_count / msg_count, 1) if msg_count else 0,
            "top_emojis": top_emojis,
            "top_words": top_words,
            "night_owl_msgs": night_chats[p],
            "day_msgs": day_chats[p]
        }

    return stats

def find_input_file():
    possible_names = ["Sample_chat.txt", "sample_chat.txt", "_chat.txt", "chat.txt"]
    search_paths = [
        os.getcwd(),
        os.path.abspath(os.path.join(os.getcwd(), "..")),
        os.path.abspath(os.path.join(os.getcwd(), "Wrapped Project"))
    ]
    for path in search_paths:
        for name in possible_names:
            full_path = os.path.join(path, name)
            if os.path.exists(full_path):
                return full_path
    return None

def run():
    input_file = find_input_file()
    if not input_file:
        print("[-] Error: Chat file not found.")
        return

    base_dir = os.path.dirname(input_file)
    output_dir = os.path.join(base_dir, "Web")
    os.makedirs(output_dir, exist_ok=True)
    output_file = os.path.join(output_dir, "data.json")

    print(f"[+] Found input file: {input_file}")
    messages = parse_whatsapp(input_file)
    print(f"[+] Parsed {len(messages)} total items. Analyzing metrics...")

    stats = analyze_chat(messages)

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(stats, f, indent=2, ensure_ascii=False)

    print(f"[✓] Updated {output_file} with full message count ({stats['summary']['total_messages']})!")

if __name__ == "__main__":
    run()