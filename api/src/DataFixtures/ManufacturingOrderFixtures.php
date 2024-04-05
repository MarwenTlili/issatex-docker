<?php

namespace App\DataFixtures;

use App\Entity\ManufacturingOrder;
use App\Entity\ManufacturingOrderSize;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class ManufacturingOrderFixtures extends Fixture implements DependentFixtureInterface {
	protected $faker;

	public function load(ObjectManager $manager): void {
		$this->faker = Factory::create();
		$now = new \DateTimeImmutable('now');

		///////////////////////////////////////////////////////////////////////
		$unitPrice = $this->faker->randomNumber(2, true);
		$manufacturingOrder1 = new ManufacturingOrder();

		// set order sizes
		$orderSize1M = new ManufacturingOrderSize();
		$orderSize1M->setSize($this->getReference(SizeFixtures::MEDIUM))
			->setQuantity($this->faker->numberBetween(100, 1000))
			->setManufacturingOrder($manufacturingOrder1);
		$manager->persist($orderSize1M);
		$orderSize1L = new ManufacturingOrderSize();
		$orderSize1L->setSize($this->getReference(SizeFixtures::LARGE))
			->setQuantity($this->faker->numberBetween(100, 1000))
			->setManufacturingOrder($manufacturingOrder1);
		$manager->persist($orderSize1L);
		$orderSize1XL = new ManufacturingOrderSize();
		$orderSize1XL->setSize($this->getReference(SizeFixtures::EXTRA_LARGE))
			->setQuantity($this->faker->numberBetween(100, 1000))
			->setManufacturingOrder($manufacturingOrder1);
		$manager->persist($orderSize1XL);

		// total quantity of sizes
		$totalQuantity = $orderSize1M->getQuantity() + $orderSize1L->getQuantity() + $orderSize1XL->getQuantity();

		$lastWeek = date('Y-m-d', strtotime('-1 week', strtotime($now->format('Y-m-d'))));
		// monday of last week
		$createdAt = date('Y-m-d', strtotime('last monday', strtotime($lastWeek)));

		$manufacturingOrder1->setCreatedAt(new \DateTimeImmutable($createdAt))
			->setTotalQuantity($totalQuantity)
			->setUnitTime($this->faker->randomNumber(3, true))
			->setUnitPrice($this->faker->randomNumber(2, true))
			->setTotalPrice($totalQuantity * $unitPrice)
			->setObservation($this->faker->text())
			->setUrgent($this->faker->boolean())
			->setLaunched(false)
			->setDenied($this->faker->boolean())
			->setClient($this->getReference(ClientFixtures::CLIENT1))
			->setArticle($this->getReference(ArticleFixtures::ARTICLE1));
		$manager->persist($manufacturingOrder1);
		///////////////////////////////////////////////////////////////////////
		$unitPrice = $this->faker->randomNumber(2, true);
		$manufacturingOrder2 = new ManufacturingOrder();

		// set order sizes
		$orderSize2M = new ManufacturingOrderSize();
		$orderSize2M->setSize($this->getReference(SizeFixtures::MEDIUM))
			->setQuantity($this->faker->numberBetween(100, 1000))
			->setManufacturingOrder($manufacturingOrder2);
		$manager->persist($orderSize2M);
		$orderSize2L = new ManufacturingOrderSize();
		$orderSize2L->setSize($this->getReference(SizeFixtures::LARGE))
			->setQuantity($this->faker->numberBetween(100, 1000))
			->setManufacturingOrder($manufacturingOrder2);
		$manager->persist($orderSize2L);
		$orderSize2XL = new ManufacturingOrderSize();
		$orderSize2XL->setSize($this->getReference(SizeFixtures::EXTRA_LARGE))
			->setQuantity($this->faker->numberBetween(100, 1000))
			->setManufacturingOrder($manufacturingOrder2);
		$manager->persist($orderSize2XL);

		// total quantity of sizes
		$totalQuantity = $orderSize2M->getQuantity() + $orderSize2L->getQuantity() + $orderSize2XL->getQuantity();

		$manufacturingOrder2->setCreatedAt(new \DateTimeImmutable('now'))
			->setTotalQuantity($totalQuantity)
			->setUnitTime($this->faker->randomNumber(3, true))
			->setUnitPrice($unitPrice)
			->setTotalPrice($totalQuantity * $unitPrice)
			->setObservation($this->faker->text())
			->setUrgent($this->faker->boolean())
			->setLaunched(false)
			->setDenied($this->faker->boolean())
			->setClient($this->getReference(ClientFixtures::CLIENT2))
			->setArticle($this->getReference(ArticleFixtures::ARTICLE2));
		$manager->persist($manufacturingOrder2);
		///////////////////////////////////////////////////////////////////////

		$manager->flush();
	}

	public function getDependencies() {
		return [
			ClientFixtures::class,
			ArticleFixtures::class,
			SizeFixtures::class
		];
	}
}
