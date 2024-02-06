<?php

namespace App\EventListener;

use App\Entity\Ilot;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsDoctrineListener;
use Doctrine\ORM\Event\PreRemoveEventArgs;
use Doctrine\ORM\Events;

#[AsDoctrineListener(event: Events::preRemove, priority: 500, connection: 'default')]
class IlotListener {
    public function preRemove(PreRemoveEventArgs $args) {
        $entity = $args->getObject();

        if (!$entity instanceof Ilot) {
            return;
        }

        /**
         * since Ilot.machines and Ilot.employees are OneToMany
         * remove the many references (ex: machines, employees)
         * before removing Ilot record
         */
        $machines = $entity->getMachines();
        foreach ($machines as $key => $machine) {
            $entity->removeMachine($machine);
        }

        $employees = $entity->getEmployees();
        foreach ($employees as $key => $employee) {
            $entity->removeEmployee($employee);
        }

        /**
         * persist
         */
        $entityManager = $args->getObjectManager();
        $entityManager->persist($entity);
        $entityManager->flush();
    }
}
