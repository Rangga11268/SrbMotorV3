<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PageController extends Controller
{
    /**
     * Show the About Us page.
     */
    public function about()
    {
        return \Inertia\Inertia::render('About');
    }

    /**
     * Show the Help / Customer Support page.
     */
    public function help()
    {
        return \Inertia\Inertia::render('Help');
    }
}