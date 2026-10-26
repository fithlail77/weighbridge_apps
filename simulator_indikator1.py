import serial
import time
import math

# --- KONFIGURASI SIMULATOR ---
# Pastikan COM_PORT ini adalah pasangan dari yang digunakan di reader.py (misal COM6 <-> COM7)
COM_PORT = 'COM6' 
BAUD_RATE = 9600

# Digit akhiran khusus dari indikator tipe ini (dijaga tetap untuk simulasi)
AKHIRAN = "014" 
PANJANG_TOTAL_ANGKA = 10 # Panjang string angka setelah tanda '+' (misal '003840014' adalah 9 digit, '+003840014' adalah 10 char. Kita asumsikan total 9 digit angka).

def format_data_indikator(berat_kg):
    """
    Mengubah nilai berat aktual menjadi format string Indikator 1.
    Contoh: berat 3840 -> "+003840014"
    """
    # 1. Pastikan berat tidak negatif untuk format ini
    berat_bersih = max(0, int(berat_kg))
    
    # 2. Gabungkan berat dengan akhiran
    gabungan = f"{berat_bersih}{AKHIRAN}"
    
    # 3. Tambahkan padding nol di depan agar total digit (tanpa +) menjadi 9
    # Menggunakan .zfill(9) akan mengisi string dengan 0 di sebelah kiri sampai panjangnya 9
    string_angka = gabungan.zfill(9)
    
    # 4. Tambahkan tanda + dan karakter newline/carriage return bawaan serial (\r\n)
    # Output akhir persis seperti di file text: "+003840014\r\n"
    return f"+{string_angka}\r\n"

try:
    ser = serial.Serial(COM_PORT, BAUD_RATE)
    print("==================================================")
    print(f"SIMULATOR INDIKATOR TIPE 1 AKTIF")
    print(f"Memancarkan data ke port : {COM_PORT}")
    print("Tekan Ctrl+C untuk menghentikan.")
    print("==================================================")
    
    waktu = 0.0
    
    while True:
        # Simulasi fluktuasi berat menggunakan fungsi Sinus
        # Menghasilkan berat yang perlahan naik dari 0 hingga sekitar 15000 kg, lalu turun lagi.
        # math.sin(waktu) menghasilkan nilai -1 sampai 1.
        # (math.sin(waktu) + 1) / 2 menghasilkan rentang 0 sampai 1.
        berat_simulasi = ((math.sin(waktu) + 1) / 2) * 15000 
        
        # Tambahkan sedikit fluktuasi/getaran acak (maksimal +- 20 kg) agar lebih realistis seperti tertiup angin
        berat_simulasi += (math.sin(waktu * 10) * 20) 
        
        # Pastikan tidak di bawah nol
        if berat_simulasi < 0:
            berat_simulasi = 0

        # Format datanya
        data_string = format_data_indikator(berat_simulasi)
        
        # Kirim ke Serial Port (harus di-encode ke bytes)
        ser.write(data_string.encode('utf-8'))
        
        # Tampilkan di terminal untuk visualisasi
        print(f"SIMULATOR -> {data_string.strip()}")
        
        # Increment waktu dan jeda pengiriman (indikator biasanya sangat cepat, misal 10x per detik)
        waktu += 0.05
        time.sleep(0.1) 

except serial.SerialException:
    print(f"\nERROR: Gagal membuka {COM_PORT}.")
    print("Pastikan port tersebut tersedia, dibuat via com0com, dan tidak sedang dipakai oleh aplikasi lain.")
except KeyboardInterrupt:
    print("\nSimulator dihentikan oleh pengguna.")
except Exception as e:
    print(f"\nTerjadi kesalahan: {e}")
finally:
    if 'ser' in locals() and ser.is_open:
        ser.close()