<?php

namespace App\DataFixtures;

use App\Entity\ManufacturingOrder;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class ManufacturingOrderFixtures extends Fixture implements DependentFixtureInterface
{
	private $faker;

    public function load(ObjectManager $manager): void
    {
		$this->faker = Factory::create();
		$manufacturingOrders = [];

		$tech_docs = array_slice(scandir(getcwd() . '/public/uploads/tech_docs'), 2);
		
		///////////////////////////////////////////////////////////////////////
		// client who create manufacturingOrder1 
		/** @var \App\Entity\Client $client */
		$client = $this->getReference(ClientFixtures::CLIENT1);
		$article = $this->getReference(ArticleFixtures::ARTICLE1);
		
		// ManufacturingOrder creation date should be between Client's Account creation date and 'now'
		// $manufacturingOrder_createdAt = $this->faker->dateTimeBetween('-1 years', 'now');
		$now = new \DateTimeImmutable("now", null);
		$manufacturingOrder_createdAt = $this->randomDateBetween(
			$client->getAccount()->getCreatedAt(), 
			$now
		);
		
		$totalQuantity = $this->faker->randomNumber(3, false);
		$unitPrice = $this->faker->randomFloat(3, 10, 20);
		$manufacturingOrder1 = new ManufacturingOrder();
		// $manufacturingOrder1->setCreatedAt(\DateTimeImmutable::createFromMutable($datetime))
		$manufacturingOrder1->setCreatedAt($manufacturingOrder_createdAt)
			->setTotalQuantity($totalQuantity)
			->setTechnicalDocument($tech_docs[array_rand($tech_docs)])
			->setUnitTime($this->faker->randomNumber(3, true))
			->setUnitPrice($unitPrice)
			->setTotalPrice($totalQuantity*$unitPrice)
			->setObservation($this->faker->text())
			->setUrgent($this->faker->boolean())
			->setLaunched(false)
			->setDenied($this->faker->boolean())
			->setClient($client)
			->setArticle($article);
		array_push($manufacturingOrders, $manufacturingOrder1);
		///////////////////////////////////////////////////////////////////////
		// client who create manufacturingOrder1 
		/** @var \App\Entity\Client $client */
		$client = $this->getReference(ClientFixtures::CLIENT2);
		$article = $this->getReference(ArticleFixtures::ARTICLE2);
		
		// ManufacturingOrder creation date should be between Client's Account creation date and 'now'
		$now = new \DateTimeImmutable("now", null);
		$manufacturingOrder_createdAt = $this->randomDateBetween(
			$client->getAccount()->getCreatedAt(), 
			$now
		);
		
		$totalQuantity = $this->faker->randomNumber(3, false);
		$unitPrice = $this->faker->randomFloat(3, 10, 20);
		$manufacturingOrder2 = new ManufacturingOrder();
		// $manufacturingOrder1->setCreatedAt(\DateTimeImmutable::createFromMutable($datetime))
		$manufacturingOrder2->setCreatedAt($manufacturingOrder_createdAt)
			->setTotalQuantity($totalQuantity)
			->setTechnicalDocument($tech_docs[array_rand($tech_docs)])
			->setUnitTime($this->faker->randomNumber(3, true))
			->setUnitPrice($unitPrice)
			->setTotalPrice($totalQuantity*$unitPrice)
			->setObservation($this->faker->text())
			->setUrgent($this->faker->boolean())
			->setLaunched(false)
			->setDenied($this->faker->boolean())
			->setClient($client)
			->setArticle($article);
		array_push($manufacturingOrders, $manufacturingOrder2);
		///////////////////////////////////////////////////////////////////////

		foreach($manufacturingOrders as $manufacturingOrder){
			$manager->persist($manufacturingOrder);
		}
        $manager->flush();
    }

	private function randomDateBetween(\DateTimeImmutable $start, \DateTimeImmutable $end) {
		$randomTimestamp = mt_rand($start->getTimestamp(), $end->getTimestamp());

		$date = new \DateTimeImmutable();
		$randomDate = $date->setTimestamp($randomTimestamp);
		
		return $randomDate;
	}

	public function getDependencies(){
		return  [
			ClientFixtures::class,
			ArticleFixtures::class
		];
	}
}
