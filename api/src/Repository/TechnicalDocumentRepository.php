<?php

namespace App\Repository;

use App\Entity\TechnicalDocument;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<TechnicalDocument>
 *
 * @method TechnicalDocument|null find($id, $lockMode = null, $lockVersion = null)
 * @method TechnicalDocument|null findOneBy(array $criteria, array $orderBy = null)
 * @method TechnicalDocument[]    findAll()
 * @method TechnicalDocument[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TechnicalDocumentRepository extends ServiceEntityRepository {
    public function __construct(ManagerRegistry $registry) {
        parent::__construct($registry, TechnicalDocument::class);
    }

    public function save(TechnicalDocument $entity, bool $flush = false): void {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(TechnicalDocument $entity, bool $flush = false): void {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    //    /**
    //     * @return TechnicalDocument[] Returns an array of TechnicalDocument objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('t')
    //            ->andWhere('t.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('t.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?TechnicalDocument
    //    {
    //        return $this->createQueryBuilder('t')
    //            ->andWhere('t.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
