import os
import re

def remove_from_file(filepath):
    if not os.path.exists(filepath): return
    with open(filepath, 'r') as f:
        content = f.read()

    # Generic replaces
    content = re.sub(r',\s*"TRX"', '', content)
    content = re.sub(r'"TRX",\s*', '', content)
    content = re.sub(r',\s*"BNB"', '', content)
    content = re.sub(r'"BNB",\s*', '', content)
    content = re.sub(r'\|\s*"TRX"\s*', '', content)
    content = re.sub(r'\|\s*"BNB"\s*', '', content)
    content = re.sub(r'\s*trxBalance:\s*number;', '', content)
    content = re.sub(r'\s*bnbBalance:\s*number;', '', content)
    
    with open(filepath, 'w') as f:
        f.write(content)

files_to_clean = [
    "src/models/Transaction.ts",
    "src/app/api/user/deposit/route.ts",
    "src/app/dashboard/page.tsx",
    "src/app/sell/page.tsx",
    "src/app/transfer/page.tsx",
]

for f in files_to_clean:
    remove_from_file(f)

