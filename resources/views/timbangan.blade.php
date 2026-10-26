<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jembatan Timbang Sawit</title>
    <!-- Tailwind CSS (Opsional untuk styling) -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- WAJIB: Memanggil aset Vite yang berisi Laravel Echo -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="bg-gray-100 flex items-center justify-center h-screen">

    <div class="bg-white p-10 rounded-xl shadow-lg text-center">
        <h2 class="text-2xl font-bold text-gray-700 mb-4">Indikator Timbangan (Live)</h2>
        
        <div class="bg-black text-green-400 p-8 rounded-lg">
            <h1 id="angka-timbangan" class="text-6xl font-mono">0.00 KG</h1>
        </div>
        
        <p class="mt-4 text-sm text-gray-500" id="status-koneksi">Menghubungkan ke server...</p>
    </div>

    <!-- Script Listener WebSocket -->
    <script type="module">
        document.addEventListener("DOMContentLoaded", () => {
            document.getElementById('status-koneksi').innerText = 'Terhubung ✅';
            
            // Dengarkan channel WebSocket
            window.Echo.channel('weighbridge-channel')
                .listen('.App\\Events\\WeightUpdated', (e) => {
                    console.log("Data diterima dari WebSocket:", e); // Cek Console (F12)
                    document.getElementById('angka-timbangan').innerText = e.berat + ' KG';
                });
        });
    </script>

</body>
</html>