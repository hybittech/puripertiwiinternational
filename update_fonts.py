import re
import os

with open("css/fonts.css", "r", encoding="utf-8") as f:
    css = f.read()

# Define patterns to match only Latin subset src URLs
# Usually Google Fonts CSS has sections like /* latin */
# Example: /* latin */\n@font-face { ... src: url(https://...woff2) ... }

def replace_urls(match):
    url = match.group(1)
    filename = os.path.basename(url)
    return f'url(../assets/fonts/{filename})'

# This pattern looks for urls inside font-face blocks
updated_css = re.sub(r'url\((https?://.*?)\)', replace_urls, css)

with open("css/fonts.css", "w", encoding="utf-8") as f:
    f.write(updated_css)

print("fonts.css updated with local paths.")
