<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UsersController; 
use App\Http\Controllers\GamesController; 

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::post("/v1/auth/signup", [AuthController::class, "signUpUser"]);
Route::post("/v1/auth/signin", [AuthController::class, "signInUser"]);
Route::post("/v1/games/{slug}/upload", [GamesController::class, "addGameVersion"]);
Route::get("/games/{slug}/{version}", [GamesController::class, "serveGame"]);
Route::put("/v1/games/{slug}", [GamesController::class, "updateGame"]);
Route::get("/v1/users/{username}", [GamesController::class, "getUsernameDetail"]);
Route::get("/v1/games/{slug}/scores", [GamesController::class, "scoreGame"]);




Route::middleware(["logout"])->group(function(){
    Route::get("/v1/auth/me", [AuthController::class, "me"]);
    Route::post("/v1/auth/signout", [AuthController::class, "signOutUser"]);
    Route::get("/v1/games", [GamesController::class, "getAllGame"]);
    Route::post("/v1/games", [GamesController::class, "addGame"]);
    
    Route::get("/v1/games/{slug}", [GamesController::class, "gameDetail"]);
    
    Route::delete("/v1/games/{slug}", [GamesController::class, "deleteGame"]);
    Route::post("/v1/games/{slug}/scores", [GamesController::class, "postScore"]);
});

Route::middleware(["onlyAdmin"])->group(function(){
    Route::get("/v1/admins", [UsersController::class, "getAllAdmins"]);
    Route::put("/v1/users/{id}", [UsersController::class, "updateUser"]);
    Route::delete("/v1/users/{id}", [UsersController::class, "deleteUser"]);

});