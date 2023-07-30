<?php

namespace App\Tests;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\MediaObject;
use Hautelook\AliceBundle\PhpUnit\RefreshDatabaseTrait;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class MediaObjectTest extends ApiTestCase {
    use RefreshDatabaseTrait;

    private $token;

	function setUp(): void {
		$this->token = $this->getToken();
	}

    public function testCreateAMediaObject(): void {
        $file = new UploadedFile('fixtures/files/image.png', 'image.png');
        $client = static::createClient();

        $client->request('POST', '/api/media_objects', [
            'auth_bearer' => $this->token,
            'headers' => ['Content-Type' => 'multipart/form-data'],
            'extra' => [
                // If you have additional fields in your MediaObject entity, use the parameters.
                // 'parameters' => [
                //     'title' => 'image uploaded',
                // ],
                'files' => [
                    'file' => $file,
                ],
            ]
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertMatchesResourceItemJsonSchema(MediaObject::class);
        // $this->assertJsonContains([
        //     'title' => 'image uploaded',
        // ]);
    }

    public function getToken(): string {
        $response = static::createClient()->request('POST', '/auth', [
			'headers' => ['Content-Type' => 'application/json'],
			'json' => [
				'email' => 'admin@example.com',
				'password' => 'admin',
				]
			]
		);
        $json = $response->toArray();
		return $json['token'];
    }
}
