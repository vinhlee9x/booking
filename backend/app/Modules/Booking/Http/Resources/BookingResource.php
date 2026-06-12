<?php

namespace App\Modules\Booking\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->resource->id,
            'room_id' => $this->resource->room_id,
            'user_name' => $this->resource->user_name,
            'start_time' => $this->resource->start_time->toIso8601String(),
            'end_time' => $this->resource->end_time->toIso8601String(),
        ];
    }
}
