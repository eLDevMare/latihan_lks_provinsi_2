<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Validator;
use Illuminate\Support\Facades\Auth;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;

class GamesController extends Controller
{
    public function getAllGame(Request $request){
        $page = $request->query("page", 0);
        $size = $request->query("size", 10);
        $sortBy = $request->query("sortby", "title");
        $sortDir = $request->query("sorddir", "asc");

        
        $games = DB::table("game_versions")->pluck("game_id")->toArray();
        $game = DB::table("games")
                ->join("game_versions", "games.id", "=", "game_versions.game_id")
                ->join("users", "users.id", "=", "games.created_by")
                ->select("games.id as id",
                         "games.slug as slug",
                         "games.title as title", 
                         "games.description as description",
                         "game_versions.storage_path as storage_path",
                         "game_versions.version as version",
                         "games.updated_at as uploadTimeStamp",
                         "users.username as author")
                ->whereIn("games.id", $games)
                ->get();

        $group = $game->groupBy("id");
        

        $sigma = $group->map(function($item){
            return [
                "slug" => $item->first()->slug,
                "title" => $item->first()->title,
                "description" => $item->first()->description,
                "thumbnail" => "/games/" . $item->last()->slug . "/" . $item->last()->version . "/thumbnail.png",
                "uploadTimeStamp" => $item->last()->uploadTimeStamp,
                "author" => $item->first()->author,
                "scoreCount" => $item->count() 
            ];
        })->values();

        return response()->json([
            "page" => $page,
            "size" => $size,
            "totalElement" => $sigma->count(),
            "content" => $sigma
        ]);
    }


    public function addGame(Request $request){
        $user = Auth::guard("user")->user()->id;

        $validate = Validator::make($request->all(), [
            "title" => "required|min:3|max:60",
            "description" => "required|min:0|max:200"
        ]);

        if($validate->fails()){
            return response()->json([
                "message" => $validate->errors(),
            ]);
        }

        $slug = Str::slug($request->title);

        $existingGame = DB::table("games")->where("slug", $slug)->exists();
    
        if($existingGame){
            return response()->json([
                "status" => "invalid",
                "message" => "Game title already exists",
            ], 422);
        }

        $post = DB::table("games")->insertGetId([
            "title" => $request->title,
            "description" => $request->description,
            "slug" => $slug,
            "created_by" => $user,
            "created_at" => Carbon::now(),
            "updated_at" => Carbon::now()
        ]);

        $slug = DB::table("games")->where("id", $post)->first()->slug;

        return response()->json([
            "status" => "success",
            "slug" => $slug
        ], 201);
    }

    public function gameDetail($slug){
        $game = DB::table("games")
                ->where("slug", $slug)
                ->join("game_versions", "game_versions.game_id", "=", "games.id")
                ->orderBy("game_versions.created_at", "DESC");

        $count = DB::table("game_versions")->where("game_id", $game->first()->game_id)->count();
        $user = DB::table("users")->where("id", $game->first()->created_by)->first()->username;
        $game = $game->get();

        $format = $game->map(function($item) use($user, $count){
            return [
                "slug" => $item->slug,
                "title" => $item->title,
                "description" => $item->description,
                "thumbnail" => "/games/" . $item->slug . "/" . $item->version . "/thumbnail.png",
                "uploadTimeStamp" => $item->created_at,
                "author" => $user,
                "scoreCount" => $count,
                "gamePath" => $item->storage_path
            ];
        })->first();

        return response()->json([
            "content" =>  $format
        ]);
    }

    public function addGameVersion(Request $request, $slug){
        $file = $request->zipfile;
        $originalFile = $file->getClientOriginalName();

        $validate = Validator::make($request->all(), [
            'zipfile' => "required|file|mimes:zip|max:10240"
        ]);

        if($validate->fails()){
            return response()->json([
                "message" => $validate->errors()
            ]);
        }
        
        $game = DB::table("games")->where("slug", $slug)->first();
        $game_version = DB::table("game_versions")->where("game_id", $game->id)->count();
        
        $version = "v" . $game_version + 1;
        $path = "games/" . $game->id . "/" . $version . "/";

        DB::table("game_versions")->insert([
            "game_id" => $game->id,
            "version" => $version,
            "storage_path" => $path,
            "created_at" => Carbon::now(),
            "updated_at" => Carbon::now()
        ]);

        $file->move(public_path($path), $originalFile);

        return response()->json([
            "message" => "success"
        ]);
    }


