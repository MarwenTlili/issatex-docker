<?php

namespace App\EventListener;

use Doctrine\ORM\Event\PostPersistEventArgs;
use App\Entity\WeeklySchedule;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsDoctrineListener;
use Doctrine\ORM\Event\PostRemoveEventArgs;
use Doctrine\ORM\Events;

#[AsDoctrineListener(event: Events::postPersist, priority: 500, connection: 'default')]
#[AsDoctrineListener(event: Events::postRemove, priority: 500, connection: 'default')]
class WeeklyScheduleListener {
    public function postPersist(PostPersistEventArgs $args): void {
        $entity = $args->getObject();

        if (!$entity instanceof WeeklySchedule) {
            return;
        }

        /**
         * automatically set ManufacturingOrder.launched to true when it's(ManufacturingOrder) scheduled
         */
        $manufacturingOrder = $entity->getManufacturingOrder();
        $manufacturingOrder->setLaunched(true);
        $entityManager = $args->getObjectManager();
        $entityManager->persist($manufacturingOrder);
        $entityManager->flush();
    }

    function postRemove(PostRemoveEventArgs $args) {
        $entity = $args->getObject();

        if (!$entity instanceof WeeklySchedule) {
            return;
        }

        /**
         * automatically set ManufacturingOrder.launched to false when it's(ManufacturingOrder) unscheduled
         */
        $manufacturingOrder = $entity->getManufacturingOrder();
        $manufacturingOrder->setLaunched(false);
        $entityManager = $args->getObjectManager();
        $entityManager->persist($manufacturingOrder);
        $entityManager->flush();
    }
}
