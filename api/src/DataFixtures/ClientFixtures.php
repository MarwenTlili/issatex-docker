<?php

namespace App\DataFixtures;

use App\Entity\Client;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class ClientFixtures extends Fixture implements DependentFixtureInterface {
	protected $faker;

	public const CLIENT1 = "CLIENT1";
	public const CLIENT2 = "CLIENT2";

	public function load(ObjectManager $manager): void {
		$this->faker = Factory::create();
		$clients = [];

		///////////////////////////////////////////////////////////////////////
		$client1 = new Client();
		$client1->setName($this->faker->company())
			->setPhone($this->faker->phoneNumber())
			->setIsPrivileged($this->faker->randomElement([true, false]))
			->setAccount($this->getReference(UserFixtures::USER1));
		array_push($clients, $client1);
		///////////////////////////////////////////////////////////////////////
		$client2 = new Client();
		$client2->setName($this->faker->company())
			->setPhone($this->faker->phoneNumber())
			->setIsPrivileged($this->faker->randomElement([true, false]))
			->setAccount($this->getReference(UserFixtures::USER2));
		array_push($clients, $client2);

		///////////////////////////////////////////////////////////////////////
		foreach ($clients as $client) {
			$manager->persist($client);
		}
		$manager->flush();

		$this->addReference(self::CLIENT1, $client1);
		$this->addReference(self::CLIENT2, $client2);
		///////////////////////////////////////////////////////////////////////
	}

	public function getDependencies() {
		return [
			UserFixtures::class
		];
	}
}
