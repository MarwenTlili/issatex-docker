<?php

namespace App\DataFixtures;

use App\Entity\Islet;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class IsletFixtures extends Fixture {
    protected $faker;

    public const ISLET1 = "ISLET1";
    public const ISLET2 = "ISLET2";
    public const ISLET3 = "ISLET3";

    public function load(ObjectManager $manager) {
        $this->faker = Factory::create();
        $islets = [];

        $islet1 = new Islet();
        $islet1->setName('islet1')
            ->setCreatedAt(new \DateTimeImmutable("now"));
        array_push($islets, $islet1);

        $islet2 = new Islet();
        $islet2->setName('islet2')
            ->setCreatedAt(new \DateTimeImmutable("now"));
        array_push($islets, $islet2);

        $islet3 = new Islet();
        $islet3->setName('islet3')
            ->setCreatedAt(new \DateTimeImmutable("now"));
        array_push($islets, $islet3);

        foreach ($islets as $islet) {
            $manager->persist($islet);
        }
        $manager->flush();

        $this->addReference(self::ISLET1, $islet1);
        $this->addReference(self::ISLET2, $islet2);
        $this->addReference(self::ISLET3, $islet3);
    }
}
