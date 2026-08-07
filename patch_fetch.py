import os

file_path = "/home/aviinyou07/Projects/index-exchange/src/components/admin/AdminDashboard.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Fix fetch calls in fetchData
target_fetch = """      // 1. Stats & recent activity
      const statsRes = await fetch("/api/admin/stats");
      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats(statsData.stats);
      }

      // 2. Users list
      const usersRes = await fetch("/api/admin/users");
      const usersData = await usersRes.json();
      if (usersData.success) {
        setUsers(usersData.users || []);
      }

      // 3. Transactions list
      const txnRes = await fetch("/api/admin/transactions");
      const txnData = await txnRes.json();
      if (txnData.success) {
        setTransactions(txnData.transactions || []);
      }

      // 4. Exchange rates
      const ratesRes = await fetch("/api/rates");
      const ratesData = await ratesRes.json();
      if (ratesData.success && ratesData.rates) {
        setRates(ratesData.rates);
      }

      // 5. Withdrawal limits
      const limitsRes = await fetch("/api/withdrawal-settings");
"""

replacement_fetch = """      // 1. Stats & recent activity
      const statsRes = await fetch("/api/admin/stats", { cache: "no-store" });
      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats(statsData.stats);
      }

      // 2. Users list
      const usersRes = await fetch("/api/admin/users", { cache: "no-store" });
      const usersData = await usersRes.json();
      if (usersData.success) {
        setUsers(usersData.users || []);
      }

      // 3. Transactions list
      const txnRes = await fetch("/api/admin/transactions", { cache: "no-store" });
      const txnData = await txnRes.json();
      if (txnData.success) {
        setTransactions(txnData.transactions || []);
      }

      // 4. Exchange rates
      const ratesRes = await fetch("/api/rates", { cache: "no-store" });
      const ratesData = await ratesRes.json();
      if (ratesData.success && ratesData.rates) {
        setRates(ratesData.rates);
      }

      // 5. Withdrawal limits
      const limitsRes = await fetch("/api/withdrawal-settings", { cache: "no-store" });
"""

content = content.replace(target_fetch, replacement_fetch)

# Also fix the loading state render to only show loading in the main body area instead of fullscreen
# Because if it's fullscreen, it causes a layout shift (sidebar disappears and reappears).
# The user might prefer if the layout stays and just the content is a loader.
# But actually, fullscreen is fine if it actually shows. I will just fix the cache.

with open(file_path, "w") as f:
    f.write(content)

print("Fetch cache fixed.")
