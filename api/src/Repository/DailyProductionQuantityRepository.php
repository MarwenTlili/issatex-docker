<?php

namespace App\Repository;

use App\Entity\DailyProductionQuantity;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<DailyProductionQuantity>
 *
 * @method DailyProductionQuantity|null find($id, $lockMode = null, $lockVersion = null)
 * @method DailyProductionQuantity|null findOneBy(array $criteria, array $orderBy = null)
 * @method DailyProductionQuantity[]    findAll()
 * @method DailyProductionQuantity[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class DailyProductionQuantityRepository extends ServiceEntityRepository {
    public function __construct(ManagerRegistry $registry) {
        parent::__construct($registry, DailyProductionQuantity::class);
    }

    public function save(DailyProductionQuantity $entity, bool $flush = false): void {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(DailyProductionQuantity $entity, bool $flush = false): void {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    //    /**
    //     * @return DailyProductionQuantity[] Returns an array of DailyProductionQuantity objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('d')
    //            ->andWhere('d.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('d.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?DailyProductionQuantity
    //    {
    //        return $this->createQueryBuilder('d')
    //            ->andWhere('d.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
