import zipfile
import xml.etree.ElementTree as ET

z = zipfile.ZipFile(r'c:\Users\asus\Desktop\my project\ahmed-trader-\assets\book_background.docx')
c = z.read('word/document.xml')
t = ET.fromstring(c)
ns = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
ps = []
for p in t.iter(ns + 'p'):
    tx = ''.join([r.text for r in p.iter(ns + 't') if r.text])
    if tx:
        ps.append(tx)

print(f'Total paragraphs: {len(ps)}')
for i, p in enumerate(ps):
    if 'الفصل' in p:
        print(f'Line {i}: {p[:120]}')