    public function serveGame($slug, $version){
        $game = DB::table("games")->where("slug", $slug)->first()->id;
        $path = "games/" . $game . "/" . $version . "/";

        $files = File::files($path);
        $file = $files[0];

        return Response::file($file);
    }

    public function updateGame(request $request, $slug){
        DB::table("games")->where("slug", $slug)->update([
            "title" => $request->title,
            "description" => $request->description
        ]);

        return response()->json([
            "status" => "success"
        ]);
    }


    public function deleteGame($slug){
        $user = Auth::guard("user")->user()->id;
        $gameId = DB::table("games")->where("slug", $slug)->first();

        if($gameId->created_by !== $user){
            return response()->json([
                "status" => "forbidden",
                "message" => "You are not the game author"
            ]);
        }

        $gameVersions = DB::table("game_versions")->where("game_id", $gameId->id)->get();
        DB::table("games")->where("slug", $slug)->delete();

        foreach($gameVersions as $gameVersion){
            $id = $gameVersion->id;
            DB::table("game_versions")->where("id", $id)->delete();
        }
    }


    public function getUsernameDetail($username){
        $user = DB::table("users")->where("username", $username)->get();
        $userId = DB::table("users")->where("username", $username)->first()->id;
        $game = DB::table("games")->where("created_by", $userId)->get();
        $score = DB::table("scores")
                ->join("game_versions", "game_versions.id", "=", "scores.game_version_id")
                ->join("games", "games.id", "=", "game_versions.game_id")
                ->select("games.slug as slug",
                         "games.title as title",
                         "games.description as description",
                         "scores.score as score",
                         "scores.created_at as timeStamp")
                ->where("scores.user_id", $userId)
                ->orderBy("score", "DESC")
                ->get();
        
        $hightScore = $user->map(function($item) use($game, $score){
            return [
                "username" => $item->username,
                "registeredTimestamp" => $item->created_at,
                "authoredGames" => $game->map(function($itemm) {
                    return [
                        "slug" => $itemm->slug,
                        "title" => $itemm->title,
                        "descrition" => $itemm->description
                    ];
                }),
                "hightScore" => $score->map(function($sigma){
                    return [
                        "game" => [
                            "slug" => $sigma->slug,
                            "title" => $sigma->title,
                            "description" => $sigma->description
                        ],
                        "score" => $sigma->score,
                        "timeStamp" => $sigma->timeStamp
                    ];
                })
            ];
        });

        return response()->json([
            "data" => $hightScore
        ]);
    }


    public function scoreGame($slug){
        $game = DB::table("games")
                ->join("game_versions", "game_versions.game_id", "=", "games.id")
                ->join("scores", "scores.game_version_id", "=", "game_versions.id")
                ->join("users", "users.id", "=", "scores.user_id")
                ->where("games.slug", "=", $slug)
                ->select("users.username as username",
                         "scores.score as score",
                         "scores.created_at as timeStamp")
                ->orderBy("scores.score", "desc")
                ->get();

        return response()->json([
            "scores" => $game
        ]);
    }


    public function postScore(Request $request,$slug){
        $userId = Auth::guard("user")->user()->id;
        $score = $request->score;
        $gameId = DB::table("game_versions")
                ->join("games", "game_versions.game_id", "=", "games.id")
                ->where("games.slug", $slug)
                ->select("game_versions.id as id")
                ->orderBy("game_versions.created_at", "DESC")
                ->first()->id;
        
        DB::table("scores")->insert([
            "user_id" => $userId,
            "game_version_id" => $gameId,
            "score" => $score,
            "created_at" => Carbon::now(),
            "updated_at" => Carbon::now()
        ]);

        return response()->json([
            "message" => "success"
        ]);
    
    }
}
