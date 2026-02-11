import os

# --- CONFIGURATION ---
OUTPUT_FILE = "sentrion_full_context.txt"

# Folders to completely ignore
IGNORE_DIRS = {
    "__pycache__", "venv", "env", ".git", ".idea", ".vscode", 
    "node_modules", "scan_results", "postgres_data", "redis_data",
    "minio_data", "scannable_projects", "node_modules"
}

# Files to ignore
IGNORE_FILES = {
    "context_dumper.py", "package-lock.json", "yarn.lock", ".DS_Store",
    "sentrion_full_context.txt"
}

# Extensions to include (so we don't dump binary files like images)
INCLUDE_EXTENSIONS = {
    ".py", ".yml", ".yaml", ".json", ".md", ".txt", ".env", 
    ".Dockerfile", "Dockerfile", ".sh", ".conf", ".sql", ".tsx", ".css", ".ts", ".html", ".js"
}

def is_text_file(filename):
    return any(filename.endswith(ext) or filename == ext for ext in INCLUDE_EXTENSIONS)

def dump_codebase():
    with open(OUTPUT_FILE, "w", encoding="utf-8") as out:
        out.write(f"# SENTRION PROJECT CONTEXT DUMP\n")
        out.write(f"# Generated for Gemini Analysis\n\n")
        
        for root, dirs, files in os.walk("."):
            # Modify dirs in-place to skip ignored directories
            dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
            
            for file in files:
                if file in IGNORE_FILES:
                    continue
                
                if not is_text_file(file) and "Dockerfile" not in file:
                    continue
                
                file_path = os.path.join(root, file)
                # Normalize path separators
                rel_path = os.path.relpath(file_path, ".")
                
                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        content = f.read()
                        
                    out.write(f"\n{'='*60}\n")
                    out.write(f"FILE PATH: {rel_path}\n")
                    out.write(f"{'='*60}\n")
                    out.write(content + "\n")
                    print(f"Processed: {rel_path}")
                    
                except Exception as e:
                    print(f"Skipping {rel_path} (Read Error: {e})")

    print(f"\nDone! Upload '{OUTPUT_FILE}' to the chat.")

if __name__ == "__main__":
    dump_codebase()