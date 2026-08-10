<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

/**
 * @OA\Tag(
 *     name="Categories",
 *     description="Gestion des catégories (authentification requise)"
 * )
 */
class CategoryController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/categories",
     *     operationId="getCategories",
     *     tags={"Categories"},
     *     summary="Lister toutes les catégories",
     *     description="Retourne une liste paginée des catégories avec le nombre de produits",
     *     security={{"api_key":{}}},
     *     @OA\Parameter(
     *         name="search",
     *         in="query",
     *         description="Cherche dans name et description",
     *         required=false,
     *         @OA\Schema(type="string", example="electronics")
     *     ),
     *     @OA\Parameter(
     *         name="sort_by",
     *         in="query",
     *         description="Trier par champ",
     *         required=false,
     *         @OA\Schema(type="string", enum={"name","created_at"}, example="name")
     *     ),
     *     @OA\Parameter(
     *         name="sort_order",
     *         in="query",
     *         description="Ordre de tri",
     *         required=false,
     *         @OA\Schema(type="string", enum={"asc","desc"}, example="asc")
     *     ),
     *     @OA\Parameter(
     *         name="per_page",
     *         in="query",
     *         description="Éléments par page",
     *         required=false,
     *         @OA\Schema(type="integer", example=10)
     *     ),
     *     @OA\Parameter(
     *         name="page",
     *         in="query",
     *         description="Numéro de page",
     *         required=false,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Liste des catégories",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="data", type="array", items=@OA\Items(ref="#/components/schemas/Category")),
     *             @OA\Property(property="current_page", type="integer"),
     *             @OA\Property(property="last_page", type="integer"),
     *             @OA\Property(property="per_page", type="integer"),
     *             @OA\Property(property="total", type="integer")
     *         )
     *     ),
     *     @OA\Response(response=401, description="Non authentifié")
     * )
     */

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


    /**
     * @OA\Post(
     *     path="/api/categories",
     *     operationId="createCategory",
     *     tags={"Categories"},
     *     summary="Créer une catégorie",
     *     description="Crée une nouvelle catégorie",
     *     security={{"api_key":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name","description"},
     *             @OA\Property(property="name", type="string", maxLength=255, example="Electronics"),
     *             @OA\Property(property="description", type="string", example="Electronic devices"),
     *         ),
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Catégorie créée",
     *         @OA\JsonContent(ref="#/components/schemas/Category")
     *     ),
     *     @OA\Response(response=401, description="Non authentifié"),
     *     @OA\Response(response=422, description="Erreur de validation")
     * )
     */
    public function store(Request $request)
    {
      $validated = $request->validate([
          'name' => 'required|string|max:255',
          'description' => 'required|string',
      ]);
      $category = Category::create($validated);
      return response()->json($category,201);
    }


    /**
     * @OA\Get(
     *     path="/api/categories/{id}",
     *     operationId="getCategory",
     *     tags={"Categories"},
     *     summary="Afficher une catégorie",
     *     description="Retourne les détails d'une catégorie avec le nombre de produits",
     *     security={{"api_key":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID de la catégorie",
     *         required=true,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Détails de la catégorie",
     *         @OA\JsonContent(ref="#/components/schemas/Category")
     *     ),
     *     @OA\Response(response=401, description="Non authentifié"),
     *     @OA\Response(response=404, description="Catégorie non trouvée")
     * )
     */
    public function show(Category $category)
    {
        return response()->json($category->loadCount('products'));
    }


    /**
     * @OA\Put(
     *     path="/api/categories/{id}",
     *     operationId="updateCategory",
     *     tags={"Categories"},
     *     summary="Modifier une catégorie",
     *     description="Met à jour les informations d'une catégorie",
     *     security={{"api_key":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID de la catégorie",
     *         required=true,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name","description"},
     *             @OA\Property(property="name", type="string", maxLength=255, example="Electronics"),
     *             @OA\Property(property="description", type="string", example="Electronic devices"),
     *         ),
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Catégorie modifiée",
     *         @OA\JsonContent(ref="#/components/schemas/Category")
     *     ),
     *     @OA\Response(response=401, description="Non authentifié"),
     *     @OA\Response(response=404, description="Catégorie non trouvée"),
     *     @OA\Response(response=422, description="Erreur de validation")
     * )
     */
    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
        ]);
        $category->update($validated);
        return response()->json($category);
    }


    /**
     * @OA\Delete(
     *     path="/api/categories/{id}",
     *     operationId="deleteCategory",
     *     tags={"Categories"},
     *     summary="Supprimer une catégorie",
     *     description="Supprime une catégorie (impossible si elle contient des produits)",
     *     security={{"api_key":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID de la catégorie",
     *         required=true,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=204,
     *         description="Catégorie supprimée"
     *     ),
     *     @OA\Response(
     *         response=409,
     *         description="Impossible de supprimer: catégorie contient des produits",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Impossible de supprimer une catégorie utilisée par un produit")
     *         )
     *     ),
     *     @OA\Response(response=401, description="Non authentifié"),
     *     @OA\Response(response=404, description="Catégorie non trouvée")
     * )
     */
    public function destroy(Category $category)
    {
       if ($category->products()->count() > 0) {
           return response()->json(['message' => 'Impossible de supprimer une catégorie utilisée par un produit'], 409);
       }
       $category->delete();
       return response()->json(null,204);
    }
}
