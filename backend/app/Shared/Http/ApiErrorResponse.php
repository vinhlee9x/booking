<?php

namespace App\Shared\Http;

use Illuminate\Http\JsonResponse;

class ApiErrorResponse
{
    public static function json(
        int $status,
        string $message,
        mixed $errors = null,
        array $headers = [],
        ?string $key = null
    ): JsonResponse {
        return response()->json([
            'code' => $status,
            'errors' => $errors,
            'error' => [
                'code' => $status,
                'message' => $message,
                'errors' => $errors,
                'key' => $key,
            ],
            'msg' => $message,
            'success' => false,
        ], $status, $headers);
    }
}
