<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Events\WeightUpdated;

class WeighingController extends Controller
{
    public function updateLiveWeight(Request $request)
    {
        $request->validate([
            'berat' => 'required|numeric'
        ]);

        $berat = $request->berat;

        // Simpan/Update data berat (ID 1) ke database
        DB::table('weighings')->updateOrInsert(
            ['id' => 1],
            ['berat' => $berat, 'updated_at' => now()]
        );

        // Pancarkan event WebSocket ke browser
        WeightUpdated::dispatch($berat);

        return response()->json(['status' => 'success', 'berat' => $berat]);
    }
}
