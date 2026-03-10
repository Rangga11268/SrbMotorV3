<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NewsController extends Controller
{
    /**
     * Display a listing of published news articles.
     */
    public function index(Request $request)
    {
        $query = Post::published()
            ->with('category')
            ->latest('published_at');

        // Filter by category if provided
        if ($request->has('category') && $request->category) {
            $query->byCategory($request->category);
        }

        // Search if provided
        if ($request->has('search') && $request->search) {
            $query->search($request->search);
        }

        // Sort option
        $sort = $request->get('sort', 'newest');
        if ($sort === 'oldest') {
            $query->oldest('published_at');
        } else {
            $query->latest('published_at');
        }

        $posts = $query->paginate(10);
        $categories = Category::active()->get(['id', 'name']);

        return Inertia::render('Berita/Index', [
            'posts' => $posts,
            'categories' => $categories,
            'filters' => [
                'search' => $request->get('search', ''),
                'category' => $request->get('category', ''),
                'sort' => $sort,
            ],
        ]);
    }

    /**
     * Display a single published news article.
     */
    public function show(Post $post)
    {
        // Check if post is published
        if ($post->status !== 'published') {
            abort(404);
        }

        // Increment views
        $post->incrementViews();

        // Get related posts (same category, published, different post)
        $relatedPosts = Post::published()
            ->byCategory($post->category_id)
            ->where('id', '!=', $post->id)
            ->with('category')
            ->latest('published_at')
            ->limit(5)
            ->get();

        // Get previous and next posts
        $previousPost = Post::published()
            ->where('published_at', '<', $post->published_at)
            ->latest('published_at')
            ->first(['id', 'title', 'slug']);

        $nextPost = Post::published()
            ->where('published_at', '>', $post->published_at)
            ->oldest('published_at')
            ->first(['id', 'title', 'slug']);

        return Inertia::render('Berita/Show', [
            'post' => $post->load('category'),
            'relatedPosts' => $relatedPosts,
            'previousPost' => $previousPost,
            'nextPost' => $nextPost,
        ]);
    }

    /**
     * Search news articles (API endpoint).
     */
    public function search(Request $request)
    {
        $query = $request->get('q', '');

        if (strlen($query) < 3) {
            return response()->json([
                'success' => false,
                'message' => 'Search query must be at least 3 characters',
                'data' => [],
            ], 422);
        }

        $results = Post::published()
            ->search($query)
            ->with('category')
            ->latest('published_at')
            ->limit(10)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $results,
        ]);
    }
}
