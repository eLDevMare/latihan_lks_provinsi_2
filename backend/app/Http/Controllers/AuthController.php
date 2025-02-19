<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Admin;
use PHPOpenSource\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Validator;
use Carbon\Carbon;

class AuthController extends Controller
{
    public function signUpUser(Request $request){
        $validate = Validator::make($request->all(), [
            "username" => "required|min:4|max:60",
            "password" =>  "required|min:5|max:10"
        ]);

        if($validate->fails()){
            return response()->json([
                "message" => $validate->errors() 
            ],422);
        }

        User::query()->create([
            "username" => $request->username,
            "password" => Hash::make($request->password)
        ]);

        if(!$token = Auth::guard("user")->attempt($request->only("username", "password"))){
            return response()->json([
                "message" => "token not found"
            ],404);
        }


        return response()->json([
            "status" => "success",
            "token" => $token
        ]);
    }

    public function signInUser(Request $request){
        $validate = Validator::make($request->all(), [
            "username" => "required|min:4|max:60",
            "password" =>  "required|min:5|max:10"
        ]);


        if($validate->fails()){
            return response()->json([
                "status" => "invalid",
                "message" => "Wrong username or password" 
            ],422);
        }


        if($token = Auth::guard("user")->attempt($request->only("username", "password"))){
            User::query()->where("username", $request->username)->update([
                "last_login_at" => Carbon::now()
            ]);

            return response()->json([
                "status" => "success user",
                "token" => $token
            ]);
        }

        if($token = Auth::guard("admin")->attempt($request->only("username", "password"))){
            Admin::query()->where("username", $request->username)->update([
                "last_login_at" => Carbon::now()
            ]);

            return response()->json([
                "status" => "success admin",
                "token" => $token
            ]);
        }

        return response()->json([
            "message" => "invalid"
        ]);
    }


    public function signOutUser(){
        Auth::guard('user')->logout();
        return response()->json([
            "status" => "success"
        ]);
    }

    public function me(){
        $user = Auth::guard("user")->user();
        $admin = Auth::guard("admin")->user();
        if($user){
            return response()->json($user->username);
        }

        if($admin){
            return response()->json($admin->username);
        }
    }

}
