import serial
import time
import random

# Gunakan salah satu dari pasangan port virtual (misal COM8)
COM_PORT = 'COM6' 
BAUD_RATE = 9600

try:
    ser = serial.Serial(COM_PORT, BAUD_RATE)
    print(f"Simulator Indikator berjalan di {COM_PORT}...")
    
    berat = 12500.0 # Berat awal (Tarra truk kosong misal)
    
    while True:
        # Kita simulasikan fluktuasi berat yang realistis (naik turun sedikit)
        berat += random.uniform(-2.0, 5.0) 
        
        # Format umum yang sering dikeluarkan indikator fisik (misal: "ST,GS,+  12505 kg\r\n")
        # ST = Stable, GS = Gross
        data_string = f"ST,GS,+  {berat:.0f} kg\r\n"
        
        # Kirim ke Serial Port
        ser.write(data_string.encode('utf-8'))
        print(f"Mengirim: {data_string.strip()}")
        
        time.sleep(0.5) # Indikator biasanya mengirim 2-5 kali per detik

except Exception as e:
    print(f"Error Simulator: {e}")