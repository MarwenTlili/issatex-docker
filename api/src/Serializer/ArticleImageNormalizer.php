<?php

namespace App\Serializer;

use App\Entity\ArticleImage;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareTrait;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Vich\UploaderBundle\Storage\StorageInterface;

/**
 * Resolving the File URL 'contentUrl'
 */
final class ArticleImageNormalizer implements NormalizerInterface, NormalizerAwareInterface {
    use NormalizerAwareTrait;

    private const ALREADY_CALLED = 'ARTICLE_IMAGE_NORMALIZER_ALREADY_CALLED';
    private $entityManager;

    public function __construct(private StorageInterface $storage, EntityManagerInterface $entityManager) {
        $this->entityManager = $entityManager;
    }

    public function normalize($object, ?string $format = null, array $context = []): array|string|int|float|bool|\ArrayObject|null {
        $context[self::ALREADY_CALLED] = true;

        // set the contentUrl
        $object->setContentUrl($this->storage->resolveUri($object, 'file'));
        $this->entityManager->persist($object);
        $this->entityManager->flush();

        return $this->normalizer->normalize($object, $format, $context);
    }

    public function supportsNormalization($data, ?string $format = null, array $context = []): bool {
        if (isset($context[self::ALREADY_CALLED])) {
            return false;
        }

        return $data instanceof ArticleImage;
    }
}
