<?php
// https://github.com/lexik/LexikJWTAuthenticationBundle/blob/2.x/Resources/doc/2-data-customization.rst

namespace App\EventListener;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;
use Symfony\Component\HttpFoundation\RequestStack;

/**
 * service: api/config/services.yml
 * acme_api.event.jwt_created_listener
 */
class JWTCreatedListener{
	/**
	 * @var RequestStack
	 */
	private $requestStack;

	/**
	 * @param RequestStack $requestStack
	 */
	public function __construct(RequestStack $requestStack){
		$this->requestStack = $requestStack;
	}

	/**
	 * @param JWTCreatedEvent $event
	 * Adding custom data or headers to the JWT
	 * @return void
	 */
	public function onJWTCreated(JWTCreatedEvent $event){
		$request = $this->requestStack->getCurrentRequest();
		$payload = $event->getData();
		
		/**
		 * Add client IP address to the encoded payload
		 */
		/** @var App/Entity/User $user */
		$user = $event->getUser();
		$payload['username'] = $user->getUserName();

		// add avatar path to token payload
		$payload['avatar'] = $user->getAvatar();
		
		// add client ip address to payload
		$payload['ip'] = $request->getClientIp();
		
		$header = $event->getHeader();
		$header['cty'] = 'JWT';
		
		/**
		 * Override token expiration date calculation to be more flexible
		 */
		$expiration = new \DateTime('+1 day');
		$expiration->setTime(2, 0, 0);
		$payload['exp'] = $expiration->getTimestamp();
		
		$event->setData($payload);

		$event->setHeader($header);
	}
}
