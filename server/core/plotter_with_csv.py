#THIS FILE IS KEPT AS LEGACY, BUT THE ACTUAL SCRIPT IS PLOTTER.PY

import os
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
import csv
from datetime import datetime

#THIS FILE IS KEPT AS LEGACY, BUT THE ACTUAL SCRIPT IS PLOTTER.PY

# --- 1. SETUP GLOBAL PATHS ---
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
timestamp = datetime.now().strftime("%Y-%m-%d_%H%M")
OUTPUT_DIR = os.path.join(SCRIPT_DIR, f"Plots_{timestamp}")

# Keywords to ignore sheets (case-insensitive)
SKIP_KEYWORDS = ["skip", "template", "notes", "archive"]

if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

# --- 2. REUSABLE FUNCTIONS ---

def get_csv_data(file_path, start_row, end_row, col_x, col_y):
    file_path = str(file_path).strip().replace('"', '').replace("'", "")
    if not os.path.isabs(file_path):
        file_path = os.path.join(SCRIPT_DIR, file_path)
    try:
        df = pd.read_csv(file_path, header=None, skiprows=start_row - 1,
                         nrows=end_row - start_row + 1)
        x = pd.to_numeric(df.iloc[:, col_x - 1], errors='coerce')
        y = pd.to_numeric(df.iloc[:, col_y - 1], errors='coerce')
        mask = x.notna() & y.notna()
        return x[mask].tolist(), y[mask].tolist()
    except Exception:
        return [], []

def process_and_plot(config_row):
    """Generates, formats, and saves a single graph. Symmetry logic removed."""
    plt.figure(figsize=(10, 7))

    # --- A. ENVELOPE DATA (TWO INDEPENDENT HALVES) ---
    # Fetch Half 1
    dx1, dy1 = get_csv_data(
        config_row['Diag_File'],
        int(config_row['Diag_Start']), int(config_row['Diag_End']),
        int(config_row['Diag_ColX']), int(config_row['Diag_ColY'])
    )

    # Fetch Half 2
    dx2, dy2 = get_csv_data(
        config_row['Diag_File'],
        int(config_row['Diag_Start']), int(config_row['Diag_End']),
        int(config_row['Diag_ColX2']), int(config_row['Diag_ColY2'])
    )

    # Console Debugging: Check if data is actually different
    if dx1 and dx2:
        print(f"    [Data Check] {config_row['Graph_Title']}:")
        print(f"      Side A X-range: {min(dx1):.1f} to {max(dx1):.1f}")
        print(f"      Side A Y-range: {min(dy1):.1f} to {max(dy1):.1f}")

    # Plotting Envelope (Black lines)
    if dx1 and dy1:
        plt.plot(dx1, dy1, color='k', linewidth=1.5, label=config_row.get('Diag_Label', 'Capacity'), zorder=1)

    if dx2 and dy2:
        # We plot the second half without a label to avoid duplicating 'Capacity' in the legend
        plt.plot(dx2, dy2, color='k', linewidth=1.5, zorder=1)

    # --- B. DATASET SCATTER PLOTS ---
    colors = ['red', 'green', 'blue', 'orange','lime','purple']
    for i in range(1, 7):
        p_path = config_row.get(f'File{i}_Path')
        if pd.notna(p_path):
            x, y = get_csv_data(
                p_path,
                int(config_row[f'File{i}_Start']), int(config_row[f'File{i}_End']),
                int(config_row[f'File{i}_ColX']), int(config_row[f'File{i}_ColY'])
            )
            if x:
                plt.scatter(x, y, color=colors[i-1], s=12,
                            label=config_row.get(f'File{i}_Label', f'Data {i}'),
                            alpha=0.8, zorder=2)

    # --- C. FORMATTING ---
    plt.xlabel('Bending Moment (kN*m/m)', fontsize=12)
    plt.ylabel('Normal Force (kN/m)', fontsize=12)

    # Title includes sheet name for easy identification
    plt.title(f"{config_row['Graph_Title']}", fontsize=14, fontweight='bold')

    # Flip Y-axis (Standard for Interaction Diagrams)
    plt.gca().invert_yaxis()

    plt.legend(loc='best', fontsize=9, frameon=True)
    plt.grid(True, which='both', linestyle='--', alpha=0.5)

    # --- D. SAVE AND CLEANUP ---
    clean_title = str(config_row['Graph_Title']).strip()
    file_safe_name = "".join([c for c in clean_title if c.isalnum() or c in (' ', '_')]).strip()

    # Filename includes sheet to prevent overwriting
    png_name = f"{file_safe_name}.png"
    save_path = os.path.join(OUTPUT_DIR, png_name)

    plt.tight_layout()
    plt.savefig(save_path, dpi=300)

    # CRITICAL: Fully clear memory/plots before next iteration
    plt.clf()
    plt.close('all')

    description = f"N-M diagram for {file_safe_name}"
    return png_name, description

# --- 3. MAIN EXECUTION ---
if __name__ == "__main__":
    plot_registry = []
    fig_count = 1
    print("Starting plotting process...")

    df = pd.read_csv("./plot_config.csv")
    for _, row in df.iterrows():
        print(f"  Plotting: {row['Graph_Title']}...")
        fname, desc = process_and_plot(row)
        # plot_registry.append({'Sheet': sheet, 'File Name': fname, 'Description': desc})

        # Add to Word Doc
        # image = os.path.join(OUTPUT_DIR, fname)
        # print("Adding to Word document...")
        # print(f"    Adding to Word: {image} {desc} {fig_count}")

    # # Save CSV
    # csv_path = os.path.join(OUTPUT_DIR, "Summary_List.csv")
    # with open(csv_path, 'w', newline='', encoding='utf-8') as f:
    #     w = csv.DictWriter(f, fieldnames=['Sheet', 'File Name', 'Description'])
    #     w.writeheader()
    #     w.writerows(plot_registry)
