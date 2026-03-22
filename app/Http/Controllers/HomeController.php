<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\MotorRepositoryInterface;
use App\Models\Motor;
use App\Models\Setting;
use App\Models\Post;
use Illuminate\Support\Facades\DB;

class HomeController extends Controller
{
    private MotorRepositoryInterface $motorRepository;

    public function __construct(MotorRepositoryInterface $motorRepository)
    {
        $this->motorRepository = $motorRepository;
    }


    public function __invoke(Request $request)
    {

        $popularMotors = $this->motorRepository->getPopular(5, true);

        // Get brand availability
        $brandAvailability = Motor::select('brand', DB::raw('COUNT(*) as total_units'))
            ->where('tersedia', true)
            ->groupBy('brand')
            ->get()
            ->keyBy('brand')
            ->map(fn($item) => [
                'name' => $item->brand,
                'available' => $item->total_units > 0
            ]);

        // Ensure both Honda and Yamaha are in the list
        $brands = [
            'Honda' => $brandAvailability->get('Honda') ?? ['name' => 'Honda', 'available' => false],
            'Yamaha' => $brandAvailability->get('Yamaha') ?? ['name' => 'Yamaha', 'available' => false],
        ];

        // Get settings from database
        $settings = Setting::pluck('value', 'key')->toArray();

        // Get latest published news
        $news = Post::with('category')
            ->published()
            ->recent(3)
            ->get();

        return \Inertia\Inertia::render('Home', [
            'popularMotors' => $popularMotors,
            'brandAvailability' => $brands,
            'settings' => $settings,
            'news' => $news
        ]);
    }
}
