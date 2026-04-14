<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PengawalController;
use App\Http\Controllers\TitikSemakController;  
use App\Http\Controllers\PelawatController;
use App\Http\Controllers\PentadbirController;
use App\Http\Controllers\LaporanKejadianController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return auth()->check() ? redirect()->route('dashboard') : redirect('/login');
});


Route::middleware(['auth', 'verified'])->group(function () {

    // --- Traffic Controller ---
    Route::get('/dashboard', function () {
        return match (auth()->user()->role) {
            'admin'     => redirect()->route('admin.pentadbir.index'),
            'pentadbir' => redirect()->route('pentadbir.pengawal.index'),
            default     => abort(403, 'Akses ditolak. Peranan tidak sah.'),
        };
    })->name('dashboard');

    Route::prefix('admin')->name('admin.')->group(function () {

        // urus pentadbir;
        Route::get('urus-pentadbir', [PentadbirController::class, 'index'])->name('pentadbir.index');
        Route::get('urus-pentadbir/tambah', [PentadbirController::class, 'create'])->name('pentadbir.create');
        Route::post('urus-pentadbir', [PentadbirController::class, 'store'])->name('pentadbir.store');
        Route::get('urus-pentadbir/{pentadbir}/edit', [PentadbirController::class, 'edit'])->name('pentadbir.edit');
        Route::put('urus-pentadbir/{pentadbir}', [PentadbirController::class, 'update'])->name('pentadbir.update');
        Route::delete('urus-pentadbir/{pentadbir}', [PentadbirController::class, 'destroy'])->name('pentadbir.destroy');
    });

    Route::prefix('pentadbir')->name('pentadbir.')->group(function () {
        
        // dashboardRosak;
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
        // urus pengawal;
        Route::get('urus-pengawal', [PengawalController::class, 'index'])->name('pengawal.index');
        Route::get('urus-pengawal/tambah', [PengawalController::class, 'create'])->name('pengawal.create');
        Route::post('urus-pengawal', [PengawalController::class, 'store'])->name('pengawal.store');
        Route::get('urus-pengawal/{pengawal}/edit', [PengawalController::class, 'edit'])->name('pengawal.edit');
        Route::put('urus-pengawal/{pengawal}', [PengawalController::class, 'update'])->name('pengawal.update');
        Route::delete('urus-pengawal/{pengawal}', [PengawalController::class, 'destroy'])->name('pengawal.destroy');

        // urus pelawat;
        Route::get('urus-pelawat', [PelawatController::class, 'index'])->name('pelawat.index');
        Route::get('urus-pelawat/{pelawat}/edit', [PelawatController::class, 'edit'])->name('pelawat.edit');
        Route::put('urus-pelawat/{pelawat}', [PelawatController::class, 'update'])->name('pelawat.update');
        Route::delete('urus-pelawat/{pelawat}', [PelawatController::class, 'destroy'])->name('pelawat.destroy');

        // urus titik semak;
        Route::get('/titik-semak', [TitikSemakController::class, 'index'])->name('titik-semak.index');
        Route::get('/titik-semak/create', [TitikSemakController::class, 'create'])->name('titik-semak.create');
        Route::post('/titik-semak', [TitikSemakController::class, 'store'])->name('titik-semak.store');
        Route::delete('/titik-semak/{titikSemak}', [TitikSemakController::class, 'destroy'])->name('titik-semak.destroy');
        Route::get('/titik-semak/{titikSemak}/cetak-qr', [TitikSemakController::class, 'cetakQR'])->name('titik-semak.cetak-qr');

        // urus laporan kejadian (RUD);
        Route::get('/laporan-kejadian', [LaporanKejadianController::class, 'index'])->name('laporan-kejadian.index');
        Route::get('/laporan-kejadian/{laporanKejadian}', [LaporanKejadianController::class, 'show'])->name('laporan-kejadian.show');
        Route::get('/laporan-kejadian/{laporanKejadian}/edit', [LaporanKejadianController::class, 'edit'])->name('laporan-kejadian.edit');
        Route::put('/laporan-kejadian/{laporanKejadian}', [LaporanKejadianController::class, 'update'])->name('laporan-kejadian.update');
        Route::delete('/laporan-kejadian/{laporanKejadian}', [LaporanKejadianController::class, 'destroy'])->name('laporan-kejadian.destroy');
        });

    // profile;
    Route::prefix('profile')->name('profile.')->group(function () {
        Route::get('/', [ProfileController::class, 'edit'])->name('edit');
        Route::patch('/', [ProfileController::class, 'update'])->name('update');
        Route::delete('/', [ProfileController::class, 'destroy'])->name('destroy');
    });

});

require __DIR__.'/auth.php';