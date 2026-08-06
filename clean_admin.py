import os
import re

filepath = "src/components/admin/AdminDashboard.tsx"
if not os.path.exists(filepath):
    exit()

with open(filepath, 'r') as f:
    content = f.read()

# Remove from balanceAsset type
content = re.sub(r' \| "TRX" \| "BNB"', '', content)

# Remove TRX and BNB Balance cards (lines ~977-997)
content = re.sub(r'\s*\{\/\*\s*TRX\s*\*\/\}.*?TRX\s*</div>\s*</div>', '', content, flags=re.DOTALL)
content = re.sub(r'\s*\{\/\*\s*BNB\s*\*\/\}.*?BNB\s*</div>\s*</div>', '', content, flags=re.DOTALL)

# Remove from table headers
content = re.sub(r'<th className="p-3.5">TRX / BNB</th>', '', content)

# Remove from table body
content = re.sub(r'\{u\.wallet\?\.trxBalance \|\| 0\} TRX \| \{u\.wallet\?\.bnbBalance \|\| 0\} BNB', '', content)

# Remove from Pools (lines ~1334-1343)
content = re.sub(r'<div className="text-xs text-slate-400 font-semibold mb-1">TRX Pool</div>.*?TRX\s*</div>', '', content, flags=re.DOTALL)
content = re.sub(r'<div className="text-xs text-slate-400 font-semibold mb-1">BNB Pool</div>.*?BNB\s*</div>', '', content, flags=re.DOTALL)

# Remove TRX and BNB Rate inputs (lines ~1427-1483)
content = re.sub(r'\s*\{\/\*\s*TRX\s*\*\/\}.*?</div>\s*</div>\s*</div>', '', content, flags=re.DOTALL)
content = re.sub(r'\s*\{\/\*\s*BNB\s*\*\/\}.*?</div>\s*</div>\s*</div>', '', content, flags=re.DOTALL)

# Remove from options
content = re.sub(r'<option value="TRX">TRX</option>', '', content)
content = re.sub(r'<option value="BNB">BNB</option>', '', content)

with open(filepath, 'w') as f:
    f.write(content)

# Clean up api/admin/stats/route.ts
stats_file = "src/app/api/admin/stats/route.ts"
if os.path.exists(stats_file):
    with open(stats_file, 'r') as f:
        stats_content = f.read()
    stats_content = re.sub(r'let totalTRXBalance = 0;\n\s*let totalBNBBalance = 0;\n', '', stats_content)
    stats_content = re.sub(r'totalTRXBalance \+= w\.trxBalance \|\| 0;\n\s*totalBNBBalance \+= w\.bnbBalance \|\| 0;\n', '', stats_content)
    stats_content = re.sub(r'trx: totalTRXBalance,\n\s*bnb: totalBNBBalance,', '', stats_content)
    with open(stats_file, 'w') as f:
        f.write(stats_content)

# Clean up api/admin/users/balance/route.ts
balance_file = "src/app/api/admin/users/balance/route.ts"
if os.path.exists(balance_file):
    with open(balance_file, 'r') as f:
        balance_content = f.read()
    balance_content = re.sub(r'TRX: "trxBalance",\n\s*BNB: "bnbBalance",', '', balance_content)
    with open(balance_file, 'w') as f:
        f.write(balance_content)
