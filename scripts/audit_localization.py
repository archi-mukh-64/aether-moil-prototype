import os
import re
import json

FRONTEND_SRC = "frontend/src"

# Regular expression to find JSX text nodes or obvious hardcoded UI strings
# e.g., >Text<, placeholder="Text", title="Text", label="Text"
JSX_TEXT_REGEX = re.compile(r'>\s*([A-Za-z][A-Za-z0-9\s,\.\-\(\)\:\'\?\!\/]{3,})\s*<')

def audit_directory():
    suspicious_files = {}
    total_files = 0
    total_matches = 0

    for root, dirs, files in os.walk(FRONTEND_SRC):
        for f in files:
            if f.endswith('.jsx') or f.endswith('.js'):
                # Skip translations.js and test files
                if 'translations.js' in f or 'mock' in f or 'apiClient' in f:
                    continue
                total_files += 1
                fpath = os.path.join(root, f)
                with open(fpath, 'r', encoding='utf-8') as file_content:
                    lines = file_content.readlines()
                
                file_matches = []
                for idx, line in enumerate(lines, 1):
                    # Ignore import lines, console logs, comments
                    trimmed = line.strip()
                    if trimmed.startswith('import ') or trimmed.startswith('//') or trimmed.startswith('/*') or 'console.' in trimmed:
                        continue
                    
                    matches = JSX_TEXT_REGEX.findall(line)
                    for m in matches:
                        # Skip if it looks like technical id or variable
                        m_clean = m.strip()
                        if m_clean in ['div', 'span', 'strong', 'button', 'p', 'h1', 'h2', 'h3', 'h4', 'ul', 'li', 'td', 'th', 'tr', 'table']:
                            continue
                        if not any(c.isalpha() for c in m_clean):
                            continue
                        # Skip if it's already curly braced or translation call
                        if '{' in line and '}' in line and ('t.' in line or 'lang ===' in line):
                            continue
                        file_matches.append((idx, m_clean, line.strip()))
                
                if file_matches:
                    suspicious_files[fpath] = file_matches
                    total_matches += len(file_matches)

    print(f"Audited {total_files} frontend files.")
    print(f"Found {len(suspicious_files)} files with potential hardcoded text ({total_matches} occurrences).\n")
    for fpath, matches in sorted(suspicious_files.items(), key=lambda x: len(x[1]), reverse=True):
        rel = os.path.relpath(fpath, FRONTEND_SRC)
        print(f"File: {rel} ({len(matches)} occurrences)")
        for line_no, text, full_line in matches[:5]:
            print(f"   Line {line_no}: '{text}' -> {full_line[:80]}")
        if len(matches) > 5:
            print(f"   ... and {len(matches) - 5} more")
        print()

if __name__ == '__main__':
    audit_directory()
