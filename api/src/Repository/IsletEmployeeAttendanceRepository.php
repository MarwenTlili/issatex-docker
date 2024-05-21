<?php

namespace App\Repository;

use App\Entity\IsletEmployeeAttendance;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<IsletEmployeeAttendance>
 *
 * @method IsletEmployeeAttendance|null find($id, $lockMode = null, $lockVersion = null)
 * @method IsletEmployeeAttendance|null findOneBy(array $criteria, array $orderBy = null)
 * @method IsletEmployeeAttendance[]    findAll()
 * @method IsletEmployeeAttendance[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class IsletEmployeeAttendanceRepository extends ServiceEntityRepository {
    public function __construct(ManagerRegistry $registry) {
        parent::__construct($registry, IsletEmployeeAttendance::class);
    }

    public function save(IsletEmployeeAttendance $entity, bool $flush = false): void {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(IsletEmployeeAttendance $entity, bool $flush = false): void {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    //    /**
    //     * @return IsletEmployeeAttendance[] Returns an array of IsletEmployeeAttendance objects
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

    //    public function findOneBySomeField($value): ?IsletEmployeeAttendance
    //    {
    //        return $this->createQueryBuilder('i')
    //            ->andWhere('i.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
