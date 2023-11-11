<?php

namespace App\Filter;

use ApiPlatform\Doctrine\Orm\Filter\AbstractFilter;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\Uid\Ulid;

final class CustomClientAccountFilter extends AbstractFilter {
    /**
     * filter OneToOne uni-directional client->account(User)
     * filter "Clients" where property "<User>account" has ULID/id value
     * @route GET https://localhost/api/clients?account={ULID}
     * @param int|Long|ULID account
     * @return Client
     */
    protected function filterProperty(
        string $property,
        $value,
        QueryBuilder $queryBuilder,
        QueryNameGeneratorInterface $queryNameGenerator,
        string $resourceClass,
        Operation $operation = null,
        array $context = []
    ): void {
        if ($property !== 'account') {
            return; // Skip other properties than account
        }

        // Generate a unique parameter name to avoid collisions with other filters
        $parameterName = $queryNameGenerator->generateParameterName($property);

        // return the root aliases (entity alias) of the query
        $rootAlias = $queryBuilder->getRootAliases()[0];

        /**
         * convert ulid to uuid (identifier as a RFC4122)
         * ex: "01GVBT4M5EJGJR7T19CGJESTGS" to "0186d7a2-50ae-9425-83e8-296424ecea19"
         */
        $uuid = Ulid::fromString($value)->toRfc4122();

        $queryBuilder
            ->andWhere(sprintf('%s.account = :%s', $rootAlias, $parameterName))
            ->setParameter($parameterName, $uuid);
    }

    public function getDescription(string $resourceClass): array {
        return [
            'account' => [
                'property' => 'account',
                'type' => 'uuid',
                'required' => false,
                'swagger' => [
                    'description' => 'Filter by related property of the related entity',
                    'name' => 'Related Property Filter',
                ],
            ],
        ];
    }
}
