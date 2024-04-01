<?php

namespace App\DataFixtures;

use App\Entity\Article;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class ArticleFixtures extends Fixture implements DependentFixtureInterface {
	protected $faker;

	public const ARTICLE1 = "ARTICLE1";
	public const ARTICLE2 = "ARTICLE2";
	public const ARTICLE3 = "ARTICLE3";
	public const ARTICLE4 = "ARTICLE4";
	public const ARTICLE5 = "ARTICLE5";
	public const ARTICLE6 = "ARTICLE6";

	public function load(ObjectManager $manager): void {
		$this->faker = Factory::create();
		$articles = [];

		///////////////////////////////////////////////////////////////////////
		$article1 = new Article();
		$article1->setDesignation($this->faker->unique()->sentence(3))
			->setModel($this->faker->unique()->sentence())
			->setComposition($this->faker->text())
			->setClient($this->getReference(ClientFixtures::CLIENT1));
		array_push($articles, $article1);
		///////////////////////////////////////////////////////////////////////
		$article2 = new Article();
		$article2->setDesignation($this->faker->unique()->sentence(3))
			->setModel($this->faker->unique()->sentence())
			->setComposition($this->faker->text())
			->setClient($this->getReference(ClientFixtures::CLIENT1));
		array_push($articles, $article2);
		///////////////////////////////////////////////////////////////////////
		$article3 = new Article();
		$article3->setDesignation($this->faker->unique()->sentence(3))
			->setModel($this->faker->unique()->sentence())
			->setComposition($this->faker->text())
			->setClient($this->getReference(ClientFixtures::CLIENT1));
		array_push($articles, $article3);
		///////////////////////////////////////////////////////////////////////
		$article4 = new Article();
		$article4->setDesignation($this->faker->unique()->sentence(3))
			->setModel($this->faker->unique()->sentence())
			->setComposition($this->faker->text())
			->setClient($this->getReference(ClientFixtures::CLIENT2));
		array_push($articles, $article4);
		///////////////////////////////////////////////////////////////////////
		$article5 = new Article();
		$article5->setDesignation($this->faker->unique()->sentence(3))
			->setModel($this->faker->unique()->sentence())
			->setComposition($this->faker->text())
			->setClient($this->getReference(ClientFixtures::CLIENT2));
		array_push($articles, $article5);
		///////////////////////////////////////////////////////////////////////
		$article6 = new Article();
		$article6->setDesignation($this->faker->unique()->sentence(3))
			->setModel($this->faker->unique()->sentence())
			->setComposition($this->faker->text())
			->setClient($this->getReference(ClientFixtures::CLIENT2));
		array_push($articles, $article6);
		///////////////////////////////////////////////////////////////////////

		foreach ($articles as $article) {
			$manager->persist($article);
		}
		$manager->flush();

		///////////////////////////////////////////////////////////////////////
		$this->addReference(self::ARTICLE1, $article1);
		$this->addReference(self::ARTICLE2, $article2);
		$this->addReference(self::ARTICLE3, $article3);
		$this->addReference(self::ARTICLE4, $article4);
		$this->addReference(self::ARTICLE5, $article5);
		$this->addReference(self::ARTICLE6, $article6);
		///////////////////////////////////////////////////////////////////////
	}

	public function getDependencies() {
		return [
			UserFixtures::class,
			ClientFixtures::class
		];
	}
}
