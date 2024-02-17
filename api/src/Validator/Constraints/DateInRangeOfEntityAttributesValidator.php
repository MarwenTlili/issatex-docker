<?php

namespace App\Validator\Constraints;

use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

final class DateInRangeOfEntityAttributesValidator extends ConstraintValidator {
    public function __construct() {
    }

    public function validate($value, Constraint $constraint) {
        if (!$value instanceof \DateTimeInterface) {
            return;
        }

        // Class where validation called
        $class = $this->context->getClassName();

        // Instance of Class where validation called
        $object = $this->context->getObject();

        // validator arguments
        $targetEntity = $constraint->targetEntity;
        $startAtField = $constraint->startAtField;
        $endAtField = $constraint->endAtField;

        // validator field value
        $day = $value;

        if (!property_exists($class, $targetEntity)) {
            throw new \InvalidArgumentException(
                sprintf('The property "%s" does not exist in class "%s"', $targetEntity, $class)
            );
        }

        $targetEntityGetter = 'get' . ucfirst($targetEntity);
        $associatedEntity = $object->$targetEntityGetter();

        /** @var \DateTimeInterface $startAt */
        $startAt = $associatedEntity->{'get' . $startAtField}();
        /** @var \DateTimeInterface $endAt */
        $endAt = $associatedEntity->{'get' . $endAtField}();

        if ($day < $startAt || $day > $endAt) {
            $this->context->buildViolation($constraint->message)
                ->setParameter('{{ day }}', $day->format('Y-m-d'))
                ->setParameter('{{ targetEntity }}', $targetEntity)
                ->setParameter('{{ startAtField }}', $startAt->format('Y-m-d'))
                ->setParameter('{{ endAtField }}', $endAt->format('Y-m-d'))
                ->addViolation();
        }
    }
}
