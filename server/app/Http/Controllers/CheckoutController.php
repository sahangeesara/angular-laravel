<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Item;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CheckoutController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'payment_method' => 'required|string|max:50',
            'billing_name' => 'sometimes|string|max:255',
            'billing_email' => 'sometimes|email|max:255',
            'notes' => 'sometimes|string|max:1000',
            'currency' => 'sometimes|string|max:10',
        ]);

        $cart = Cart::with('items')->firstOrCreate(
            ['user_id' => auth()->id()],
            ['status' => 'active', 'currency' => $validated['currency'] ?? 'USD', 'item_count' => 0, 'total_amount' => 0]
        );

        if ($cart->items->isEmpty()) {
            return response()->json(['message' => 'Your cart is empty.'], 422);
        }

        $user = auth()->user();
        $currency = $validated['currency'] ?? $cart->currency ?? 'USD';

        $result = DB::transaction(function () use ($cart, $validated, $user, $currency, $request) {
            $cart->load('items');

            $order = Order::create([
                'order_number' => 'ORD-' . Str::upper(Str::random(10)),
                'user_id' => $user->id,
                'cart_id' => $cart->id,
                'status' => 'pending',
                'payment_status' => 'pending',
                'payment_method' => $validated['payment_method'],
                'currency' => $currency,
                'subtotal' => $cart->items->sum('line_total'),
                'shipping_amount' => 0,
                'tax_amount' => 0,
                'total_amount' => $cart->items->sum('line_total'),
                'billing_name' => $validated['billing_name'] ?? $user->name,
                'billing_email' => $validated['billing_email'] ?? $user->email,
                'notes' => $validated['notes'] ?? null,
            ]);

            foreach ($cart->items as $cartItem) {
                $item = Item::on('mysql_second')->find($cartItem->item_id);

                OrderItem::create([
                    'order_id' => $order->id,
                    'item_id' => $cartItem->item_id,
                    'item_name' => $item?->itemname ?? 'Unknown item',
                    'item_code' => $item?->itemcode,
                    'quantity' => $cartItem->quantity,
                    'unit_price' => $cartItem->unit_price,
                    'line_total' => $cartItem->line_total,
                ]);
            }

            $payment = Payment::create([
                'order_id' => $order->id,
                'user_id' => $user->id,
                'provider' => $validated['payment_method'],
                'reference' => 'PAY-' . Str::upper(Str::random(12)),
                'amount' => $order->total_amount,
                'currency' => $currency,
                'status' => 'pending',
                'payload' => $request->except(['notes']),
            ]);

            $cart->items()->delete();
            $cart->update([
                'currency' => $currency,
                'item_count' => 0,
                'total_amount' => 0,
                'status' => 'active',
            ]);

            return compact('order', 'payment');
        });

        return response()->json([
            'message' => 'Checkout created successfully.',
            'order' => $result['order']->load('items'),
            'payment' => $result['payment']->load('order'),
        ], 201);
    }
}

