#!/usr/bin/env python3
"""Generate synthetic healthcare document corpus for RAG testing"""
import os
import random

WORKSPACE = '/home/dell/.openclaw/workspace'
DOCS_DIR = f'{WORKSPACE}/user-docs-rag/docs/healthcare'

# Sample medical conditions and content templates
CONDITIONS = [
    ("Diabetes Mellitus Type 2", "A chronic condition affecting glucose metabolism"),
    ("Hypertension", "High blood pressure requiring management"),
    ("Asthma", "Respiratory condition with airway inflammation"),
    ("COVID-19", "Viral respiratory infection caused by SARS-CoV-2"),
    ("Influenza", "Viral infection affecting respiratory system"),
    ("Pneumonia", "Lung infection causing inflammation of air sacs"),
    ("Myocardial Infarction", "Heart attack due to blocked blood flow"),
    ("Stroke", "Brain attack from interrupted blood supply"),
    ("Arthritis", "Joint inflammation causing pain and stiffness"),
    ("Migraine", "Neurological condition with severe headaches"),
]

TREATMENTS = [
    "Lifestyle modifications including diet and exercise",
    "Pharmacological intervention with regular monitoring",
    "Surgical intervention when conservative treatments fail",
    "Combination therapy approach with patient education",
    "Preventive care and early detection protocols",
]

def generate_document(doc_id):
    """Generate a synthetic medical document"""
    condition, description = random.choice(CONDITIONS)
    treatment = random.choice(TREATMENTS)
    
    content = f"""# {condition}

## Overview
{description}. This condition affects millions of patients worldwide and requires comprehensive care approaches.

## Symptoms
- Primary symptom 1 with severity indicator
- Secondary symptom affecting daily activities
- Associated complications requiring monitoring
- Warning signs requiring immediate attention

## Diagnosis
Diagnostic procedures include clinical examination, laboratory tests, and imaging studies. Early detection improves patient outcomes significantly.

## Treatment
{treatment}. Treatment plans should be individualized based on patient factors including age, comorbidities, and response to previous interventions.

## Prognosis
With appropriate management, most patients achieve good outcomes. Regular follow-up care is essential for monitoring disease progression.

## References
- Medical Guidelines 2024
- Clinical Practice Standards
- Peer-reviewed research literature

---
Document ID: {doc_id:05d}
Category: Healthcare/Medical
Generated: Synthetic corpus for RAG testing
"""
    return content

def generate_corpus(num_docs=1000):
    """Generate corpus of healthcare documents"""
    print(f"📝 Generating {num_docs} healthcare documents...")
    os.makedirs(DOCS_DIR, exist_ok=True)
    
    for i in range(num_docs):
        content = generate_document(i)
        filename = f"{DOCS_DIR}/healthcare_doc_{i:05d}.md"
        
        with open(filename, 'w') as f:
            f.write(content)
        
        if (i + 1) % 100 == 0:
            print(f"  Generated {i + 1}/{num_docs} documents...")
    
    print(f"✅ Generated {num_docs} healthcare documents in {DOCS_DIR}")

if __name__ == "__main__":
    generate_corpus(1000)
