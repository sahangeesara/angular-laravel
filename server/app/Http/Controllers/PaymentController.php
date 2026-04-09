<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class PaymentController extends Controller
{
    public function show(int $paymentId)
    {
        $payment = Payment::with(['order.items', 'order'])->where('user_id', auth()->id())->find($paymentId);

        if (! $payment) {
            return response()->json(['message' => 'Payment not found.'], 404);
        }

        return response()->json($payment);
    }

    public function confirm(Request $request, int $paymentId)
    {
        $validated = $request->validate([
            'status' => 'required|in:paid,failed,cancelled,refunded',
            'reference' => 'sometimes|string|max:255',
            'provider' => 'sometimes|string|max:100',
        ]);

        $payment = Payment::with('order')->where('user_id', auth()->id())->find($paymentId);

        if (! $payment) {
            return response()->json(['message' => 'Payment not found.'], 404);
        }

        $payment->status = $validated['status'];
        if (! empty($validated['reference'])) {
            $payment->reference = $validated['reference'];
        }
        if (! empty($validated['provider'])) {
            $payment->provider = $validated['provider'];
        }
        if ($validated['status'] === 'paid') {
            $payment->paid_at = Carbon::now();
        }
        $payment->save();

        if ($payment->order) {
            $payment->order->update([
                'payment_status' => $validated['status'],
                'status' => $validated['status'] === 'paid' ? 'paid' : $validated['status'],
            ]);
        }

        return response()->json([
            'message' => 'Payment updated successfully.',
            'payment' => $payment->fresh(['order.items', 'order']),
        ]);
    }
}

