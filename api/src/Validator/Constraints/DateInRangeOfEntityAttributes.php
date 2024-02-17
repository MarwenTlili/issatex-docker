<?php

namespace App\Validator\Constraints;

use Symfony\Component\Validator\Constraint;

#[\Attribute]
class DateInRangeOfEntityAttributes extends Constraint {
    public $targetEntity;
    public $startAtField;
    public $endAtField;
    public string $message = 'This date must be between {{ startAtField }} and {{ endAtField }} of {{ targetEntity }}.';

    public function __construct(
        string $targetEntity = null,
        string $startAtField = null,
        string $endAtField = null,
        string $message = null,
        array $groups = null,
        $payload = null
    ) {
        parent::__construct([], $groups, $payload);

        $this->targetEntity = $targetEntity ?? $this->targetEntity;
        $this->startAtField = $startAtField ?? $this->startAtField;
        $this->endAtField = $endAtField ?? $this->endAtField;

        $this->message = $message ?? $this->message;
    }
}
