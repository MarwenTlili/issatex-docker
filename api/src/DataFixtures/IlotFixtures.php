<?php

namespace App\DataFixtures;

use App\Entity\Ilot;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class IlotFixtures extends Fixture {
    protected $faker;

    public const ILOT1 = "ILOT1";
    public const ILOT2 = "ILOT2";
    public const ILOT3 = "ILOT3";

    public function load(ObjectManager $manager) {
        $this->faker = Factory::create();
        $ilots = [];

        $ilot1 = new Ilot();
        $ilot1->setName('ilot1')
            ->setCreatedAt(new \DateTimeImmutable("now"));
        array_push($ilots, $ilot1);

        $ilot2 = new Ilot();
        $ilot2->setName('ilot2')
            ->setCreatedAt(new \DateTimeImmutable("now"));
        array_push($ilots, $ilot2);

        $ilot3 = new Ilot();
        $ilot3->setName('ilot3')
            ->setCreatedAt(new \DateTimeImmutable("now"));
        array_push($ilots, $ilot3);

        foreach ($ilots as $ilot) {
            $manager->persist($ilot);
        }
        $manager->flush();

        $this->addReference(self::ILOT1, $ilot1);
        $this->addReference(self::ILOT2, $ilot2);
        $this->addReference(self::ILOT3, $ilot3);
    }
}
