<?php

namespace App\Http\Controllers;

use App\Services\BranchService;
use Illuminate\Http\Request;

class PageController extends Controller
{
    protected $branchService;

    public function __construct(BranchService $branchService)
    {
        $this->branchService = $branchService;
    }

    /**
     * Show the About Us page.
     */
    public function about()
    {
        return \Inertia\Inertia::render('About', [
            'branches' => $this->branchService->getAllBranches()
        ]);
    }

    /**
     * Show the Help / Customer Support page.
     */
    public function help()
    {
        return \Inertia\Inertia::render('Help', ['initialTab' => 'faq']);
    }

    /**
     * Show the Ordering Guide page.
     */
    public function guide()
    {
        return \Inertia\Inertia::render('Help', ['initialTab' => 'guide']);
    }

    /**
     * Show the Terms & Conditions page.
     */
    public function terms()
    {
        return \Inertia\Inertia::render('Help', ['initialTab' => 'terms']);
    }

    /**
     * Show the Privacy Policy page.
     */
    public function privacy()
    {
        return \Inertia\Inertia::render('Help', ['initialTab' => 'privacy']);
    }
}