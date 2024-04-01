<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Faker\Factory;

class UserFixtures extends Fixture {
	private $passwordHasher;
	protected $faker;

	public const ADMIN = "ADMIN";
	public const USER1 = "USER1";
	public const USER2 = "USER2";
	public const SECRETARY = "SECRETARY";

	public function __construct(UserPasswordHasherInterface $passwordHasher) {
		$this->passwordHasher = $passwordHasher;
	}

	public function load(ObjectManager $manager): void {
		$this->faker = Factory::create();
		$users = [];

		///////////////////////////////////////////////////////////////////////
		/**
		 * Admin prefix
		 */
		$admin = new User();
		$admin->setEmail('admin@example.com')
			->setUsername('admin')
			->setRoles(['ROLE_ADMIN'])
			->setPassword($this->passwordHasher->hashPassword($admin, 'admin'))
			->setCreatedAt(new \DateTimeImmutable('now'))
			->setLastLoginAt(new \DateTimeImmutable('now'))
			->setIsVerified(true);
		array_push($users, $admin);
		///////////////////////////////////////////////////////////////////////
		/**
		 * Clients
		 */
		$user1 = new User();
		$user1->setUsername('client1')
			->setEmail('client1@example.com')
			->setRoles(['ROLE_CLIENT'])
			->setPassword($this->passwordHasher->hashPassword($user1, 'client1'))
			->setCreatedAt(new \DateTimeImmutable('now'))
			->setLastLoginAt(new \DateTimeImmutable('now'))
			->setIsVerified(true);
		array_push($users, $user1);
		///////////////////////////////////////////////////////////////////////
		$user2 = new User();
		$user2->setUsername('client2')
			->setEmail('client2@example.com')
			->setRoles(['ROLE_CLIENT'])
			->setPassword($this->passwordHasher->hashPassword($user2, 'client2'))
			->setCreatedAt(new \DateTimeImmutable('now'))
			->setLastLoginAt(new \DateTimeImmutable('now'))
			->setIsVerified(true);
		array_push($users, $user2);
		///////////////////////////////////////////////////////////////////////
		///////////////////////////////////////////////////////////////////////
		$secretary = new User();
		$secretary->setUsername('secretary')
			->setEmail('secretary@example.com')
			->setRoles(['ROLE_SECRETARY'])
			->setPassword($this->passwordHasher->hashPassword($secretary, 'secretary'))
			->setCreatedAt(new \DateTimeImmutable('now'))
			->setLastLoginAt(new \DateTimeImmutable('now'))
			->setIsVerified(true);
		array_push($users, $secretary);
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
		$this->addReference(self::USER1, $user1);
		$this->addReference(self::USER2, $user2);
		$this->addReference(self::SECRETARY, $secretary);
		///////////////////////////////////////////////////////////////////////
	}
}
