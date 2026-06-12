<?php

namespace App\Shared\Http\Concerns;

use Illuminate\Http\JsonResponse;

trait RespondsWithApiResponse
{
    protected function successResponse(mixed $data = null, ?string $msg = null, int $status = 200): JsonResponse
    {
        return response()->json([
            'code' => $status,
            'data' => $data,
            'msg' => $msg,
            'success' => true,
        ], $status);
    }

    protected function errorResponse(
        string $msg,
        mixed $errors = null,
        int $status = 400,
        ?string $key = null
    ): JsonResponse {
        return response()->json([
            'code' => $status,
            'errors' => $errors,
            'error' => [
                'code' => $status,
                'message' => $msg,
                'errors' => $errors,
                'key' => $key,
            ],
            'msg' => $msg,
            'success' => false,
        ], $status);
    }
}
