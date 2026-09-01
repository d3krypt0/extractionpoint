import fitz

doc = fitz.open('EXT - Menu.pdf')

for page_idx in range(len(doc)):
    page = doc[page_idx]
    print(f"=== PAGE {page_idx + 1} ===")
    lines = [line.strip() for line in page.get_text().split('\n') if line.strip()]
    for l in lines:
        print("  ", l)
