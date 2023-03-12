<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Faker\Factory;

class UserFixtures extends Fixture
{
	private $passwordHasher;
    protected $faker;
	
	public const ADMIN = "ADMIN";
	public const USER1_COMPANY = "USER1_COMPANY";
    public const USER2_CLIENT = "USER2_CLIENT";
    public const USER3_CLIENT = "USER3_CLIENT";
	public const USER4_CLIENT = "USER4_CLIENT";
	public const USER5_CLIENT = "USER5_CLIENT";
	
	public function __construct(UserPasswordHasherInterface $passwordHasher) 
	{
		$this->passwordHasher = $passwordHasher;
	}
	
    public function load(ObjectManager $manager): void 
	{
		$this->faker = Factory::create();
		$users = [];

		///////////////////////////////////////////////////////////////////////
		/**
		 * Admin prefix
		 */
		$datetime = $this->faker->dateTimeBetween('-1 years', 'now');
        $admin = new User();
		$admin->setEmail('admin@example.com')
			->setUsername('admin')
			->setRoles(['ROLE_ADMIN'])
			->setAvatar($this->faker->imageUrl(640, 480, null, false, 'admin', false))
			->setPassword($this->passwordHasher->hashPassword($admin, 'admin'))
			->setCreatedAt(\DateTimeImmutable::createFromMutable($datetime))
			->setLastLoginAt(\DateTimeImmutable::createFromMutable($datetime))
			->isIsVerified(true);
		array_push($users, $admin);
		///////////////////////////////////////////////////////////////////////
		/**
		 * Companies
		 */
		$username = $this->faker->userName();
		$datetime = $this->faker->dateTimeBetween('-1 years', 'now');
		$user1_company = new User();
		$user1_company->setUsername($username)
			->setEmail($this->faker->email())
			->setRoles(['ROLE_COMPANY'])
			->setAvatar($this->faker->imageUrl(640, 480, null, false, $username, false))
				->setPassword($this->passwordHasher->hashPassword($user1_company, $username))
				->setCreatedAt(\DateTimeImmutable::createFromMutable($datetime))
				->setLastLoginAt(\DateTimeImmutable::createFromMutable($datetime))
				->isIsVerified(true);
		array_push($users, $user1_company);
		///////////////////////////////////////////////////////////////////////
		/**
		 * Clients
		 */
		$username = $this->faker->userName();
		$datetime = $this->faker->dateTimeBetween('-1 years', 'now');
		$user2_client = new User();
		$user2_client->setUsername($username)
			->setEmail($this->faker->email())
			->setRoles(['ROLE_CLIENT'])
			->setAvatar($this->faker->imageUrl(640, 480, null, false, $username, false))
				->setPassword($this->passwordHasher->hashPassword($user2_client, $username))
				->setCreatedAt(\DateTimeImmutable::createFromMutable($datetime))
				->setLastLoginAt(\DateTimeImmutable::createFromMutable($datetime))
				->isIsVerified(true);
		array_push($users, $user2_client);
		///////////////////////////////////////////////////////////////////////
		$username = $this->faker->userName();
		$datetime = $this->faker->dateTimeBetween('-1 years', 'now');
		$user3_client = new User();
		$user3_client->setUsername($username)
			->setEmail($this->faker->email())
			->setRoles(['ROLE_CLIENT'])
			->setAvatar($this->faker->imageUrl(640, 480, null, false, $username, false))
				->setPassword($this->passwordHasher->hashPassword($user3_client, $username))
				->setCreatedAt(\DateTimeImmutable::createFromMutable($datetime))
				->setLastLoginAt(\DateTimeImmutable::createFromMutable($datetime))
				->isIsVerified(true);
		array_push($users, $user3_client);
		///////////////////////////////////////////////////////////////////////
		$username = $this->faker->userName();
		$datetime = $this->faker->dateTimeBetween('-1 years', 'now');
		$user4_client = new User();
		$user4_client->setUsername($username)
			->setEmail($this->faker->email())
			->setRoles(['ROLE_CLIENT'])
			->setAvatar($this->faker->imageUrl(640, 480, null, false, $username, false))
				->setPassword($this->passwordHasher->hashPassword($user4_client, $username))
				->setCreatedAt(\DateTimeImmutable::createFromMutable($datetime))
				->setLastLoginAt(\DateTimeImmutable::createFromMutable($datetime))
				->isIsVerified(true);
		array_push($users, $user4_client);
		///////////////////////////////////////////////////////////////////////
		$username = $this->faker->userName();
		$datetime = $this->faker->dateTimeBetween('-1 years', 'now');
		$user5_client = new User();
		$user5_client->setUsername($username)
			->setEmail($this->faker->email())
			->setRoles(['ROLE_CLIENT'])
			->setAvatar($this->faker->imageUrl(640, 480, null, false, $username, false))
				->setPassword($this->passwordHasher->hashPassword($user5_client, $username))
				->setCreatedAt(\DateTimeImmutable::createFromMutable($datetime))
				->setLastLoginAt(\DateTimeImmutable::createFromMutable($datetime))
				->isIsVerified(true);
		array_push($users, $user5_client);
		///////////////////////////////////////////////////////////////////////
		
		/**
		 * persist User objects
		 */
		foreach ($users as $user) {
			$manager->persist($user);
		}
		// persist data
        $manager->flush();
		///////////////////////////////////////////////////////////////////////
		/**
		 * Set the reference entry identified by PUBLIC CONST and referenced to managed USER
		 */
		$this->addReference(self::ADMIN, $admin);

		$this->addReference(self::USER1_COMPANY, $user1_company);

		$this->addReference(self::USER2_CLIENT, $user2_client);
		$this->addReference(self::USER3_CLIENT, $user3_client);
		$this->addReference(self::USER4_CLIENT, $user4_client);
		$this->addReference(self::USER5_CLIENT, $user5_client);
		///////////////////////////////////////////////////////////////////////
    }
}
