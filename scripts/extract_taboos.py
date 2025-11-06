#!/usr/bin/env python3
"""
Extract taboos from the Individual taboos onepagers text file
"""
import json
import re

# Level mappings
LEVEL_NAMES = {
    1: "Personal Workflow Preferences",
    2: "Collaboration & Role Adjustments",
    3: "Professional Trust & Fairness Issues",
    4: "Career Security & Job Redefinition Anxiety",
    5: "Organizational Stability at Risk"
}

def clean_text(text):
    """Clean and normalize text"""
    return ' '.join(text.split()).strip()

def extract_taboos(file_path):
    """Extract all taboos from the text file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split into individual taboo blocks by looking for the pattern:
    # Name (capitalized word/phrase)
    # Short description
    # Description...

    # First, split by double newlines to get rough blocks
    blocks = re.split(r'\n\s*\n+', content)

    taboos = []
    i = 0

    while i < len(blocks):
        block = blocks[i].strip()

        # Skip empty blocks
        if not block:
            i += 1
            continue

        # Check if this block starts a new taboo
        # It should be a short line (name) followed by the content
        lines = block.split('\n')
        first_line = lines[0].strip() if lines else ''

        # Check if first line looks like a taboo name (short, capitalized, not a section header)
        if first_line and len(first_line) < 100 and first_line[0].isupper() and \
           not first_line.startswith('Description') and \
           not first_line.startswith('How ') and \
           not first_line.startswith('Possible') and \
           not first_line.startswith('Level') and \
           not first_line.startswith('(') and \
           not first_line.startswith('To '):

            # This is likely a taboo name
            taboo_name = first_line

            # Next line should be the short description
            short_desc = lines[1].strip() if len(lines) > 1 else ''

            # Collect all following blocks until we hit the next taboo
            taboo_blocks = [block]
            j = i + 1
            while j < len(blocks):
                next_block = blocks[j].strip()
                next_lines = next_block.split('\n')
                next_first_line = next_lines[0].strip() if next_lines else ''

                # Check if this is a new taboo
                if next_first_line and len(next_first_line) < 100 and \
                   next_first_line[0].isupper() and \
                   not next_first_line.startswith('Description') and \
                   not next_first_line.startswith('How ') and \
                   not next_first_line.startswith('Possible') and \
                   not next_first_line.startswith('Level') and \
                   not next_first_line.startswith('(') and \
                   not next_first_line.startswith('To ') and \
                   len(next_lines) > 1:
                    # This looks like a new taboo, stop collecting
                    break

                taboo_blocks.append(next_block)
                j += 1

            # Parse the collected blocks for this taboo
            full_content = '\n\n'.join(taboo_blocks)

            # Extract description
            desc_match = re.search(r'Description\s*(.*?)(?=How It Shows Up|Possible Actions|Level|\(AI |\(People |$)', full_content, re.DOTALL)
            description = clean_text(desc_match.group(1)) if desc_match else ''

            # Extract "How It Shows Up"
            shows_up_match = re.search(r'How It Shows Up[^.]*?(.*?)(?=Possible Actions|To address|To reduce|To mitigate|Addressing|Level|\(AI |\(People |$)', full_content, re.DOTALL)
            how_it_shows_up = clean_text(shows_up_match.group(1)) if shows_up_match else ''

            # Extract "Possible Actions"
            actions_match = re.search(r'(?:Possible Actions to Take|To address|To reduce|To mitigate|Addressing)\s*(.*?)(?=Level|\(AI |\(People |$)', full_content, re.DOTALL)
            possible_actions = clean_text(actions_match.group(1)) if actions_match else ''

            # Extract Level
            level_match = re.search(r'Level (\d+):\s*([^T(]+)', full_content)
            level = int(level_match.group(1)) if level_match else 0
            level_name = LEVEL_NAMES.get(level, '')

            # Extract level explanation (text after level name)
            level_exp_match = re.search(r'Level \d+: [^T(]+(.*?)(?=\(AI |\(People |$)', full_content, re.DOTALL)
            level_explanation = clean_text(level_exp_match.group(1)) if level_exp_match else ''

            # Extract root cause - try multiple patterns
            root_cause = ''
            root_cause_match = re.search(r'\((AI [^)]+)\)', full_content)
            if root_cause_match:
                root_cause = root_cause_match.group(1)
            else:
                # Try lowercase version
                people_match = re.search(r'\((People prefer human interaction)\)', full_content)
                if people_match:
                    root_cause = people_match.group(1)
                else:
                    # Try capitalized version
                    people_match_cap = re.search(r'\((People Prefer Human Interaction)\)', full_content)
                    if people_match_cap:
                        root_cause = 'People prefer human interaction'  # Normalize to lowercase

            # Extract root cause explanation
            root_cause_explanation = ''
            if root_cause:
                # The explanation is the text after the root cause parenthesis
                # Try exact match first
                root_exp_match = re.search(r'\(' + re.escape(root_cause) + r'\)\s*(.*?)$', full_content, re.DOTALL)
                if root_exp_match:
                    root_cause_explanation = clean_text(root_exp_match.group(1))
                else:
                    # Try case-insensitive match for "People prefer human interaction"
                    if 'people prefer human interaction' in root_cause.lower():
                        alt_match = re.search(r'\(People [Pp]refer [Hh]uman [Ii]nteraction\)\s*(.*?)$', full_content, re.DOTALL)
                        if alt_match:
                            root_cause_explanation = clean_text(alt_match.group(1))

            taboo = {
                'name': taboo_name,
                'short_description': short_desc,
                'description': description,
                'how_it_shows_up': how_it_shows_up,
                'possible_actions': possible_actions,
                'level': level,
                'level_name': level_name,
                'root_cause': root_cause,
                'root_cause_explanation': root_cause_explanation
            }

            taboos.append(taboo)

            # Move to the next unprocessed block
            i = j
        else:
            i += 1

    return taboos

def main():
    input_file = '/Users/Dev/Desktop/ainavigator/data/20250504 - 004 - Individual taboos onepagers.txt'
    output_file = '/Users/Dev/Desktop/ainavigator/data/taboos_extracted.json'

    print(f"Extracting taboos from {input_file}...")
    taboos = extract_taboos(input_file)

    print(f"Extracted {len(taboos)} taboos")

    # Validate data
    missing_root_cause = [t['name'] for t in taboos if not t.get('root_cause')]
    missing_description = [t['name'] for t in taboos if not t.get('description')]

    if missing_root_cause:
        print(f"\n⚠️  Warning: {len(missing_root_cause)} taboos missing root cause")
    if missing_description:
        print(f"\n⚠️  Warning: {len(missing_description)} taboos missing description")

    # Save to JSON
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(taboos, f, indent=2, ensure_ascii=False)

    print(f"\nSaved to {output_file}")

    # Statistics
    print(f"\n📊 Statistics:")
    print(f"   Total taboos: {len(taboos)}")

    level_counts = {}
    for t in taboos:
        level = t.get('level', 0)
        level_counts[level] = level_counts.get(level, 0) + 1

    print(f"\n   By Level:")
    for level in sorted(level_counts.keys()):
        name = LEVEL_NAMES.get(level, 'Unknown')
        print(f"     Level {level} ({name}): {level_counts[level]}")

    root_cause_counts = {}
    for t in taboos:
        rc = t.get('root_cause', 'Missing')
        if not rc:
            rc = 'Missing'
        root_cause_counts[rc] = root_cause_counts.get(rc, 0) + 1

    print(f"\n   By Root Cause:")
    for rc in sorted(root_cause_counts.keys()):
        print(f"     {rc}: {root_cause_counts[rc]}")

    # Print sample
    print("\n📝 Sample (first taboo - Adaptation):")
    if taboos:
        t = taboos[0]
        print(f"   Name: {t['name']}")
        print(f"   Short: {t['short_description']}")
        print(f"   Level: {t['level']} - {t['level_name']}")
        print(f"   Root Cause: {t['root_cause']}")
        print(f"   Description: {t['description'][:150]}...")

if __name__ == '__main__':
    main()
