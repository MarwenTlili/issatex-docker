<?php

namespace App\DataFixtures;

use App\Entity\Size;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class SizeFixtures extends Fixture {
    protected $faker;

    public const MEDIUM = "MEDIUM";
    public const LARGE = "LARGE";
    public const EXTRA_LARGE = "EXTRA_LARGE";

    public function load(ObjectManager $manager): void {
        $medium = new Size();
        $medium->setName('Medium');
        $manager->persist($medium);
        $this->addReference(self::MEDIUM, $medium);

        $large = new Size();
        $large->setName('Large');
        $manager->persist($large);
        $this->addReference(self::LARGE, $large);

        $extra_large = new Size();
        $extra_large->setName('Extra Large');
        $manager->persist($extra_large);
        $this->addReference(self::EXTRA_LARGE, $extra_large);

        $manager->flush();
    }
}
