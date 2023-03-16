<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SecurityCheckRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'tap_id' => '',
            'booking_reference_number' => '',
            'reference_number' => '',
            'new_reference_number' => '',
            'scan_status' => '',
            'status' => '',
            'checklists' => '',
            'additional_vehicles' => '',
            'additional_guests' => '',
            'action_taken' => '',
            'guest_vehicles' => '',
            'booking_guest_vehicles' => '',
            'invalid_notes' => '',
            'notes' => '',
        ];
    }
}
