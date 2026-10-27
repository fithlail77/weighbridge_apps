import serial
import time
import math

# --- KONFIGURASI SIMULATOR TIPE 3 ---
COM_PORT = 'COM2' # Sesuaikan dengan Virtual Port Anda
BAUD_RATE = 9600

def format_data_indikator3(berat_gross, berat_tare):
    """
    Membentuk format multi-baris persis seperti Indikator Tipe 3.
    Contoh:
         Gross     4360 kg                    
          Tare     4360 kg                    
           Net     4360 kg                    
    """
    g_val = int(max(0, berat_gross))
    t_val = int(max(0, berat_tare))
    n_val = max(0, g_val - t_val) # Net adalah Gross dikurangi Tare
    
    # Format angka '00' jika berat bernilai 0, atau angka aslinya jika ada muatan
    str_gross = "00" if g_val == 0 else str(g_val)
    str_tare  = "00" if t_val == 0 else str(t_val)
    str_net   = "00" if n_val == 0 else str(n_val)
    
    # Menyusun string multi-baris dengan spasi padding khas indikator logistik
    paket_data = (
        f"     Gross     {str_gross} kg                    \r\n"
        f"      Tare     {str_tare} kg                    \r\n"
        f"       Net     {str_net} kg                    \r\n"
    )
    return paket_data

try:
    ser = serial.Serial(COM_PORT, BAUD_RATE)
    print("==================================================")
    print(f"SIMULATOR INDIKATOR TIPE 3 (LOGISTIK) AKTIF")
    print(f"Memancarkan data ke port : {COM_PORT}")
    print("Tekan Ctrl+C untuk menghentikan.")
    print("==================================================")
    
    waktu = 0.0
    
    while True:
        # Simulasi berat Gross naik turun menggunakan gelombang sinus (0 - 12000 kg)
        gross_simulasi = ((math.sin(waktu) + 1) / 2) * 12000
        
        # Simulasi nilai Tare (misal berat kosong truk diset tetap di 0 atau ada nilai tertentu)
        # Di sini kita buat tare bernilai 0 saat kosong, dan tersangkut di angka tertentu saat ada muatan
        tare_simulasi = 0 if gross_simulasi < 1000 else 2500 
        
        # Buat paket data 3 baris
        data_string = format_data_indikator3(gross_simulasi, tare_simulasi)
        
        # Kirim ke Serial Port
        ser.write(data_string.encode('utf-8'))
        
        # Tampilkan visualisasi ringkas di terminal simulator
        print(f"--- MENGIRIM PAKET TIMBANGAN ---\n{data_string.strip()}\n--------------------------------")
        
        waktu += 0.1
        time.sleep(0.5) # Jeda sedikit lebih lama karena paket logistik biasanya dikirim per blok transaksi

except serial.SerialException:
    print(f"\nERROR: Gagal membuka {COM_PORT}.")
except KeyboardInterrupt:
    print("\nSimulator dihentikan oleh pengguna.")
except Exception as e:
    print(f"\nTerjadi kesalahan: {e}")
finally:
    if 'ser' in locals() and ser.is_open:
        ser.close()