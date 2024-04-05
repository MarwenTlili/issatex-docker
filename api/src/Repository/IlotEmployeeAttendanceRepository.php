<?php

namespace App\Repository;

use App\Entity\IlotEmployeeAttendance;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<IlotEmployeeAttendance>
 *
 * @method IlotEmployeeAttendance|null find($id, $lockMode = null, $lockVersion = null)
 * @method IlotEmployeeAttendance|null findOneBy(array $criteria, array $orderBy = null)
 * @method IlotEmployeeAttendance[]    findAll()
 * @method IlotEmployeeAttendance[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class IlotEmployeeAttendanceRepository extends ServiceEntityRepository {
    public function __construct(ManagerRegistry $registry) {
        parent::__construct($registry, IlotEmployeeAttendance::class);
    }

    public function save(IlotEmployeeAttendance $entity, bool $flush = false): void {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(IlotEmployeeAttendance $entity, bool $flush = false): void {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    //    /**
    //     * @return IlotEmployeeAttendance[] Returns an array of IlotEmployeeAttendance objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('i')
    //            ->andWhere('i.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('i.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?IlotEmployeeAttendance
    //    {
    //        return $this->createQueryBuilder('i')
    //            ->andWhere('i.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
