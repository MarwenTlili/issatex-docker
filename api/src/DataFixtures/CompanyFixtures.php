<?php

namespace App\DataFixtures;

use App\Entity\Company;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class CompanyFixtures extends Fixture implements DependentFixtureInterface 
{
    protected $faker;

    public function load(ObjectManager $manager): void 
	{
		$this->faker = Factory::create();
		$companies = [];
		
		///////////////////////////////////////////////////////////////////////
		$company1 = new Company();
		$company1->setName($this->faker->company())
			->setAddress($this->faker->address())
			->setPhone($this->faker->phoneNumber())
			->setTrn($this->faker->md5())
			->setDescription($this->faker->text())
			->setAccount($this->getReference(UserFixtures::USER1_COMPANY));
		array_push($companies, $company1);
		///////////////////////////////////////////////////////////////////////
		
		foreach ($companies as $company) {
			$manager->persist($company);
		}
        $manager->flush();
    }

	public function getDependencies(){
        return [
            UserFixtures::class
        ];
    }
}
