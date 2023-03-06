<?php

namespace App\Repository;

use App\Entity\ManufacturingOrderSize;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ManufacturingOrderSize>
 *
 * @method ManufacturingOrderSize|null find($id, $lockMode = null, $lockVersion = null)
 * @method ManufacturingOrderSize|null findOneBy(array $criteria, array $orderBy = null)
 * @method ManufacturingOrderSize[]    findAll()
 * @method ManufacturingOrderSize[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ManufacturingOrderSizeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ManufacturingOrderSize::class);
    }

    public function save(ManufacturingOrderSize $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(ManufacturingOrderSize $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

//    /**
//     * @return ManufacturingOrderSize[] Returns an array of ManufacturingOrderSize objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('m')
//            ->andWhere('m.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('m.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?ManufacturingOrderSize
//    {
//        return $this->createQueryBuilder('m')
//            ->andWhere('m.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
