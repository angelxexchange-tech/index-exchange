import os

file_path = "/home/aviinyou07/Projects/index-exchange/src/components/admin/AdminDashboard.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Replace activeTab useState to include localStorage persistence hooks
target = """export default function AdminDashboard({ adminUser, onLogout }: AdminDashboardProps) {
  // Navigation tab state
  const [activeTab, setActiveTab] = useState<
    "overview" | "users" | "deposits" | "withdrawals" | "transactions" | "wallets" | "rates" | "limits" | "depositSettings" | "settings"
  >("overview");"""

replacement = """export default function AdminDashboard({ adminUser, onLogout }: AdminDashboardProps) {
  // Navigation tab state
  const [activeTab, setActiveTab] = useState<
    "overview" | "users" | "deposits" | "withdrawals" | "transactions" | "wallets" | "rates" | "limits" | "depositSettings" | "settings"
  >("overview");

  // Load last active tab from localStorage on mount
  useEffect(() => {
    const savedTab = localStorage.getItem("adminActiveTab");
    if (savedTab) {
      setActiveTab(savedTab as any);
    }
  }, []);

  // Save active tab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("adminActiveTab", activeTab);
  }, [activeTab]);"""

content = content.replace(target, replacement)

with open(file_path, "w") as f:
    f.write(content)

print("Active tab persistence added.")
