<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class NewsController extends Controller
{
    public function index()
    {
        $posts = Post::with('category')
            ->latest('published_at')
            ->paginate(10);

        return Inertia::render('Admin/News/Index', [
            'posts' => $posts,
        ]);
    }

    public function create()
    {
        $categories = Category::active()->get(['id', 'name']);

        return Inertia::render('Admin/News/Create', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'excerpt' => 'nullable|string|max:500',
            'featured_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
            'status' => 'required|in:draft,published,archived',
            'published_at' => 'nullable|date',
        ]);

        // Handle image upload
        if ($request->hasFile('featured_image')) {
            $image = $request->file('featured_image');
            $path = $image->store('posts', 'public');
            $validated['featured_image'] = 'storage/' . $path;
        }

        // Auto-generate slug
        $validated['slug'] = Str::slug($validated['title']);

        // Set published_at if status is published
        if ($validated['status'] === 'published' && !$validated['published_at']) {
            $validated['published_at'] = now();
        }

        Post::create($validated);

        return redirect()->route('admin.news.index')
            ->with('success', 'Berita berhasil ditambahkan.');
    }

    public function edit(Post $news)
    {
        $categories = Category::active()->get(['id', 'name']);

        return Inertia::render('Admin/News/Edit', [
            'post' => $post->load('category'),
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, Post $news)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'excerpt' => 'nullable|string|max:500',
            'featured_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
            'status' => 'required|in:draft,published,archived',
            'published_at' => 'nullable|date',
        ]);

        // Handle image upload
        if ($request->hasFile('featured_image')) {
            // Delete old image
            if ($post->featured_image && str_starts_with($post->featured_image, 'storage/')) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete(
                    str_replace('storage/', '', $post->featured_image)
                );
            }

            $image = $request->file('featured_image');
            $path = $image->store('posts', 'public');
            $validated['featured_image'] = 'storage/' . $path;
        }

        // Update slug if title changed
        if ($post->title !== $validated['title']) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        // Set published_at if status is published
        if ($validated['status'] === 'published' && !$validated['published_at']) {
            $validated['published_at'] = now();
        }

        $news->update($validated);

        return redirect()->route('admin.news.index')
            ->with('success', 'Berita berhasil diperbarui.');
    }

    public function destroy(Post $news)
    {
        $news->delete();

        return redirect()->route('admin.news.index')
            ->with('success', 'Berita berhasil dihapus.');
    }

    public function show(Post $news)
    {
        return Inertia::render('Admin/News/Show', [
            'post' => $post->load('category'),
        ]);
    }
}
