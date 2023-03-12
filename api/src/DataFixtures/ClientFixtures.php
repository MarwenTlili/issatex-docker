<?php

namespace App\DataFixtures;

use App\Entity\Client;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class ClientFixtures extends Fixture implements DependentFixtureInterface
{
	public const CLIENT1 = "CLIENT1";
	public const CLIENT2 = "CLIENT2";
	public const CLIENT3 = "CLIENT3";
	public const CLIENT4 = "CLIENT4";
	
	private $faker;
	
    public function load(ObjectManager $manager): void
    {
		$this->faker = Factory::create();
		$clients = [];

		///////////////////////////////////////////////////////////////////////
		$client1 = new Client();
		$client1->setName($this->faker->company())
			->setPhone($this->faker->phoneNumber())
			->setIsValid($this->faker->randomElement([true, false]))
			->setIsPrivileged($this->faker->randomElement([true, false]))
			->setAccount($this->getReference(UserFixtures::USER2_CLIENT));
		array_push($clients, $client1);
		///////////////////////////////////////////////////////////////////////
		$client2 = new Client();
		$client2->setName($this->faker->company())
			->setPhone($this->faker->phoneNumber())
			->setIsValid($this->faker->randomElement([true, false]))
			->setIsPrivileged($this->faker->randomElement([true, false]))
			->setAccount($this->getReference(UserFixtures::USER3_CLIENT));
		array_push($clients, $client2);
		///////////////////////////////////////////////////////////////////////
		$client3 = new Client();
		$client3->setName($this->faker->company())
			->setPhone($this->faker->phoneNumber())
			->setIsValid($this->faker->randomElement([true, false]))
			->setIsPrivileged($this->faker->randomElement([true, false]))
			->setAccount($this->getReference(UserFixtures::USER4_CLIENT));
		array_push($clients, $client3);
		///////////////////////////////////////////////////////////////////////
		$client4 = new Client();
		$client4->setName($this->faker->company())
			->setPhone($this->faker->phoneNumber())
			->setIsValid($this->faker->randomElement([true, false]))
			->setIsPrivileged($this->faker->randomElement([true, false]))
			->setAccount($this->getReference(UserFixtures::USER5_CLIENT));
		array_push($clients, $client4);
		///////////////////////////////////////////////////////////////////////
		foreach ($clients as $client) {
			$manager->persist($client);
		}
        $manager->flush();

		$this->addReference(self::CLIENT1, $client1);
		$this->addReference(self::CLIENT2, $client2);
		$this->addReference(self::CLIENT3, $client3);
		$this->addReference(self::CLIENT4, $client4);
		///////////////////////////////////////////////////////////////////////
    }

	public function getDependencies(){
		return [
            UserFixtures::class
        ];
	}
}
