import serial
import requests
import time
import re
import json
import os
import sys

# 1. Fungsi untuk membaca file JSON
def load_config(filename='config_timbangan.json'):
    if not os.path.exists(filename):
        print(f"ERROR: File konfigurasi '{filename}' tidak ditemukan!")
        print("Pastikan file tersebut berada di folder yang sama dengan script ini.")
        sys.exit()
        
    with open(filename, 'r') as file:
        try:
            return json.load(file)
        except json.JSONDecodeError as e:
            print(f"ERROR FORMAT JSON: Ada kesalahan penulisan di file config_timbangan.json.\nDetail: {e}")
            sys.exit()

# 2. Muat konfigurasi saat script dijalankan
config = load_config()

def parse_weight(raw_line, patterns):
    """Mencoba mengekstrak angka menggunakan kamus pola dari JSON."""
    for item in patterns:
        match = re.search(item['regex'], raw_line, re.IGNORECASE)
        if match:
            # Mengembalikan angka dan nama merk indikator yang cocok
            return float(match.group(1)), item['merk'] 
            
    return None, None # Jika tidak ada yang cocok

# 3. Jalankan Program Utama
try:
    ser = serial.Serial(config['port'], config['baud_rate'], timeout=1)
    print("==================================================")
    print(f"SISTEM JEMBATAN TIMBANG AKTIF")
    print(f"Port Target : {config['port']}")
    print(f"API Target  : {config['api_url']}")
    print(f"Jumlah Pola : {len(config['patterns'])} merk indikator didukung")
    print("==================================================")
    print("Menunggu aliran data dari timbangan...\n")
    
    while True:
        if ser.in_waiting > 0:
            latest_line = ""
            
            # --- SOLUSI ANTI DELAY / BACKLOG ---
            # Selama masih ada data di antrean (buffer), baca terus dengan sangat cepat
            # sampai antrean kosong. Kita hanya akan menyimpan baris yang paling terakhir.
            while ser.in_waiting > 0:
                latest_line = ser.readline().decode('utf-8', errors='ignore').strip()
            
            # Pastikan latest_line tidak kosong sebelum diproses
            if latest_line:
                # Ekstrak angka menggunakan data yang paling baru saja
                angka_berat, merk_dideteksi = parse_weight(latest_line, config.get('patterns', []))
                
                if angka_berat is not None:
                    try:
                        res = requests.post(config.get('api_url'), json={"berat": angka_berat})
                        print(f"[{merk_dideteksi}] RAW: '{latest_line}' -> {angka_berat} KG -> Terkirim (Status: {res.status_code})")
                    except Exception as api_err:
                        print(f"Gagal mengirim ke Laravel API: {api_err}")
            
except serial.SerialException:
    print(f"ERROR HARDWARE: Port {config['port']} tidak ditemukan atau sedang dipakai aplikasi lain.")
except Exception as e:
    print(f"Kesalahan Sistem: {e}")