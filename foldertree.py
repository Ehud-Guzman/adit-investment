import os

# Folders to ignore
IGNORE_DIRS = {"node_modules", ".git", "dist", "build", "assets", "images"}
OUTPUT_FILE = r"C:\Users\nyamu\Desktop\adit-investment-folder-structure.txt"

def get_tree_lines(root_dir, prefix=""):
    lines = []
    items = sorted([i for i in os.listdir(root_dir) if i not in IGNORE_DIRS])
    for index, item in enumerate(items):
        path = os.path.join(root_dir, item)
        connector = "└── " if index == len(items) - 1 else "├── "
        lines.append(prefix + connector + item)
        if os.path.isdir(path):
            extension = "    " if index == len(items) - 1 else "│   "
            lines.extend(get_tree_lines(path, prefix + extension))
    return lines

if __name__ == "__main__":
    root_path = r"C:\Users\nyamu\Desktop\GlimmerInk Creations\Websites\adit-investment"
    tree_lines = [root_path] + get_tree_lines(root_path)
    
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write("\n".join(tree_lines))
    
    print(f"✅ Folder structure saved to {OUTPUT_FILE}")
