import os

file_path = "/home/aviinyou07/Projects/index-exchange/src/components/admin/AdminDashboard.tsx"
with open(file_path, "r") as f:
    content = f.read()

# 1. Update fetchData to call setLoading(false)
fetch_data_target = """        });
      }
    } catch (err) {
      console.error("Toggle bank error:", err);
    }
  };"""

fetch_data_replacement = """        });
      }
    } catch (err) {
      console.error("Fetch data error:", err);
    } finally {
      setLoading(false);
      if (isManualRefresh) setRefreshing(false);
    }
  };"""
content = content.replace(fetch_data_target, fetch_data_replacement)

# 2. Add loading state UI at the top of the return statement
return_target = """  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-[#31A9F6]/30 selection:text-white flex flex-col md:flex-row overflow-hidden relative">"""

return_replacement = """  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-800 border-t-[#31A9F6] rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 bg-slate-900 rounded-full"></div>
          </div>
        </div>
        <div className="text-slate-400 font-bold uppercase tracking-widest text-sm animate-pulse">Loading Platform Data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-[#31A9F6]/30 selection:text-white flex flex-col md:flex-row overflow-hidden relative">"""
content = content.replace(return_target, return_replacement)

with open(file_path, "w") as f:
    f.write(content)

print("Loading state added.")
