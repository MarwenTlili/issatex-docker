<?php
namespace App\Tests;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use Hautelook\AliceBundle\PhpUnit\ReloadDatabaseTrait;
use Symfony\Component\HttpFoundation\Response;

class TokensTest extends ApiTestCase {
	use ReloadDatabaseTrait;

	public function testToken(){
		/**
		 * init
		 */
		$identifier = 'admin@example.com';
		$password = 'admin';
		$client = self::createClient();	// create symfony HttpClient (to consume API)

		/**
		 * test response without token - should return UNAUTHORIZED
		 */
		$client->request('GET', '/api/users');
		$this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);

		/**
		 * retrive authentication response
		 * and assert it contains 'token' and 'refresh_token'
		 */
		$auth_response = $client->request('POST', '/auth', [
			'headers' => ['Content-Type' => 'application/json'],
			'json' => [
				'email' => $identifier,
				'password' => $password
			]
		]);
		$auth_response_json = $auth_response->toArray();				// decode authentication response as json
        $this->assertResponseIsSuccessful();
		$this->assertArrayHasKey('token', $auth_response_json);			// /auth should return 'token'
		$this->assertArrayHasKey('refresh_token', $auth_response_json);	// /auth should return 'refresh_token'
		
		/**
		 * test retrieved token
		 * by using it (token) to request users list
		 */
		$token = $auth_response_json['token'];
		$client->request('GET', '/api/users', [
			'auth_bearer' => $token
		]);
		$this->assertResponseIsSuccessful();	// assert response status code is 200
        // Asserts that the returned content type is JSON-LD (the default)
		$this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
		// Asserts that the returned JSON is a superset of this one
        $this->assertJsonContains([
            '@context' => '/contexts/User',
            '@id' => '/api/users',
            '@type' => 'hydra:Collection',
            'hydra:totalItems' => 5
        ]);

		/**
		 * test retrieved refresh_token from /auth
		 * by using it (refresh_token) to request /token/refresh
		 * the use 'token' that is retrieved from /token/refresh to request users list
		 */
		$refresh_token_response = $client->request('POST', '/token/refresh', [
			'json' => [
				'refresh_token' => $auth_response_json['refresh_token']
			]
		]);
		$this->assertResponseIsSuccessful();
		$this->assertArrayHasKey('token', $auth_response_json);	// /token/refresh should return 'token'
		$this->assertArrayHasKey('refresh_token', $auth_response_json);	// /token/refresh should return 'refresh_token'
		
		$refresh_token_response_json = $refresh_token_response->toArray();
		// assert that 'refresh_token' return by /token/refresh is the same as 'refresh_token' returned by /auth
		$this->assertEquals($refresh_token_response_json['refresh_token'], $auth_response_json['refresh_token']);
		
		$client->request('GET', '/api/users', [
			'auth_bearer' => $refresh_token_response_json['token']
		]);
		$this->assertResponseIsSuccessful();
		// Asserts that the returned content type is JSON-LD (the default)
		$this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
		// Asserts that the returned JSON is a superset of this one
		$this->assertJsonContains([
			'@context' => '/contexts/User',
			'@id' => '/api/users',
			'@type' => 'hydra:Collection',
			'hydra:totalItems' => 5
		]);

		/**
		 * test invalidate refresh_token
		 * by using 'refresh_token' that is retrieved from /token/refresh to request /token/invalidate 
		 * /!\ we already asserted that 'refresh_token' from /auth is the same as 'refresh_token' from /token/refresh
		 * then test that requesting invalidated 'refresh_token' to /token/refresh is no longer returning new 'token' and same 'refresh_token'
		 */
		$client->request('POST', '/token/invalidate', [
			'json' => [
				'refresh_token' => $refresh_token_response_json['refresh_token']
			]
		]);
		$this->assertResponseIsSuccessful();
		// Asserts that the returned content type is JSON (the default)
		$this->assertResponseHeaderSame('content-type', 'application/json');
		$this->assertJsonContains([
			'message' => 'The supplied refresh_token has been invalidated.'
		]);
		$client->request('GET', '/token/refresh', [
			'json' => [
				'refresh_token' => $refresh_token_response_json['refresh_token']
			]
		]);
		$this->assertResponseStatusCodeSame(401);
		$this->assertJsonContains([
			'message' => 'JWT Refresh Token Not Found'
		]);
	}
	
}
