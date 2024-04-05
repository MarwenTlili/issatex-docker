<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use App\Entity\Choice;

class ChoiceFixtures extends Fixture {
    protected $faker;

    public const FIRST = "FIRST";
    public const SECOND = "SECOND";

    public function load(ObjectManager $manager): void {
        $choice1 = new Choice();
        $choice1->setName('First');
        $manager->persist($choice1);

        $choice2 = new Choice();
        $choice2->setName('Second');
        $manager->persist($choice2);

        $manager->flush();
    }
}
