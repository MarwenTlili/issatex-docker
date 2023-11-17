<?php

namespace App\EventListener;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use DateTimeImmutable;
use DateTimeZone;

/**
 * registered in "config/services" -> "App\EventListener\SignInListener"
 */
class SignInListener implements EventSubscriberInterface {
    private $entityManagerInterface;

    public function __construct(EntityManagerInterface $entityManagerInterface) {
        $this->entityManagerInterface = $entityManagerInterface;
    }

    function onAuthenticationSuccess(AuthenticationSuccessEvent $event) {
        $data = $event->getData();
        $user = $event->getUser();

        if ($user instanceof User) {
            $timezone = new DateTimeZone('Africa/Tunis');
            $user->setLastLoginAt(new DateTimeImmutable('now', $timezone));
        }

        $event->setData($data);

        // persist data using doctrine
        $this->entityManagerInterface->persist($user);
        $this->entityManagerInterface->flush();
    }

    public static function getSubscribedEvents() {
        return [
            'lexik_jwt_authentication.on_authentication_success' => 'onAuthenticationSuccess'
        ];
    }
}
