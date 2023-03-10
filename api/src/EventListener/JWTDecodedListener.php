<?php
// https://github.com/lexik/LexikJWTAuthenticationBundle/blob/2.x/Resources/doc/2-data-customization.rst

namespace App\EventListener;

use App\Repository\UserRepository;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTDecodedEvent;
use Symfony\Component\HttpFoundation\RequestStack;

/**
 * service: api/config/services
 * acme_api.event.jwt_decoded_listener
 */
class JWTDecodedListener{
	/**
	 * @var RequestStack
	 */
	private $requestStack;

	/**
	 * @var UserRepository
	 */
	private $userRepository;

	/**
	 * @param RequestStack $requestStack
	 */
	public function __construct(RequestStack $requestStack, UserRepository $userRepository){
		$this->requestStack = $requestStack;
		$this->userRepository = $userRepository;
	}

	/**
	 * @param JWTDecodedEvent $event
	 *
	 * @return void
	 */
	public function onJWTDecoded(JWTDecodedEvent $event){
		$request = $this->requestStack->getCurrentRequest();

		$payload = $event->getPayload();

		/**
		 * invalidate token if payload doesn't have 'ip'
		 * or it's different than $request->getClientIp()
		 */
		if (!isset($payload['ip']) || $payload['ip'] !== $request->getClientIp()) {
			$event->markAsInvalid();
		}

		/**
		 * Add additional data to payload
		 */
		// $user = $this->userRepository->findOneByUsername($payload['username']);
		// $payload['custom_user_data'] = $user->getCustomUserInformations();
		// $event->setPayload($payload);
	}
}
