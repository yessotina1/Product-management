<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{

    public function index(Request $request)
    {
        $validated = $request->validate([
            'search' => 'nullable|string|max:255',
            'sort_by' => 'nullable|in:name,created_at',
            'sort_order' => 'nullable|in:asc,desc',
            'per_page' => 'nullable|integer|min:1|max:1000',
        ]);

        $categories = Category::query()
            ->withCount('products')
            ->when($validated['search'] ?? null, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->orderBy($validated['sort_by'] ?? 'created_at', $validated['sort_order'] ?? 'desc')
            ->paginate($validated['per_page'] ?? 10);

        return response()->json($categories);
    }


    public function store(Request $request)
    {
      $validated = $request->validate([
          'name' => 'required|string|max:255',
          'description' => 'required|string',
      ]);
      $category = Category::create($validated);
      return response()->json($category,201);
    }


    public function show(Category $category)
    {
        return response()->json($category->loadCount('products'));
    }


    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
        ]);
        $category->update($validated);
        return response()->json($category);
    }


    public function destroy(Category $category)
    {
       if ($category->products()->count() > 0) {
           return response()->json(['message' => 'Impossible de supprimer une catégorie utilisée par un produit'], 409);
       }
       $category->delete();
       return response()->json(null,204);
    }
}
