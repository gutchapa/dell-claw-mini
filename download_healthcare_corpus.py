#!/usr/bin/env python3
"""Download healthcare document corpus for RAG ingestion"""
import os
import urllib.request
import json

WORKSPACE = '/home/dell/.openclaw/workspace'
DOCS_DIR = f'{WORKSPACE}/user-docs-rag/docs/healthcare'

def download_cord19_sample():
    """Download CORD-19 (COVID-19) dataset sample"""
    print("📥 Downloading CORD-19 healthcare corpus...")
    os.makedirs(DOCS_DIR, exist_ok=True)
    
    # CORD-19 metadata CSV contains ~200k articles
    url = "https://ai2-semanticscholar-cord-19.s3-us-west-2.amazonaws.com/2020-11-25/metadata.csv"
    output_file = f"{DOCS_DIR}/cord19_metadata.csv"
    
    try:
        urllib.request.urlretrieve(url, output_file)
        print(f"✅ Downloaded: {output_file}")
        
        # Parse and create sample documents
        with open(output_file, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        print(f"📊 Total entries: {len(lines)}")
        
        # Create document samples from first 1000 entries
        for i, line in enumerate(lines[1:1001]):  # Skip header, take 1000
            parts = line.split(',')
            if len(parts) > 10:
                title = parts[4] if len(parts) > 4 else f"Doc_{i}"
                abstract = parts[10] if len(parts) > 10 else ""
                
                # Create markdown file
                doc_file = f"{DOCS_DIR}/cord19_doc_{i:04d}.md"
                with open(doc_file, 'w') as f:
                    f.write(f"# {title}\n\n")
                    f.write(f"## Abstract\n\n{abstract}\n\n")
                    f.write(f"## Source\nCORD-19 Dataset\n")
                
                if i % 100 == 0:
                    print(f"  Created {i} documents...")
        
        print(f"✅ Created 1000 healthcare documents in {DOCS_DIR}")
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    download_cord19_sample()
