<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Item;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index()
    {
        $cart = $this->getCart()->load(['items.item']);
        $this->syncCartTotals($cart);

        return response()->json($this->formatCart($cart->fresh(['items.item'])));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'item_id' => 'required|integer',
            'quantity' => 'sometimes|integer|min:1',
        ]);

        $item = Item::on('mysql_second')->find($validated['item_id']);

        if (! $item) {
            return response()->json(['message' => 'Item not found.'], 404);
        }

        $cart = $this->getCart();
        $quantity = (int) ($validated['quantity'] ?? 1);

        $cartItem = CartItem::firstOrNew([
            'cart_id' => $cart->id,
            'item_id' => $item->id,
        ]);

        $cartItem->quantity = (int) ($cartItem->exists ? $cartItem->quantity : 0) + $quantity;
        $cartItem->unit_price = $item->itemprice;
        $cartItem->line_total = $cartItem->quantity * $item->itemprice;
        $cartItem->save();

        $cart->load(['items.item']);
        $this->syncCartTotals($cart);

        return response()->json($this->formatCart($cart->fresh(['items.item'])), 201);
    }

    public function update(Request $request, int $itemId)
    {
        $validated = $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cart = $this->getCart();
        $cartItem = CartItem::where('cart_id', $cart->id)->where('item_id', $itemId)->first();

        if (! $cartItem) {
            return response()->json(['message' => 'Cart item not found.'], 404);
        }

        $item = Item::on('mysql_second')->find($itemId);

        if (! $item) {
            return response()->json(['message' => 'Item not found.'], 404);
        }

        $cartItem->quantity = (int) $validated['quantity'];
        $cartItem->unit_price = $item->itemprice;
        $cartItem->line_total = $cartItem->quantity * $item->itemprice;
        $cartItem->save();

        $cart->load(['items.item']);
        $this->syncCartTotals($cart);

        return response()->json($this->formatCart($cart->fresh(['items.item'])));
    }

    public function destroy(int $itemId)
    {
        $cart = $this->getCart();
        $deleted = CartItem::where('cart_id', $cart->id)->where('item_id', $itemId)->delete();

        if (! $deleted) {
            return response()->json(['message' => 'Cart item not found.'], 404);
        }

        $cart->load(['items.item']);
        $this->syncCartTotals($cart);

        return response()->json($this->formatCart($cart->fresh(['items.item'])));
    }

    public function clear()
    {
        $cart = $this->getCart();
        $cart->items()->delete();
        $cart->update([
            'item_count' => 0,
            'total_amount' => 0,
        ]);

        return response()->json($this->formatCart($cart->fresh(['items.item'])));
    }

    protected function getCart(): Cart
    {
        return Cart::firstOrCreate(
            ['user_id' => auth()->id()],
            ['status' => 'active', 'currency' => 'USD', 'item_count' => 0, 'total_amount' => 0]
        );
    }

    protected function syncCartTotals(Cart $cart): void
    {
        $cart->loadMissing('items');

        $cart->update([
            'item_count' => (int) $cart->items->sum('quantity'),
            'total_amount' => (float) $cart->items->sum('line_total'),
        ]);
    }

    protected function formatCart(Cart $cart): array
    {
        return [
            'id' => $cart->id,
            'user_id' => $cart->user_id,
            'status' => $cart->status,
            'currency' => $cart->currency,
            'item_count' => $cart->item_count,
            'total_amount' => $cart->total_amount,
            'items' => $cart->items->map(function (CartItem $cartItem) {
                return [
                    'id' => $cartItem->id,
                    'item_id' => $cartItem->item_id,
                    'quantity' => $cartItem->quantity,
                    'unit_price' => $cartItem->unit_price,
                    'line_total' => $cartItem->line_total,
                    'item' => $cartItem->relationLoaded('item') ? $cartItem->item : null,
                ];
            })->values(),
        ];
    }
}

