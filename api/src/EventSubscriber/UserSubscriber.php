<?php

namespace App\EventSubscriber;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use App\Entity\User;

class UserSubscriber implements EventSubscriberInterface {
    public static function getSubscribedEvents() {
		return [
			KernelEvents::VIEW => ["onPost", EventPriorities::POST_WRITE],	
		];
	}
	
	public function onPost(ViewEvent $event) {
		$method = $event->getRequest()->getMethod();
		$postData = $event->getControllerResult();
		
		if ($method === "POST" && $postData instanceof User){
			/**
			 * only detect User post event
			 * example: send email verification code to user
			 * try: https://github.com/SymfonyCasts/verify-email-bundle
			 */
		}
	}
	
}
