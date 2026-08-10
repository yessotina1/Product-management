<?php

/**
 * @OA\OpenApi(
 *     openapi="3.0.0",
 *     info=@OA\Info(
 *         version="1.0.0",
 *         title="Product Management API",
 *         description="API pour la gestion de produits et catégories",
 *         contact=@OA\Contact(
 *             name="API Support",
 *             email="support@productmanagement.com"
 *         ),
 *         license=@OA\License(
 *             name="Apache 2.0",
 *             url="https://www.apache.org/licenses/LICENSE-2.0.html"
 *         )
 *     ),
 *     servers={
 *         @OA\Server(
 *             url=L5_SWAGGER_CONST_HOST,
 *             description="API Server"
 *         )
 *     }
 * )
 *
 * @OA\SecurityScheme(
 *     type="http",
 *     description="Login with email and password to get the authentication token",
 *     name="Token based based authentication",
 *     in="header",
 *     scheme="bearer",
 *     bearerFormat="JWT",
 *     securityScheme="api_key",
 * )
 *
 * @OA\Schema(
 *     schema="User",
 *     type="object",
 *     title="User",
 *     properties={
 *         @OA\Property(property="id", type="integer", example=1),
 *         @OA\Property(property="name", type="string", example="John Doe"),
 *         @OA\Property(property="email", type="string", format="email", example="john@example.com"),
 *     }
 * )
 *
 * @OA\Schema(
 *     schema="Category",
 *     type="object",
 *     title="Category",
 *     properties={
 *         @OA\Property(property="id", type="integer", example=1),
 *         @OA\Property(property="name", type="string", example="Electronics"),
 *         @OA\Property(property="description", type="string", example="Electronic devices"),
 *         @OA\Property(property="products_count", type="integer", example=5),
 *         @OA\Property(property="created_at", type="string", format="date-time"),
 *         @OA\Property(property="updated_at", type="string", format="date-time"),
 *     }
 * )
 *
 * @OA\Schema(
 *     schema="Product",
 *     type="object",
 *     title="Product",
 *     properties={
 *         @OA\Property(property="id", type="integer", example=1),
 *         @OA\Property(property="name", type="string", example="Laptop"),
 *         @OA\Property(property="description", type="string", example="High performance laptop"),
 *         @OA\Property(property="price", type="number", format="float", example=999.99),
 *         @OA\Property(property="stock_quantity", type="integer", example=50),
 *         @OA\Property(property="category_id", type="integer", example=1),
 *         @OA\Property(property="user_id", type="integer", example=1),
 *         @OA\Property(property="category", ref="#/components/schemas/Category"),
 *         @OA\Property(property="user", ref="#/components/schemas/User"),
 *         @OA\Property(property="created_at", type="string", format="date-time"),
 *         @OA\Property(property="updated_at", type="string", format="date-time"),
 *     }
 * )
 *
 * @OA\Schema(
 *     schema="AuthResponse",
 *     type="object",
 *     title="AuthResponse",
 *     properties={
 *         @OA\Property(property="token", type="string", example="1|ABC123XYZ..."),
 *         @OA\Property(property="user", ref="#/components/schemas/User"),
 *     }
 * )
 *
 * @OA\Schema(
 *     schema="PaginatedResponse",
 *     type="object",
 *     title="PaginatedResponse",
 *     properties={
 *         @OA\Property(property="data", type="array", items=@OA\Items(type="object")),
 *         @OA\Property(property="current_page", type="integer"),
 *         @OA\Property(property="last_page", type="integer"),
 *         @OA\Property(property="per_page", type="integer"),
 *         @OA\Property(property="total", type="integer"),
 *     }
 * )
 */
