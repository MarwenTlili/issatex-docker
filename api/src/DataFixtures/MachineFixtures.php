<?php

namespace App\DataFixtures;

use App\Entity\Machine;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class MachineFixtures extends Fixture implements DependentFixtureInterface {
    protected $faker;

    public const MACHINE1 = "MACHINE1";
    public const MACHINE2 = "MACHINE2";
    public const MACHINE3 = "MACHINE3";
    public const MACHINE4 = "MACHINE4";
    public const MACHINE5 = "MACHINE5";
    public const MACHINE6 = "MACHINE6";

    public function load(ObjectManager $manager) {
        $this->faker = Factory::create();
        $machines = [];

        $machine1 = new Machine();
        $machine1->setName('Rieter R40')
            ->setCategory('Ring Spinning')
            ->setBrand('Rieter')
            ->setIlot($this->getReference(IlotFixtures::ILOT1));
        array_push($machines, $machine1);

        $machine2 = new Machine();
        $machine2->setName('Toyota Air Jet Loom')
            ->setCategory('Air Jet Weaving')
            ->setBrand('Toyota')
            ->setIlot($this->getReference(IlotFixtures::ILOT1));
        array_push($machines, $machine2);

        $machine3 = new Machine();
        $machine3->setName('Stoll CMS ADF')
            ->setCategory('Computerized Flat Knitting')
            ->setBrand('Stoll')
            ->setIlot($this->getReference(IlotFixtures::ILOT2));
        array_push($machines, $machine3);

        $machine4 = new Machine();
        $machine4->setName('Thies TRD')
            ->setCategory('High-Temperature Dyeing')
            ->setBrand('Thies')
            ->setIlot($this->getReference(IlotFixtures::ILOT2));
        array_push($machines, $machine4);

        $machine5 = new Machine();
        $machine5->setName('Reggiani Renoir')
            ->setCategory('Digital Textile Printing')
            ->setBrand('Reggiani')
            ->setIlot($this->getReference(IlotFixtures::ILOT3));
        array_push($machines, $machine5);

        $machine6 = new Machine();
        $machine6->setName('Monforts Montex 6500')
            ->setCategory('Continuous Dyeing and Finishing')
            ->setBrand('Monforts')
            ->setIlot($this->getReference(IlotFixtures::ILOT3));
        array_push($machines, $machine6);

        foreach ($machines as $machine) {
            $manager->persist($machine);
        }
        $manager->flush();

        $this->addReference(self::MACHINE1, $machine1);
        $this->addReference(self::MACHINE2, $machine2);
        $this->addReference(self::MACHINE3, $machine3);
        $this->addReference(self::MACHINE4, $machine4);
        $this->addReference(self::MACHINE5, $machine5);
        $this->addReference(self::MACHINE6, $machine6);
    }

    public function getDependencies() {
        return [
            IlotFixtures::class
        ];
    }
}
