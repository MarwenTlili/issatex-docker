<?php

namespace App\DataFixtures;

use App\Entity\Employee;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class EmployeeFixtures extends Fixture {
    protected $faker;

    public const EMPLOYEE1 = "EMPLOYEE1";
    public const EMPLOYEE2 = "EMPLOYEE2";
    public const EMPLOYEE3 = "EMPLOYEE3";
    public const EMPLOYEE4 = "EMPLOYEE4";
    public const EMPLOYEE5 = "EMPLOYEE5";
    public const EMPLOYEE6 = "EMPLOYEE6";

    public function load(ObjectManager $manager) {
        $this->faker = Factory::create();
        $employees = [];

        $employee1 = new Employee();
        $employee1->setFirstName($this->faker->firstName())
            ->setLastName($this->faker->lastName())
            ->setRegistrationCode("ISS_PW_" . $this->faker->unique()->randomNumber(3, true))
            ->setCategory("PRODUCTION_WORKER")
            ->setRecruitmentAt(new \DateTimeImmutable("now"));
        array_push($employees, $employee1);

        $employee2 = new Employee();
        $employee2->setFirstName($this->faker->firstName())
            ->setLastName($this->faker->lastName())
            ->setRegistrationCode("ISS_PW_" . $this->faker->unique()->randomNumber(3, true))
            ->setCategory("PRODUCTION_WORKER")
            ->setRecruitmentAt(new \DateTimeImmutable("now"));
        array_push($employees, $employee2);

        $employee3 = new Employee();
        $employee3->setFirstName($this->faker->firstName())
            ->setLastName($this->faker->lastName())
            ->setRegistrationCode("ISS_PW_" . $this->faker->unique()->randomNumber(3, true))
            ->setCategory("PRODUCTION_WORKER")
            ->setRecruitmentAt(new \DateTimeImmutable("now"));
        array_push($employees, $employee3);

        $employee4 = new Employee();
        $employee4->setFirstName($this->faker->firstName())
            ->setLastName($this->faker->lastName())
            ->setRegistrationCode("ISS_PW_" . $this->faker->unique()->randomNumber(3, true))
            ->setCategory("PRODUCTION_WORKER")
            ->setRecruitmentAt(new \DateTimeImmutable("now"));
        array_push($employees, $employee4);

        $employee5 = new Employee();
        $employee5->setFirstName($this->faker->firstName())
            ->setLastName($this->faker->lastName())
            ->setRegistrationCode("ISS_PW_" . $this->faker->unique()->randomNumber(3, true))
            ->setCategory("PRODUCTION_WORKER")
            ->setRecruitmentAt(new \DateTimeImmutable("now"));
        array_push($employees, $employee5);

        $employee6 = new Employee();
        $employee6->setFirstName($this->faker->firstName())
            ->setLastName($this->faker->lastName())
            ->setRegistrationCode("ISS_PW_" . $this->faker->unique()->randomNumber(3, true))
            ->setCategory("PRODUCTION_WORKER")
            ->setRecruitmentAt(new \DateTimeImmutable("now"));
        array_push($employees, $employee6);
        ///////////////////////////////////////////////////////////////////////
        foreach ($employees as $employee) {
            $manager->persist($employee);
        }
        $manager->flush();
        ///////////////////////////////////////////////////////////////////////
        $this->addReference(self::EMPLOYEE1, $employee1);
        $this->addReference(self::EMPLOYEE2, $employee2);
        $this->addReference(self::EMPLOYEE3, $employee3);
        $this->addReference(self::EMPLOYEE4, $employee4);
        $this->addReference(self::EMPLOYEE5, $employee5);
        $this->addReference(self::EMPLOYEE6, $employee6);
        ///////////////////////////////////////////////////////////////////////


    }
}
