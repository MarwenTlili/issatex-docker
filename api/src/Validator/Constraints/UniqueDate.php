<?php

namespace App\Validator\Constraints;

use Symfony\Component\Validator\Constraint;

/**
 * Check if another entity with the same day and associated entity/field exists
 */
#[\Attribute]
class UniqueDate extends Constraint {
    public $field;
    public string $message = 'This field must be unique for the {{ field }}.';

    public function __construct(string $field = null, string $message = null, array $groups = null, $payload = null) {
        parent::__construct([], $groups, $payload);

        $this->field = $field ?? $this->field;
        $this->message = $message ?? $this->message;
    }
}
