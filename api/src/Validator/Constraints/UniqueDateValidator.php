<?php

namespace App\Validator\Constraints;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

final class UniqueDateValidator extends ConstraintValidator {
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager) {
        $this->entityManager = $entityManager;
    }

    public function validate(mixed $value, Constraint $constraint): void {
        if (!$value instanceof \DateTimeInterface) {
            return;
        }

        // Class where validation used (DailyProduction)
        $class = $this->context->getClassName();

        // field passed in params (weeklySchedule)
        $field = $constraint->field;

        // Entity with it's fields values (instance of $class)
        $object = $this->context->getObject();

        if (!property_exists($class, $field)) {
            throw new \InvalidArgumentException(sprintf('The property "%s" does not exist in class "%s"', $field, $class));
        }

        $getter = 'get' . ucfirst($field);
        $associatedEntity = $object->$getter();

        $existingEntity = $this->entityManager->getRepository($class)->findOneBy([
            'day' => $value,
            $field => $associatedEntity,
        ]);

        if ($existingEntity && $existingEntity !== $object) {
            $this->context->buildViolation($constraint->message)
                ->setParameter('{{ day }}', $value->format('Y-m-d'))
                ->setParameter('{{ field }}', $field)
                ->addViolation();
        }
    }
}
