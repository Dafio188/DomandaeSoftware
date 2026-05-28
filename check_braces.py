import sys

def check_braces(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    stack = []
    for i, char in enumerate(content):
        if char == '{':
            stack.append(i)
        elif char == '}':
            if not stack:
                print(f"Extra closing brace at index {i}")
                # Print context
                start = max(0, i - 50)
                end = min(len(content), i + 50)
                print(f"Context: {content[start:end]}")
            else:
                stack.pop()
    
    if stack:
        for pos in stack:
            print(f"Unclosed opening brace at index {pos}")
            start = max(0, pos - 50)
            end = min(len(content), pos + 50)
            print(f"Context: {content[start:end]}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        check_braces(sys.argv[1])
    else:
        print("Usage: python check_braces.py <filename>")
