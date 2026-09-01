import fitz
import re

with open('src/data/menuData.ts', 'r', encoding='utf-8') as f:
    ts_code = f.read()

# Match each object in MENU_ITEMS
item_blocks = re.findall(r'{\s*id:\s*[\'"][^\'"]+[\'"],\s*name:\s*[\'"]([^\'"]+)[\'"],\s*category:\s*[\'"]([^\'"]+)[\'"],\s*group:\s*[\'"]([^\'"]+)[\'"],\s*price:\s*(\d+)', ts_code)

print(f"Total items in menuData.ts: {len(item_blocks)}")
for name, cat, group, price in item_blocks:
    print(f"  {name:30} | {cat:16} | PHP {price}")

# Check PDF items list
doc = fitz.open('EXT - Menu.pdf')
full_pdf_text = ""
for p in doc:
    full_pdf_text += p.get_text() + "\n"

print("\n--- Checking for missing or extraneous items ---")
missing_in_pdf = []
for name, cat, group, price in item_blocks:
    # Clean name for search
    clean_name = name.replace("'", "").replace("’", "").strip()
    if clean_name.upper() not in full_pdf_text.upper():
        missing_in_pdf.append(name)

print("Items in TS not found in PDF:", missing_in_pdf)
