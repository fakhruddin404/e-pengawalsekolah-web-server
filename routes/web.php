<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PengawalController;
use App\Http\Controllers\TitikSemakController;  
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return auth()->check() ? redirect()->route('dashboard') : redirect('/login');
});


Route::middleware(['auth', 'verified'])->group(function () {

    // --- Traffic Controller ---
    Route::get('/dashboard', function () {
        return match (auth()->user()->role) {
            'admin'     => redirect()->route('admin.dashboard'),
            'pentadbir' => redirect()->route('pentadbir.dashboard'),
            default     => abort(403, 'Akses ditolak. Peranan tidak sah.'),
        };
    })->name('dashboard');

    Route::prefix('admin')->name('admin.')->group(function () {
        
        Route::get('/dashboard', function () {
            return Inertia::render('DashboardAdmin', ['role' => 'admin']);
        })->name('dashboard');
        
        // Letak route khas admin lain di sini pada masa akan datang
        // Route::get('/tetapan', ...)->name('tetapan');
    });

    Route::prefix('pentadbir')->name('pentadbir.')->group(function () {
        
        Route::get('/dashboard', function () {
            return Inertia::render('DashboardPentadbir', ['role' => 'pentadbir']);
        })->name('dashboard'); 
    
        // urus pengawal;
        Route::get('urus-pengawal', [PengawalController::class, 'index'])->name('pengawal.index');
        Route::get('urus-pengawal/tambah', [PengawalController::class, 'create'])->name('pengawal.create');
        Route::post('urus-pengawal', [PengawalController::class, 'store'])->name('pengawal.store');
        Route::get('urus-pengawal/{pengawal}/edit', [PengawalController::class, 'edit'])->name('pengawal.edit');
        Route::put('urus-pengawal/{pengawal}', [PengawalController::class, 'update'])->name('pengawal.update');
        Route::delete('urus-pengawal/{pengawal}', [PengawalController::class, 'destroy'])->name('pengawal.destroy');

        // urus titik semak;
        Route::get('/titik-semak', [TitikSemakController::class, 'index'])->name('titik-semak.index');
        Route::get('/titik-semak/create', [TitikSemakController::class, 'create'])->name('titik-semak.create');
        Route::post('/titik-semak', [TitikSemakController::class, 'store'])->name('titik-semak.store');
        Route::delete('/titik-semak/{titikSemak}', [TitikSemakController::class, 'destroy'])->name('titik-semak.destroy');
        Route::get('/titik-semak/{titikSemak}/muat-turun-qr', [TitikSemakController::class, 'muatTurunQR'])->name('titik-semak.muat-turun-qr');
        });

    // profile;
    Route::prefix('profile')->name('profile.')->group(function () {
        Route::get('/', [ProfileController::class, 'edit'])->name('edit');
        Route::patch('/', [ProfileController::class, 'update'])->name('update');
        Route::delete('/', [ProfileController::class, 'destroy'])->name('destroy');
    });

});

require __DIR__.'/auth.php';