import serial
import time
import math
import random

# --- KONFIGURASI SIMULATOR TIPE 2 ---
COM_PORT = 'COM6' # Sesuaikan dengan Virtual Port Anda
BAUD_RATE = 9600

# Daftar prefix yang sering muncul di log indikator Anda
PREFIX_LIST = ['O', 'G', 'F', 'E', 'D', 'C', 'B', 'A', '@', 'N', 'M', 'L', 'K', 'J', 'I', 'H']

def format_data_indikator2(berat_kg, counter_sekuensi):
    """
    Membentuk string persis seperti Indikator Tipe 2.
    Contoh: " O      12300 kg    G 668330 99                            \r\n"
    """
    # 1. Pilih prefix secara acak atau berurutan (disini kita acak saja untuk simulasi status)
    prefix = random.choice(PREFIX_LIST)
    
    # 2. Format angka berat (jika 0, di log tertulis '00')
    berat_bersih = int(max(0, berat_kg))
    berat_str = "00" if berat_bersih == 0 else str(berat_bersih)
    
    # 3. Rakit string dengan spasi yang menyerupai output asli
    # {prefix:1} -> 1 karakter
    # {berat_str} -> angka berat
    # {counter_sekuensi} -> meniru angka 668330 yang terus naik
    data_string = f" {prefix}      {berat_str} kg    G {counter_sekuensi} 99                            \r\n"
    
    return data_string

try:
    ser = serial.Serial(COM_PORT, BAUD_RATE)
    print("==================================================")
    print(f"SIMULATOR INDIKATOR TIPE 2 (STATUS PREFIX) AKTIF")
    print(f"Memancarkan data ke port : {COM_PORT}")
    print("Tekan Ctrl+C untuk menghentikan.")
    print("==================================================")
    
    waktu = 0.0
    sekuensi = 668330 # Memulai dari angka yang sama dengan log Anda
    
    while True:
        # Simulasi fluktuasi berat truk yang naik ke timbangan (0 - 15000 kg)
        berat_simulasi = ((math.sin(waktu) + 1) / 2) * 15000 
        
        # Format datanya dengan sekuensi yang terus bertambah
        data_string = format_data_indikator2(berat_simulasi, sekuensi)
        
        # Kirim ke Serial Port
        ser.write(data_string.encode('utf-8'))
        
        # Tampilkan di terminal untuk visualisasi
        print(f"SIMULATOR -> '{data_string.strip()}'")
        
        waktu += 0.05
        sekuensi += 1 # Angka di belakang G terus bertambah seperti aslinya
        time.sleep(0.1) # Memancarkan data 10x per detik

except serial.SerialException:
    print(f"\nERROR: Gagal membuka {COM_PORT}.")
except KeyboardInterrupt:
    print("\nSimulator dihentikan oleh pengguna.")
except Exception as e:
    print(f"\nTerjadi kesalahan: {e}")
finally:
    if 'ser' in locals() and ser.is_open:
        ser.close()