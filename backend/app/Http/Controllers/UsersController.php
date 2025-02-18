<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Validator;
use Illuminate\Support\Facades\Hash;

class UsersController extends Controller
{
    public function getAllAdmins(){
        $user = DB::table("users")
        ->select("users.username", "users.last_login_at", "users.created_at", "users.updated_at");

        $userGet = $user->get();
        $userCount = $user->count();
        
        return response()->json([
            "total_element" => $userCount,
            "content" => $userGet
        ]);
    }

    public function updateUser(Request $request ,$id){
        $validate = Validator::make($request->all(), [
            "username" => "required|unique:users,username|min:4|max:60",
            "password" => "required|min:5|max:10"
        ], [
            "username.unique" => "Username already exists"
        ]);

        if($validate->fails()){
            return response()->json([
                "status" => "invalid",
                "message" => $validate->errors()
            ]);
        }

        DB::table("users")->where("id", $id)->update([
            "username" => $request->username,
            "password" => Hash::make($request->password)
        ]);

        $username = DB::table("users")->where("id", $id)->first()->username;

        return response()->json([
            "status" => "success",
            "username" => $username
        ]);
    }


    public function deleteUser($id){
        $user =  DB::table("users")->where("id", $id)->first();

        if(!$user){
            return response()->json([
                "status" => "not-found",
                "message" => "User Not found"
            ], 403);
        }

        DB::table("users")->where("id", $id)->delete();

        return response()->json([
            "message" => "success delete data user"
        ]);
    }
}
