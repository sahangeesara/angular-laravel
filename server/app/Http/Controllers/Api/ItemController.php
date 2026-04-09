<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $items = Item::all();
            return response()->json($items);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving items.'], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->all();
        $validatedData = validator($data, [
            'itemname' => 'required|max:255',
            'itemprice' => 'required|numeric',
            'itemcode' => 'required',
            'image' => 'required|image',
        ]);
        if ($validatedData->fails()) {
            return response()->json(['errors' => $validatedData->errors()], 422);
        }
        $item = new Item();
        $item->itemname = $data['itemname'];
        $item->itemprice = $data['itemprice'];
        $item->itemcode = $data['itemcode'];
        $item->image = $request->file('image')->store('public/item/images');
        $item->save();
        return response()->json(['message' => 'Item created successfully', 'item' => $item], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $item = Item::find($id);
        if (!$item) {
            return response()->json(['message' => 'Item not found'], 404);
        }
        return response()->json($item);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $item = Item::find($id);
        if (!$item) {
            return response()->json(['message' => 'Item not found'], 404);
        }
        $data = $request->all();
        $validatedData = validator($data, [
            'itemname' => 'sometimes|required|max:255',
            'itemprice' => 'sometimes|required|numeric',
            'itemcode' => 'sometimes|required',
            'image' => 'sometimes|image',
        ]);
        if ($validatedData->fails()) {
            return response()->json(['errors' => $validatedData->errors()], 422);
        }
        if (isset($data['itemname'])) $item->itemname = $data['itemname'];
        if (isset($data['itemprice'])) $item->itemprice = $data['itemprice'];
        if (isset($data['itemcode'])) $item->itemcode = $data['itemcode'];
        if ($request->hasFile('image')) {
            $item->image = $request->file('image')->store('public/item/images');
        }
        $item->save();
        return response()->json(['message' => 'Item updated successfully', 'item' => $item]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $item = Item::find($id);
        if (!$item) {
            return response()->json(['message' => 'Item not found'], 404);
        }
        $item->delete();
        return response()->json(['message' => 'Item deleted successfully']);
    }
}
