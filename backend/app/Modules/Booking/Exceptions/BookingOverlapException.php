<?php

namespace App\Modules\Booking\Exceptions;

use Exception;

class BookingOverlapException extends Exception
{
    public function __construct(string $message = 'Booking overlaps an existing booking for this room.')
    {
        parent::__construct($message);
    }
}
