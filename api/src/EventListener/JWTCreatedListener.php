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

        /** @var App/Entity/User $user */
		$user = $event->getUser();

		// add user's username to token payload
		$payload['username'] = $user->getUserName();

		// add user's id to token payload
        $payload['id'] = $user->getId();

		// add avatar path to token payload
        /** @var App/Entity/MediaObject $avatar */
        $avatar = $user->getAvatar();
        $payload['avatarContentUrl'] = $avatar? $avatar->getContentUrl() : null;     // ternary

		// add client ip address to payload
		$payload['ip'] = $request->getClientIp();

		$header = $event->getHeader();
		$header['cty'] = 'JWT';

		/**
         * Override token expiration date calculation to be more flexible
		 */
        $expiration = new \DateTime('+1 day');  // options: +1 minutes, +1 hours
		// $expiration->setTime(2, 0, 0);
		$payload['exp'] = $expiration->getTimestamp();
		
		// add isVerified to payload
		$payload['isVerified'] = $user->isIsVerified();

        /**
         * How To: add additional data
         * https://github.com/lexik/LexikJWTAuthenticationBundle/blob/2.x/Resources/doc/2-data-customization.rst#example-add-additional-data-to-payload---to-get-it-in-your-doccustom-userprovider-8-jwt-user-provider
         */
        // $user = $this->userRepository->findOneByUsername($payload['username']);
        // $payload['custom_user_data'] = $user->getCustomUserInformations();

		$event->setData($payload);

		$event->setHeader($header);
	}
}
